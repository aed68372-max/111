"""HTTP adapters and workflow invariants. All model responses are explicit mocks."""
import copy,json,threading,unittest,urllib.error,urllib.request
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from unittest.mock import patch
import server
from agent import NOW,WorkflowError,answer,default_fixture,model_tool_loop
from providers import Provider,ProviderError
from workflow import Store,derived_overdue,validate_observation


class FakeModel(BaseHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_POST(self):
        data=json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        self.server.requests.append(data)
        if self.server.mode=='http403':self.send_response(403);self.end_headers();return
        turn=sum(m['role']=='tool' for m in data['messages'])
        call=lambda name,args:{'id':'call-'+name,'type':'function','function':{'name':name,'arguments':args}}
        if self.server.mode=='badargs':calls=[call('get_field_context','invalid-json')]
        elif self.server.mode=='foreign':calls=[call('get_field_context',{'field_id':'OTHER'})]
        elif self.server.mode=='write':calls=[call('open_valve',{'field_id':'A'})]
        elif self.server.mode=='loop':calls=[call('get_field_context',{'field_id':'A'})]
        elif self.server.mode=='skip':calls=[]
        elif turn==0:calls=[call(n,{'field_id':'A'}) for n in ['get_field_context','get_weather_forecast','get_active_alerts','search_agri_knowledge']]
        else:calls=[]
        message={'role':'assistant','content':'mock final','tool_calls':calls}
        if self.path=='/api/chat':payload={'message':message,'prompt_eval_count':10,'eval_count':5}
        else:payload={'choices':[{'message':message}],'usage':{'prompt_tokens':10,'completion_tokens':5}}
        raw=json.dumps(payload).encode();self.send_response(200);self.send_header('Content-Type','application/json');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)


class ProviderTests(unittest.TestCase):
    def setUp(self):
        self.service=ThreadingHTTPServer(('127.0.0.1',0),FakeModel);self.service.mode='normal';self.service.requests=[]
        self.thread=threading.Thread(target=self.service.serve_forever,daemon=True);self.thread.start()
    def tearDown(self):self.service.shutdown();self.service.server_close();self.thread.join()
    def provider(self,kind='ollama'):
        base='http://127.0.0.1:'+str(self.service.server_port)+('/v1' if kind=='compatible' else '')
        return Provider(kind,base,'mock-model',timeout=1)
    def test_ollama_tool_roundtrip(self):
        result=model_tool_loop(self.provider(),'A区降雨排水巡检',default_fixture());self.assertEqual(result['code'],'inspection_draft');self.assertEqual(len(result['model_tool_trace']),4);self.assertEqual(result['usage']['input_tokens'],20)
    def test_compatible_tool_roundtrip(self):
        result=model_tool_loop(self.provider('compatible'),'A区降雨排水巡检',default_fixture());self.assertEqual(result['code'],'inspection_draft');self.assertTrue(all(isinstance(c['function']['arguments'],str) for c in self.service.requests[-1]['messages'][2]['tool_calls']))
    def test_bad_arguments(self):self.service.mode='badargs';self.assertEqual(model_tool_loop(self.provider('compatible'),'排水',default_fixture())['code'],'invalid_tool_arguments')
    def test_foreign_field(self):self.service.mode='foreign';self.assertEqual(model_tool_loop(self.provider(),'排水',default_fixture())['code'],'forbidden')
    def test_write_tool_blocked(self):self.service.mode='write';self.assertEqual(model_tool_loop(self.provider(),'排水',default_fixture())['code'],'tool_not_allowed')
    def test_tool_loop_bounded(self):self.service.mode='loop';self.assertEqual(model_tool_loop(self.provider(),'排水',default_fixture())['rounds'],6)
    def test_skipped_evidence(self):self.service.mode='skip';self.assertEqual(model_tool_loop(self.provider(),'排水',default_fixture())['code'],'model_skipped_required_tools')
    def test_http_error(self):
        self.service.mode='http403'
        with self.assertRaisesRegex(ProviderError,'provider_http_403'):self.provider().chat([],[])


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        self.store=Store();self.rec=answer('A区降雨排水巡检',default_fixture())
        self.data={'title':'排水巡检','owner':'现场人员','due_at':'2026-07-18T18:00:00+08:00','field_id':'A','authorized_field_id':'A','confirmed':True,'review':{'decision':'approved','weather_checked':True,'drainage_checked':True,'safety_checked':True,'reviewer':'现场负责人','note':'安全条件已复核'},'recommendation':self.rec}
    def tearDown(self):self.store.close()
    def create(self):return self.store.create('F1',self.data,'key')
    def test_review_gate(self):
        for key in ('weather_checked','drainage_checked','safety_checked'):
            self.data['review'][key]=False
            with self.assertRaisesRegex(WorkflowError,'review_required'):self.create()
            self.data['review'][key]=True
        self.data['review']['decision']='rejected'
        with self.assertRaisesRegex(WorkflowError,'review_required'):self.create()
    def test_no_confirmation(self):
        self.data['confirmed']=False
        with self.assertRaisesRegex(WorkflowError,'confirmation_required'):self.create()
    def test_edit_preserves_snapshot(self):
        task=self.create();before=copy.deepcopy(task['recommendation_snapshot']);new=self.store.update(task['id'],'F1',{'version':1,'owner':'农技人员','due_at':'2026-07-18T19:00:00+08:00','change_reason':'延后至雨前安全窗口'});self.assertEqual(new['recommendation_snapshot'],before);self.assertEqual(len(self.store.history(task['id'],'F1')),2)
    def test_optimistic_conflict(self):
        task=self.create();self.store.update(task['id'],'F1',{'version':1,'status':'进行中'})
        with self.assertRaisesRegex(WorkflowError,'version_conflict'):self.store.update(task['id'],'F1',{'version':1,'status':'进行中'})
    def test_terminal_state_immutable(self):
        task=self.create();self.store.update(task['id'],'F1',{'version':1,'status':'已取消','cancel_reason':'取消并改由人工跟进'})
        with self.assertRaisesRegex(WorkflowError,'terminal_state'):self.store.update(task['id'],'F1',{'version':2,'status':'待处理'})
    def test_overdue_derived(self):
        task=self.create();self.assertTrue(derived_overdue(task,'2026-07-18T19:00:00+08:00'));self.assertEqual(task['status'],'待处理')
    def test_cross_farm_read(self):
        task=self.create()
        with self.assertRaisesRegex(WorkflowError,'forbidden'):self.store.read(task['id'],'F2')
    def test_unsafe_site_has_no_actions(self):
        fixture=default_fixture();fixture['field']['site_safe']=False;result=answer('A区排水巡检',fixture);self.assertEqual(result['code'],'site_unsafe');self.assertEqual(result['actions'],[])
    def test_unknown_drainage_clarifies(self):
        fixture=default_fixture();fixture['field']['drainage']='unknown';self.assertEqual(answer('A区排水巡检',fixture)['code'],'drainage_unknown')
    def test_unknown_weather_time(self):
        fixture=default_fixture();fixture['weather']['issued_at']='2026-07-18T09:00:00';self.assertEqual(answer('A区排水巡检',fixture)['code'],'weather_time_unknown')


