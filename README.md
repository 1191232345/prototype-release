# 原型归档（prototype-archive）

基于 JSON Spec 的企业后台原型归档与预览工具，配合 Cursor AI 完成需求澄清、原型创建与迭代。

## 快速上手（5 分钟）

### 1. 启动

```bash
cd prototype-archive
npm install
npm run dev
```

浏览器打开开发服务器地址，左侧为项目列表，右侧为预览区。

### 2. 新建项目

1. 点击 **新增项目**，填写项目名称
2. 复制自动生成的 **创建 Prompt**，粘贴到 Cursor 对话
3. 按 AI 引导描述 **现状、痛点、诉求**
4. 确认需求：回复 `需求理解正确，继续细化`
5. 确认方案：回复 `理解正确，继续创建`
6. AI 创建 `prototypes/{slug}/v1/` 下文件后，项目自动出现在列表

### 3. 预览与文档

选中项目后，右侧为 **原型预览**（分屏对照：左侧单击控件 → 右侧 PRD 同步定位，原型交互不受影响）。

### 4. 迭代原型

点击 **迭代原型** 复制 Prompt。迭代时 AI 会**同步更新 PRD.md** 对应章节，保持与 Spec 一致。

确认语：`理解正确，继续迭代`

### 5. 编辑项目信息

侧边栏 **编辑信息** 可修改名称、描述、状态（草稿 / 评审中 / 已定稿），无需 AI。

### 6. 校验

```bash
npm run validate   # Schema 校验
npm run build      # 类型检查 + 构建
```

## 目录结构

```
packages/
├── shell/                 # 工具壳层（改工具功能主要在这里）
│   └── src/
│       ├── app/           # UI：列表、预览、分屏、弹窗
│       ├── lib/           # 工具逻辑：项目 CRUD、PRD 解析、发布配置
│       │   └── prompt/    # Prompt 生成（create / iterate / template，统一从 lib/prompt 导入）
│       └── data/          # 项目加载与 glob
└── runtime/               # 原型运行时（业务 Pattern，很少动）
    └── src/
        ├── patterns/      # 业务 Pattern 组件
        ├── renderer/      # Spec 渲染引擎
        ├── ui/            # 共享 UI kit
        └── review/        # PRD 对照 review-id

prototypes/{project}/{version}/
├── flow.json              # Flow 骨架（entry、pages 列表）
├── pages/                 # 按页面拆分的 PageSpec
│   ├── list.json
│   └── form.json
├── changelog.json         # 结构化变更记录（可选）
├── meta.json              # 项目元信息
├── CHANGELOG.md           # 变更记录
├── REQUIREMENTS.md        # 需求文档（现状/痛点/验收标准）
└── PRD.md                 # 产品需求规格（可选）
```

改**工具功能**时优先看 `packages/shell/`；Cursor 会自动应用 `.cursor/rules/tool-dev.mdc` 范围约束。

## 规范

详见 `.cursor/rules/prototype.mdc`

## 常用确认语

| 场景 | 确认语 |
|------|--------|
| 需求澄清完成 | `需求理解正确，继续细化` |
| 原型方案确认 | `理解正确，继续创建` |
| 迭代确认 | `理解正确，继续迭代` |
