# 天气智农（企业端）

面向农场管理者的气象风险与农事管理项目，集中展示作物状态、环境指标、风险提示和通知。现有应用使用模拟数据；产品评审资料进一步定义了农事助手、人工确认任务和监测反馈流程。

## 产品资料

资料集中在 [docs/weather-agri](docs/weather-agri/README.md)，版本V1.1，日期2026-10-13。

| 内容 | 文件 |
| --- | --- |
| PRD需求文档 | [PDF](docs/weather-agri/PRD.pdf) / [可编辑HTML](docs/weather-agri/PRD.html) |
| 可点击交互原型 | [prototype.html](docs/weather-agri/prototype.html) |
| 交互与设计规格 | [PDF](docs/weather-agri/interaction-spec.pdf) / [HTML](docs/weather-agri/interaction-spec.html) |
| Agent效果评测报告 | [PDF](docs/weather-agri/evaluation.pdf) / [HTML](docs/weather-agri/evaluation.html) |
| 40条测试用例 | [CSV](docs/weather-agri/evaluation-cases.csv) / [JSONL](docs/weather-agri/evaluation-cases.jsonl) |
| 界面验收记录 | [19项界面检查](docs/weather-agri/verification.html) |

![企业端概览](docs/weather-agri/previews/overview-desktop.png)

交互原型不依赖项目安装。下载完整资料目录后打开index.html即可体验。浏览器演示记录支持留存、导出与重置。原型助手采用场景脚本，真实模型与后端尚未接入；40条效果用例未执行，界面检查结果单独记录。

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

## 后续研发

按PRD接入真实气象与地块资料，完成服务端身份认证、监测保存、任务留痕、Agent工具调用及知识检索。上线判断以实际服务验收与运行记录为依据。
