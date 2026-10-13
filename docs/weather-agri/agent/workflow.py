"""Persistent local task workflow with review, versions, confirmation and audit."""
import copy
import json
import sqlite3
import threading
import uuid
from datetime import datetime

from agent import NOW, WorkflowError, canonical, dt


class Store:
    def __init__(self, path=":memory:"):
        self.db=sqlite3.connect(path,check_same_thread=False)
        self.db.row_factory=sqlite3.Row
        self.lock=threading.RLock()
        self.db.executescript("""
        CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY,farm_id TEXT NOT NULL,payload TEXT NOT NULL,version INTEGER NOT NULL,idempotency_key TEXT NOT NULL,UNIQUE(farm_id,idempotency_key));
        CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,task_id TEXT,event TEXT,at TEXT,payload TEXT);
        CREATE TABLE IF NOT EXISTS observations(id TEXT PRIMARY KEY,farm_id TEXT,idempotency_key TEXT,payload TEXT,UNIQUE(farm_id,idempotency_key));
        """)

    def close(self):
        self.db.close()

    def read(self, task_id, farm_id):
        row=self.db.execute("SELECT * FROM tasks WHERE id=? AND farm_id=?",(task_id,farm_id)).fetchone()
        if not row:raise WorkflowError("forbidden")
        return json.loads(row["payload"])

    def list(self, farm_id):
        return [json.loads(r["payload"]) for r in self.db.execute("SELECT payload FROM tasks WHERE farm_id=? ORDER BY rowid",(farm_id,))]

    def create(self, farm_id, data, key, now=NOW):
        if not key:raise WorkflowError("idempotency_key_required")
        with self.lock,self.db:
            old=self.db.execute("SELECT payload FROM tasks WHERE farm_id=? AND idempotency_key=?",(farm_id,key)).fetchone()
            if old:return json.loads(old["payload"])
            if data.get("confirmed") is not True:raise WorkflowError("confirmation_required")
            review=data.get("review",{})
            if review.get("decision")!="approved" or not str(review.get("reviewer","")).strip() or len(review.get("note","").strip())<4 or not all(review.get(key) is True for key in ('weather_checked','drainage_checked','safety_checked')):raise WorkflowError("review_required")
            if not data.get("title","").strip() or not data.get("owner"):raise WorkflowError("task_fields_missing")
            if dt(data["due_at"])<=dt(now):raise WorkflowError("deadline_invalid")
            rec=data.get("recommendation",{})
            if rec.get("status")!="answer" or not rec.get("actions") or not rec.get("valid_until") or dt(rec["valid_until"])<=dt(now):raise WorkflowError("recommendation_invalid")
            if data.get("field_id")!=data.get("authorized_field_id"):raise WorkflowError("forbidden")
            task={"id":str(uuid.uuid4()),"farm_id":farm_id,"field_id":data["field_id"],"title":data["title"].strip(),"owner":data["owner"],"due_at":data["due_at"],"status":"待处理","version":1,"review":copy.deepcopy(review),"recommendation_snapshot":copy.deepcopy(rec),"feedback":None}
            self.db.execute("INSERT INTO tasks VALUES(?,?,?,?,?)",(task["id"],farm_id,canonical(task),1,key))
            self._audit(task["id"],"created",now,{"review":review,"actor":data.get("actor","manager")})
            return task

    def _audit(self,id,event,now,data):
        self.db.execute("INSERT INTO audit(task_id,event,at,payload) VALUES(?,?,?,?)",(id,event,now,canonical(data)))

    def update(self,id,farm_id,data,now=NOW):
        with self.lock,self.db:
            task=self.read(id,farm_id)
            if data.get("version")!=task["version"]:raise WorkflowError("version_conflict")
            if task["status"] in {"已完成","已取消"}:raise WorkflowError("terminal_state")
            status=data.get("status",task["status"])
            allowed={"待处理":{"待处理","进行中","已取消"},"进行中":{"进行中","已完成","已取消"}}
            if status not in allowed[task["status"]]:raise WorkflowError("invalid_transition")
            if any(k in data for k in ("title","owner","due_at")):
                if len(data.get("change_reason","").strip())<4:raise WorkflowError("change_reason_required")
                if "due_at" in data and dt(data["due_at"])<=dt(now):raise WorkflowError("deadline_invalid")
                for key in ("title","owner"):
                    if key in data and not str(data[key]).strip():raise WorkflowError("task_fields_missing")
                for key in ("title","owner","due_at"):
                    if key in data:task[key]=data[key]
            if status=="已取消" and len(data.get("cancel_reason","").strip())<4:raise WorkflowError("cancel_reason_required")
            if status=="已完成":
                feedback=data.get("feedback",{})
                if not feedback.get("drainage_checked") or not feedback.get("waterlogging_checked") or len(feedback.get("result","").strip())<4 or not feedback.get("observed_at"):
                    raise WorkflowError("completion_evidence_required")
                if dt(feedback["observed_at"])>dt(now):raise WorkflowError("feedback_time_invalid")
                task["feedback"]=copy.deepcopy(feedback)
            task["status"]=status
            if status=="已取消":task["cancel_reason"]=data["cancel_reason"]
            task["version"]+=1
            self.db.execute("UPDATE tasks SET payload=?,version=? WHERE id=? AND farm_id=?",(canonical(task),task["version"],id,farm_id))
            self._audit(id,"updated",now,{"changes":data,"actor":data.get("actor","manager")})
            return task

    def history(self,id,farm_id):
        self.read(id,farm_id)
        return [dict(row) for row in self.db.execute("SELECT event,at,payload FROM audit WHERE task_id=? ORDER BY id",(id,))]

    def save_observation(self,farm_id,data,key,now=NOW):
        if not key:raise WorkflowError('idempotency_key_required')
        record=validate_observation(data,now)
        with self.lock,self.db:
            previous=self.db.execute('SELECT id FROM observations WHERE farm_id=? AND idempotency_key=?',(farm_id,key)).fetchone()
            if previous:return {'id':previous['id'],'saved':True}
            id=str(uuid.uuid4())
            self.db.execute('INSERT INTO observations VALUES(?,?,?,?)',(id,farm_id,key,canonical(record)))
            return {'id':id,'saved':True}


