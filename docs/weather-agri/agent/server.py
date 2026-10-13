"""Local-only development service. No third-party packages are required."""
import argparse
import copy
import json
import mimetypes
import os
import secrets
import time
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote,urlparse

from agent import NOW,WorkflowError,answer,default_fixture,model_tool_loop
from providers import Provider,ProviderError
from workflow import Store,authenticate,derived_overdue,validate_observation

ROOT=Path(__file__).resolve().parent.parent
SESSIONS={}
RECOMMENDATIONS={}
STORE=None


class Handler(BaseHTTPRequestHandler):
    def log_message(self,format,*args):
        return  # bodies, tokens and credentials are never logged

    def send_json(self,code,data):
        payload=json.dumps(data,ensure_ascii=False).encode()
        self.send_response(code);self.send_header("Content-Type","application/json; charset=utf-8");self.send_header("Cache-Control","no-store");self.send_header("Content-Length",str(len(payload)));self.end_headers();self.wfile.write(payload)

    def auth(self):
        token=self.headers.get("Authorization","").removeprefix("Bearer ")
        session=SESSIONS.get(token)
        if not session or session["expires"]<time.time():raise WorkflowError("unauthenticated")
        return session

    def body(self):
        length=int(self.headers.get("Content-Length",0))
        if length>100000:raise WorkflowError("body_too_large")
        return json.loads(self.rfile.read(length) or b'{}')

    def do_GET(self):
        route=urlparse(self.path).path
        try:
            if route=="/api/health":return self.send_json(200,{"mode":"local_development","engine":"rule_reference","model_configured":bool(os.getenv("AGRI_PROVIDER")),"scenario_time":NOW})
            if route=="/api/tasks":
                session=self.auth();tasks=STORE.list(session["farm_id"])
                for task in tasks:task["overdue"]=derived_overdue(task)
                return self.send_json(200,{"tasks":tasks})
            if route.startswith('/api/tasks/') and route.endswith('/history'):
                session=self.auth();return self.send_json(200,{"events":STORE.history(route.split('/')[3],session['farm_id'])})
            if route.startswith('/api/'):return self.send_json(404,{"error":"not_found"})
            target=(ROOT/unquote(route).lstrip('/')).resolve() if route!='/' else ROOT/'index.html'
            if not target.is_relative_to(ROOT) or any(p.startswith('.') for p in target.relative_to(ROOT).parts) or target.suffix not in {'.html','.css','.png','.pdf','.json','.csv','.jsonl'} or not target.is_file():return self.send_json(404,{"error":"not_found"})
            data=target.read_bytes();self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(target.name)[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        except WorkflowError as exc:self.send_json(401 if exc.code=='unauthenticated' else 403,{"error":exc.code})

    def do_POST(self):
        route=urlparse(self.path).path
        try:
            # Only same-origin local browser requests are accepted.
            origin=self.headers.get('Origin')
            if origin and origin not in {'http://127.0.0.1:'+str(self.server.server_port),'http://localhost:'+str(self.server.server_port)}:raise WorkflowError('origin_not_allowed')
            data=self.body()
            if route=='/api/login':
                if not authenticate(data.get('username'),data.get('password'),os.getenv('AGRI_DEMO_USER','admin'),os.getenv('AGRI_DEMO_PASSWORD','password')):return self.send_json(401,{"error":"invalid_credentials"})
                token=secrets.token_urlsafe(32);SESSIONS[token]={"farm_id":"F1","expires":time.time()+3600}
                return self.send_json(200,{"token":token,"farm_id":"F1","mode":"local_development"})
            session=self.auth()
            if route=='/api/logout':
                token=self.headers.get('Authorization','').removeprefix('Bearer ');SESSIONS.pop(token,None);return self.send_json(200,{"ok":True})
            if route=='/api/agent/chat':
                fixture=default_fixture();fixture['farm_id']=session['farm_id']
                field_id=data.get('field_id','A')
                fixture['field_id']=field_id
                if field_id!='A':fixture['field']['id']=field_id;fixture['field']['crop']='水稻' if field_id=='C' else '小麦'
                context=data.get('field_context',{})
                for key in ['stage','drainage','site_safe','last_inspected_at']:
                    if key in context:fixture['field'][key]=context[key]
                scenario=data.get('scenario','normal')
                if scenario=='missing':fixture['field']['stage']=None
                if scenario=='stale':fixture['weather']['issued_at']='2026-07-18T03:00:00+08:00'
                if scenario=='timeout':fixture['fault']='timeout'
                if scenario=='empty':fixture['knowledge']=None
                if data.get('engine')=='model':result=model_tool_loop(Provider.from_env(),data.get('message',''),fixture)
                else:result=answer(data.get('message',''),fixture)
                if result.get('request_id'):RECOMMENDATIONS[result['request_id']]={"farm_id":session['farm_id'],"field_id":field_id,"result":copy.deepcopy(result)}
                return self.send_json(200,result)
            if route=='/api/tasks':
                saved=RECOMMENDATIONS.get(data.get('recommendation_id'))
                if not saved or saved['farm_id']!=session['farm_id']:raise WorkflowError('recommendation_invalid')
                data['recommendation']=saved['result'];data['authorized_field_id']=saved['field_id']
                task=STORE.create(session['farm_id'],data,self.headers.get('Idempotency-Key'))
                return self.send_json(201,task)
            if route=='/api/observations':
                record=validate_observation(data)
                if record['field_id']!='A':raise WorkflowError('forbidden')
                saved=STORE.save_observation(session['farm_id'],record,self.headers.get('Idempotency-Key'))
                return self.send_json(201,saved)
            return self.send_json(404,{"error":"not_found"})
        except WorkflowError as exc:
            code=401 if exc.code=='unauthenticated' else (403 if exc.code in {'forbidden','origin_not_allowed'} else (409 if exc.code=='version_conflict' else 422))
            self.send_json(code,{"error":exc.code})
        except ProviderError as exc:self.send_json(503,{"error":str(exc),"model_execution":"not_completed"})
        except (ValueError,KeyError,TypeError):self.send_json(422,{"error":"invalid_request"})

    def do_PATCH(self):
        try:
            origin=self.headers.get('Origin')
            if origin and origin not in {'http://127.0.0.1:'+str(self.server.server_port),'http://localhost:'+str(self.server.server_port)}:raise WorkflowError('origin_not_allowed')
            session=self.auth();route=urlparse(self.path).path
            if not route.startswith('/api/tasks/'):return self.send_json(404,{"error":"not_found"})
            task=STORE.update(route.split('/')[3],session['farm_id'],self.body())
            return self.send_json(200,task)
        except WorkflowError as exc:self.send_json(401 if exc.code=='unauthenticated' else (409 if exc.code=='version_conflict' else 422),{"error":exc.code})
        except (ValueError,KeyError,TypeError):self.send_json(422,{"error":"invalid_request"})


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8787);parser.add_argument('--db',default=str(Path(__file__).parent/'data'/'weather-agri-local.sqlite3'));args=parser.parse_args()
    Path(args.db).parent.mkdir(parents=True,exist_ok=True)
    STORE=Store(args.db)
    print('Local development: http://127.0.0.1:'+str(args.port)+'/prototype.html',flush=True)
    try:ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
    except KeyboardInterrupt:STORE.close()
