"""Network adapters. Configuration and secrets come from the server environment."""
import json
import os
import urllib.error
import urllib.parse
import urllib.request


class ProviderError(Exception):
    pass


class Provider:
    def __init__(self, kind, base_url, model, api_key="", timeout=20):
        parsed=urllib.parse.urlparse(base_url)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc or parsed.username:
            raise ProviderError("invalid_base_url")
        if parsed.scheme == "http" and parsed.hostname not in {"localhost", "127.0.0.1", "::1"}:
            raise ProviderError("https_required")
        if kind not in {"ollama", "compatible"} or not model:
            raise ProviderError("invalid_configuration")
        self.kind,self.base_url,self.model,self.api_key,self.timeout=kind,base_url.rstrip("/"),model,api_key,timeout
        self.usage={"input_tokens":0,"output_tokens":0}

    @classmethod
    def from_env(cls):
        kind=os.getenv("AGRI_PROVIDER", "")
        if not kind:
            raise ProviderError("provider_not_configured")
        return cls(kind,os.getenv("AGRI_BASE_URL", "http://127.0.0.1:11434"),os.getenv("AGRI_MODEL", ""),os.getenv("AGRI_API_KEY", ""))

    def chat(self,messages,tools):
        payload={"model":self.model,"messages":messages,"tools":tools,"stream":False}
        if self.kind == "ollama":
            payload["options"]={"temperature":0}
            payload["messages"]=[{k:v for k,v in m.items() if k not in {"tool_call_id"}} for m in messages]
            for m in payload["messages"]:
                if m.get("role")=="tool":m["tool_name"]=m.pop("name", "")
                for call in m.get("tool_calls",[]):
                    if isinstance(call["function"].get("arguments"),str):call["function"]["arguments"]=json.loads(call["function"]["arguments"])
            endpoint=self.base_url+"/api/chat"
        else:
            payload["temperature"]=0
            # OpenAI-compatible servers expect arguments as JSON strings.
            payload["messages"]=json.loads(json.dumps(messages))
            for m in payload["messages"]:
                for call in m.get("tool_calls",[]):
                    if isinstance(call["function"].get("arguments"),dict):call["function"]["arguments"]=json.dumps(call["function"]["arguments"])
            endpoint=self.base_url+"/chat/completions"
        headers={"Content-Type":"application/json"}
        if self.api_key:headers["Authorization"]="Bearer "+self.api_key
        request=urllib.request.Request(endpoint,data=json.dumps(payload).encode(),headers=headers)
        try:
            with urllib.request.urlopen(request,timeout=self.timeout) as response:
                raw=json.load(response)
        except urllib.error.HTTPError as exc:
            raise ProviderError("provider_http_"+str(exc.code)) from None
        except (urllib.error.URLError,TimeoutError):
            raise ProviderError("provider_unavailable") from None
        except (ValueError,KeyError,TypeError):
            raise ProviderError("provider_invalid_json") from None
        try:
            if self.kind == "ollama":
                message=raw["message"]
                self.usage["input_tokens"]+=raw.get("prompt_eval_count",0)
                self.usage["output_tokens"]+=raw.get("eval_count",0)
            else:
                message=raw["choices"][0]["message"]
                self.usage["input_tokens"]+=raw.get("usage",{}).get("prompt_tokens",0)
                self.usage["output_tokens"]+=raw.get("usage",{}).get("completion_tokens",0)
            return {"content":message.get("content") or "", "tool_calls":message.get("tool_calls") or []}
        except (KeyError,IndexError,TypeError):
            raise ProviderError("provider_invalid_response") from None
