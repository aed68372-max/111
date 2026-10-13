# 天气智农 


- [PRD](PRD.html) / [PDF](PRD.pdf)
- [原生可编辑Figma](https://www.figma.com/design/unJmyC3ffNLYfT4tMTOxYl)
- [可运行网页](prototype.html) / [交互规格](interaction-spec.html)
- [评测报告](evaluation.html) / [40条具体输入](evaluation-cases-v2.jsonl) / [运行记录](evaluation-v2/v2-runs.jsonl)

## 运行

需Python 3.10+，仅用标准库。在仓库根目录执行：

```text
python docs/weather-agri/agent/server.py
python docs/weather-agri/agent/evaluate.py
python docs/weather-agri/agent/test_backend.py
```

## 模型接入

已实现Ollama及兼容接口适配；请自行配置真实模型。环境变量：

|变量|含义|
|---|---|
|AGRI_PROVIDER|ollama 或 compatible|
|AGRI_BASE_URL|Ollama例：http://127.0.0.1:11434；兼容服务填含/v1的地址|
|AGRI_MODEL|支持工具调用的已安装/可用模型名称|
|AGRI_API_KEY|兼容服务密钥，只在服务环境设置|
|AGRI_DEMO_USER / AGRI_DEMO_PASSWORD|本地开发账号（见server.py实际变量配置）|

配置后重新启动，在设置页选择模型模式。另存评测：

```text
python docs/weather-agri/agent/evaluate.py --engine model --output work/model-evaluation

## 本轮结果

40/40规则契约通过；受控消融对照32/40（非历史线上版本）；25/25后端/模拟协议测试、17/17网页验证通过。Figma15个可编辑Frame、26条流程跳转。真实模型推理0次，农艺评审和田间试点尚未开展。预报、地块和规则适用资料均为合成示例。50mm/24h采用气象降水等级作候选巡检触发，不是玉米受害阈值。
立实现。
