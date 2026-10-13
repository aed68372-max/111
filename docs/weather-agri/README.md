# 天气智农 · 雅安玉米排水巡检 V2

本期覆盖粮用玉米灌浆期强降雨前的排水巡检：资料补充 → 建议 → 人工复核 → 确认任务 → 修改/取消/逾期 → 执行反馈。

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

本地下载包运行时把 docs/weather-agri/ 替换为当前目录。打开 http://127.0.0.1:8787/prototype.html，演示账号 admin / password。服务仅绑定127.0.0.1。默认数据保存在agent/data/，不提交到仓库；用--db指定独立测试库。会话和临时建议在服务重启后清空，任务与监测持久化。

## 模型接入

已实现Ollama及兼容接口适配；当前尚未配置真实模型。环境变量：

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
```

模型负责只读工具规划，决策仍通过业务规则门控；不代表已评估自由文本质量。无配置会明确失败，不用参考流程冒充真实模型结果。

## 本轮结果

40/40规则契约通过；受控消融对照32/40（非历史线上版本）；25/25后端/模拟协议测试、17/17网页验证通过。Figma15个可编辑Frame、26条流程跳转。真实模型推理0次，农艺评审和田间试点尚未开展。预报、地块和规则适用资料均为合成示例。50mm/24h采用气象降水等级作候选巡检触发，不是玉米受害阈值。

原始来源：[源码33cf9da](https://github.com/aed68372-max/111/tree/33cf9da8a82ee4253a962ebe75eb1e4d1fb8722a)。原React项目使用模拟数据，本地服务为本轮新增独立实现。