def authenticate(username,password,expected_user='admin',expected_password='password'):
    return username==expected_user and password==expected_password


def derived_overdue(task,now=NOW):
    return task["status"] in {"待处理","进行中"} and dt(task["due_at"])<dt(now)


def validate_observation(data,now=NOW):
    factor=data.get("factor")
    units={"temperature":"℃","humidity":"%","soil":"%","rain":"mm","wind":"m/s"}
    if factor not in units or data.get("unit")!=units[factor]:raise WorkflowError("factor_unit_mismatch")
    value=data.get("value")
    if not isinstance(value,(int,float)) or isinstance(value,bool) or value!=value or abs(value)==float('inf'):raise WorkflowError("invalid_value")
    if factor=="temperature" and not -60<=value<=60:raise WorkflowError("range_invalid")
    if factor in {"humidity","soil"} and not 0<=value<=100:raise WorkflowError("range_invalid")
    if factor in {"rain","wind"} and value<0:raise WorkflowError("range_invalid")
    if not data.get("station") or not data.get("field_id"):raise WorkflowError("observation_fields_missing")
    observed=dt(data["observed_at"])
    if (observed-dt(now)).total_seconds()>300:raise WorkflowError("observation_time_invalid")
    if factor=="rain":
        if not data.get("period_from") or not data.get("period_to"):raise WorkflowError("rain_period_required")
        if not dt(data["period_from"])<dt(data["period_to"])<=observed:raise WorkflowError("rain_period_invalid")
    return copy.deepcopy(data)