class ServerTests(unittest.TestCase):
    def setUp(self):
        self.env=patch.dict('os.environ',{'AGRI_DEMO_USER':'admin','AGRI_DEMO_PASSWORD':'password','AGRI_PROVIDER':''});self.env.start();server.STORE=Store();server.SESSIONS.clear();server.RECOMMENDATIONS.clear();self.service=ThreadingHTTPServer(('127.0.0.1',0),server.Handler);self.thread=threading.Thread(target=self.service.serve_forever,daemon=True);self.thread.start();self.base='http://127.0.0.1:'+str(self.service.server_port)
    def tearDown(self):self.service.shutdown();self.service.server_close();self.thread.join();server.STORE.close();self.env.stop()
    def request(self,path,method='GET',data=None,token=None,key=None):
        headers={'Content-Type':'application/json'}
        if token:headers['Authorization']='Bearer '+token
        if key:headers['Idempotency-Key']=key
        req=urllib.request.Request(self.base+path,data=None if data is None else json.dumps(data).encode(),headers=headers,method=method)
        try:
            with urllib.request.urlopen(req,timeout=2) as response:return response.status,json.load(response)
        except urllib.error.HTTPError as error:return error.code,json.load(error)
    def login(self):return self.request('/api/login','POST',{'username':'admin','password':'password'})[1]['token']
    def test_unauthenticated_tasks(self):self.assertEqual(self.request('/api/tasks')[0],401)
    def test_bad_login(self):self.assertEqual(self.request('/api/login','POST',{'username':'admin','password':'wrong'})[0],401)
    def test_reference_chat_real_http(self):
        token=self.login();code,result=self.request('/api/agent/chat','POST',{'message':'A区强降雨排水巡检','field_id':'A'},token);self.assertEqual(code,200);self.assertEqual(result['code'],'inspection_draft');self.assertEqual(len(result['tool_trace']),4)
    def test_no_model_config_no_fake_result(self):
        code,result=self.request('/api/agent/chat','POST',{'message':'排水','engine':'model'},self.login());self.assertEqual(code,503);self.assertEqual(result['model_execution'],'not_completed')
    def test_task_confirm_and_idempotency(self):
        token=self.login();rec=self.request('/api/agent/chat','POST',{'message':'A区强降雨排水巡检'},token)[1];body={'field_id':'A','title':'排水巡检','owner':'现场人员','due_at':'2026-07-18T18:00:00+08:00','confirmed':True,'review':{'decision':'approved','weather_checked':True,'drainage_checked':True,'safety_checked':True,'reviewer':'实际复核人','note':'排水与安全已核对'},'recommendation_id':rec['request_id']};first=self.request('/api/tasks','POST',body,token,'test-key')[1];second=self.request('/api/tasks','POST',body,token,'test-key')[1];self.assertEqual(first['id'],second['id']);self.assertEqual(len(self.request('/api/tasks',token=token)[1]['tasks']),1)
    def test_logout_revokes_session(self):
        token=self.login();self.request('/api/logout','POST',{},token);self.assertEqual(self.request('/api/tasks',token=token)[0],401)
    def test_static_path_denied(self):self.assertEqual(self.request('/agent/server.py')[0],404)


if __name__=='__main__':unittest.main(verbosity=2)
