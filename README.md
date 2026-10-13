# 天气智农 · 雅安玉米排水巡检 V2

本期覆盖粮用玉米灌浆期强降雨前的排水巡检：资料补充 → 建议 → 人工复核 → 确认任务 → 修改/取消/逾期 → 执行反馈。

- [PRD](docs/weather-agri/PRD.html) / [PDF](docs/weather-agri/PRD.pdf)
- [原生可编辑Figma](https://www.figma.com/design/unJmyC3ffNLYfT4tMTOxYl)
- [可运行网页](docs/weather-agri/prototype.html) / [交互规格](docs/weather-agri/interaction-spec.html)
- [评测报告](docs/weather-agri/evaluation.html) / [40条具体输入](docs/weather-agri/evaluation-cases-v2.jsonl) / [运行记录](docs/weather-agri/evaluation-v2/v2-runs.jsonl)

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

## 原React应用

## 当前应用

- 农场概览：作物数量、健康率、预警与产量示例。
- 作物详情：生长阶段、健康状态和模拟趋势。
- 气象展示：环境趋势、风险提示、云量与降水示例。
- 监测填报：监测站点、因子、数值与附件表单；现有提交为前端演示。
- 通知中心：类型筛选、搜索、已读状态与删除。

## 本地运行

需要Node.js 18或更高版本及pnpm。

```bash
git clone https://github.com/aed68372-max/111.git
cd 111
pnpm install
pnpm dev
```

访问http://localhost:3000，演示账号为admin / password。

```bash
pnpm build
pnpm preview
```

## 目录

```text
src/pages/                 页面
src/components/Dashboard/  农场与气象组件
src/lib/mockData.ts        模拟数据
src/contexts/              前端登录上下文
docs/weather-agri/         产品、交互与测试资料
```

## 技术栈

React 18、TypeScript、Vite、React Router、Tailwind CSS、Recharts。


## 后续接入

本地验证服务已实现只读工具规划接口、任务/监测保存和审计。生产天气、农艺审签、多人权限、自动重评及真实模型评测仍待完成。
