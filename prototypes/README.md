# 原型数据目录

发布版**不包含**内置示例原型，请在本目录自行创建或复制项目数据。

## 目录结构

```
prototypes/{项目名}/{版本}/
├── flow.json
├── pages/
├── meta.json
├── PRD.md
├── REQUIREMENTS.md
├── CHANGELOG.md
├── CREATE.prompt.md
└── ITERATE.prompt.md
```

## 使用方式

1. 将原型项目放入 `prototypes/{项目名}/{版本}/`
2. 重启 `npm run dev`，项目将出现在侧边栏列表

## 说明

- 本工具仅分发运行程序与混淆后的源码，**不附带**业务原型 Spec
- 也可使用 Cursor + 创建 Prompt 在本目录新建项目
