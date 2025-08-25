# 智慧农业助手 - 企业级农场管理系统

![智慧农业助手](https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Smart%20agriculture%20dashboard%2C%20farm%20management%20system%2C%20data%20visualization%2C%20modern%20UI%2C%20professional%20design&sign=768c7911c7817685f1e02b6abc40bd28)

## 项目介绍

智慧农业助手是一款基于Coze实现的企业级农场管理系统，专为现代农业生产设计。该系统集成了作物监测、环境管理、气象预警和农事活动记录等功能，通过数据可视化和智能分析，帮助农场管理者做出更科学的决策，提高农业生产效率和资源利用率。

## 功能特点

- **综合仪表盘**：实时展示农场关键指标，包括作物总数、健康率、预警信息和产量预估
- **作物管理**：详细监测各类作物生长状态、健康状况和产量预测
- **环境监测**：实时跟踪温度、湿度、光照等环境参数，提供趋势分析
- **气象预警**：及时接收天气异常警报，包括降雨、虫害和极端温度预警
- **农事活动记录**：记录和管理灌溉、施肥、病虫害防治等农业活动
- **气候韧性分析**：评估农场对气候变化的适应能力，提供优化建议

## 灵感来源

本项目基于Coze平台开发，旨在将人工智能技术与现代农业结合，通过智能化管理提升农业生产效率和可持续性。系统设计借鉴了当前智慧农业的最佳实践，提供直观易用的界面和强大的数据分析能力。

## 安装与配置

### 前提条件

- Node.js 18.0.0 或更高版本
- pnpm 包管理器

### 安装步骤

1. 克隆本仓库
```bash
git clone https://github.com/aed68372-max/web.git
cd web
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
```
编辑.env文件，根据需要配置API密钥（当前系统使用模拟数据，可不配置真实API密钥）

### 运行项目

```bash
pnpm dev
```
项目将在 http://localhost:3000 启动

## 使用说明

1. 使用演示账号登录系统：
   - 用户名：admin
   - 密码：password

2. 在仪表盘查看农场概况
3. 浏览不同模块：作物管理、环境监测、气象预警等
4. 查看数据分析图表和预警信息
5. 记录和管理农事活动

## 项目结构

- `/src/components` - 可复用UI组件
- `/src/pages` - 页面组件
- `/src/lib` - 工具函数和模拟数据
- `/src/contexts` - React上下文
- `/src/hooks` - 自定义React钩子

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- Recharts 数据可视化
- React Router 路由管理

## 注意事项

- 本系统默认使用模拟数据，无需配置真实API密钥即可体验所有功能
- 如需连接真实传感器或API，请配置相应的环境变量
- 系统设计遵循响应式原则，支持桌面和移动设备访问

## 许可证

本项目基于MIT许可证开源 - 详情参见LICENSE文件