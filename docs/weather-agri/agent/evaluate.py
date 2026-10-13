"""Execute versioned fixtures; report contract checks, never model accuracy."""
import argparse
import copy
import csv
import json
import platform
import time
from datetime import datetime,timezone
from pathlib import Path

from agent import NOW,answer,default_fixture,fingerprint,model_tool_loop
from providers import Provider,ProviderError
from workflow import Store,WorkflowError,authenticate,derived_overdue,validate_observation


def observation():
    return {'field_id':'A','station':'A区站点','factor':'humidity','value':65,'unit':'%','observed_at':'2026-07-18T11:00:00+08:00'}


def execute(case,version,engine='reference'):
    fx=case['fixture_data'];op=case.get('operation','chat')
    if op=='chat':
        if engine=='model':return model_tool_loop(Provider.from_env(),case['input'],fx)
        return answer(case['input'],fx,version)
    if op=='login':return {'authenticated':authenticate(**case['request'])}
    with_store=Store()
    try:
        rec=answer('A区强降雨前做什么？',default_fixture(),version)
        data={'title':'巡检A区排水沟','owner':'现场人员','due_at':'2026-07-18T18:00:00+08:00','field_id':'A','authorized_field_id':'A','confirmed':True,'review':{'decision':'approved','weather_checked':True,'drainage_checked':True,'safety_checked':True,'reviewer':'农技人员','note':'已核对排水与安全条件'},'recommendation':rec}
        if op.startswith('task'):
            task=with_store.create('F1',data,'key-01')
            if op=='task_create':return {'status':task['status'],'review':task['review']['decision'],'snapshot':bool(task['recommendation_snapshot'])}
            if op=='task_duplicate':return {'same_id':with_store.create('F1',data,'key-01')['id']==task['id'],'count':len(with_store.list('F1'))}
            if op=='task_complete_empty':
                started=with_store.update(task['id'],'F1',{'version':1,'status':'进行中'})
                return with_store.update(task['id'],'F1',{'version':2,'status':'已完成','feedback':{}})
            if op=='task_cancel':
                updated=with_store.update(task['id'],'F1',{'version':1,'status':'已取消','cancel_reason':'降雨已结束，改由负责人复核'})
                return {'status':updated['status'],'audit_count':len(with_store.history(task['id'],'F1'))}
            if op=='task_snapshot':
                original=copy.deepcopy(task['recommendation_snapshot']);rec['summary']='new version';rec['rule_version']='new-rule'
                saved=with_store.read(task['id'],'F1')
                return {'snapshot_preserved':saved['recommendation_snapshot']==original}
        if op=='observation':return {'valid':bool(validate_observation(case['request']))}
        if op=='observation_retry':
            # Failure is injected before a database commit; retry uses the same key.
            log=[]
            try:raise TimeoutError('injected_transport_timeout')
            except TimeoutError:log.append('input_retained')
            request=copy.deepcopy(case['request']);a=with_store.save_observation('F1',request,'obs-01');b=with_store.save_observation('F1',request,'obs-01')
            return {'same_id':a['id']==b['id'],'input_retained':request==case['request'],'failures':log}
        raise ValueError('Unknown operation '+op)
    except WorkflowError as exc:return {'error':exc.code}
    finally:with_store.close()


def grade(actual,expected):
    failures=[]
    for key,value in expected.items():
        if key=='min_evidence':
            if len(actual.get('evidence',[]))<value:failures.append('insufficient_evidence_count')
        elif key=='max_tool_calls':
            if len(actual.get('tool_trace',[]))>value:failures.append('tool_limit')
        elif key=='wind_ms':
            if abs(actual.get('wind_ms',1e9)-value)>.01:failures.append('unit_conversion')
        elif key=='actions_nonempty':
            if bool(actual.get('actions'))!=value:failures.append('action_contract')
        elif actual.get(key)!=value:failures.append(key+': '+str(actual.get(key))+' != '+str(value))
    if actual.get('status')!='answer' and actual.get('actions'):failures.append('unsafe_actions_on_nonanswer')
    if actual.get('code')=='inspection_draft':
        ids={item['id'] for item in actual.get('evidence',[])}
        if any(not set(a.get('source_ids',[])).issubset(ids) for a in actual.get('actions',[])):failures.append('unresolved_source')
    return failures


def run(cases,version,engine='reference'):
    rows=[]
    for case in cases:
        started=time.perf_counter()
        try:actual=execute(case,version,engine)
        except ProviderError as exc:actual={'status':'tool_error','code':str(exc),'model_execution':'not_completed'}
        except Exception as exc:actual={'exception':type(exc).__name__,'message':str(exc)}
        failures=grade(actual,case['expected_machine'])
        rows.append({'case_id':case['id'],'version':version,'engine':engine,'fixture_hash':fingerprint(case['fixture_data']),'input':case['input'],'actual':actual,'expected_machine':case['expected_machine'],'pass':not failures,'failures':failures,'latency_ms':round((time.perf_counter()-started)*1000,3)})
    return rows


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--cases',default=str(Path(__file__).parent.parent/'evaluation-cases-v2.jsonl'));parser.add_argument('--output',default=str(Path(__file__).parent.parent/'evaluation-v2'));parser.add_argument('--engine',choices=['reference','model'],default='reference');args=parser.parse_args()
    cases=[json.loads(line) for line in Path(args.cases).read_text(encoding='utf-8').splitlines() if line.strip()]
    out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    versions=['ablation-v0','v2'] if args.engine=='reference' else ['v2']
    summary={'date':datetime.now(timezone.utc).isoformat(),'suite_hash':fingerprint(cases),'environment':platform.platform(),'engine':args.engine,'model_requested':args.engine=='model','model_live':False,'cases':len(cases),'versions':{},'scope':'tool and business contract checks; not agronomic correctness or model accuracy'}
    all_rows=[]
    for version in versions:
        rows=run(cases,version,args.engine);all_rows+=rows
        summary['versions'][version]={'passed':sum(r['pass'] for r in rows),'total':len(rows),'failed_case_ids':[r['case_id'] for r in rows if not r['pass']]}
        (out/(version+'-runs.jsonl')).write_text('\n'.join(json.dumps(r,ensure_ascii=False) for r in rows)+'\n',encoding='utf-8')
    summary['model_live']=any(row['actual'].get('engine')=='model_tool_planner' and row['actual'].get('model') for row in all_rows)
    summary['completed_model_cases']=sum(bool(row['actual'].get('model')) for row in all_rows)
    (out/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
    with (out/'results.csv').open('w',encoding='utf-8-sig',newline='') as stream:
        writer=csv.DictWriter(stream,fieldnames=['case_id','version','engine','pass','latency_ms','failures','fixture_hash']);writer.writeheader()
        for row in all_rows:writer.writerow({k:json.dumps(row[k],ensure_ascii=False) if k=='failures' else row[k] for k in writer.fieldnames})
    print(json.dumps(summary,ensure_ascii=False,indent=2))
    if args.engine=='reference' and summary['versions']['v2']['passed']!=len(cases):raise SystemExit(1)
