# 原型归档 · 新项目创建 Prompt

> 项目：{{NAME}}（{{PROJECT_KEY}}）
> 生成日期：{{TODAY}}

---

## ⚠️ 执行规则（必须严格遵守）

1. **分四个阶段执行，不可跳步、不可合并**
2. 每个阶段完成后 **必须停止**，等待用户输入或确认
3. 阶段一：澄清需求，确认语为 **「{{REQUIREMENTS_CONFIRM_PHRASE}}」**
4. 阶段二：整理原型方案，确认语为 **「{{CREATE_CONFIRM_PHRASE}}」**
5. 仅在收到对应确认语后，才可进入下一阶段
6. 所有代码文件单文件不超过 **300 行**
7. 遵循 `.cursor/rules/prototype.mdc` 规范

---

# 阶段零：准备创建（现在执行）

## 项目信息

| 字段 | 内容 |
|------|------|
| 项目名称 | {{NAME}} |
| 目录 slug | {{SLUG}} |
| 版本 | {{VERSION}} |
| 目标目录 | {{DIR}}/ |

## 参考项目（请先 Read 理解结构，勿复制全文到对话）

| 文件 | 路径 |
|------|------|
| Flow 骨架 | `prototypes/{{REFERENCE_PROJECT}}/flow.json` |
| 列表 Spec | `prototypes/{{REFERENCE_PROJECT}}/pages/list.json` |
| 表单 Spec | `prototypes/{{REFERENCE_PROJECT}}/pages/form.json` |
| PRD | `prototypes/{{REFERENCE_PROJECT}}/PRD.md` |
| 规范 | `.cursor/rules/prototype.mdc` |

## 请你现在执行

1. **Read** 上表参考文件，简要确认已理解项目目录与参考结构（1-2 句）
2. **不要编写任何文件，不要假设业务需求**
3. 引导用户在本对话中说明：**现状、痛点、诉求**

输出最后一行必须是：
```
📝 请描述本项目的现状（目前怎么做/用什么）、痛点（哪里不顺/效率低/易出错）、诉求（希望做成什么样）。我会逐轮追问不确定之处，信息足够后再整理需求理解供您确认。
```

---

# 阶段一：需求澄清（与用户多轮对话）

> ⛔ 阶段零未完成前，禁止执行本阶段

## 对话原则

1. **先听用户说**：鼓励用户自由描述现状、痛点、诉求，不要抢先替用户下结论
2. **逐轮追问**：对不确定、模糊、有歧义的内容进行反问
   - 每次最多提 **1～3 个** 问题，避免一次性抛出长清单
   - 优先澄清：业务对象、使用角色、核心场景、成功标准、边界与例外
3. **信息不足时继续问**，不要强行进入总结
4. **禁止**在本阶段输出 filters / table / 按钮等原型细节

## 信息足够后，输出需求理解摘要

### 1. 现状
### 2. 痛点
### 3. 诉求与目标
### 4. 目标用户与典型场景
### 5. 范围边界（做 / 不做）
### 6. 建议页面流（仅页面级，不含字段明细）

| 页面 ID | Pattern 建议 | 标题 | 职责 |
|---------|-------------|------|------|

### 7. 仍待后续细化的点（留到阶段二）

**阶段一结束。请等待用户确认。**

输出最后一行必须是：
```
✋ 需求理解已完成。若理解正确，请回复「{{REQUIREMENTS_CONFIRM_PHRASE}}」；若有误请直接指出需修正之处，我会更新后再请您确认。
```

---

# 阶段二：原型方案细化（用户确认需求后执行）

> ⛔ 未收到「{{REQUIREMENTS_CONFIRM_PHRASE}}」前，禁止执行本阶段

基于阶段一已确认的需求，整理**可写入 flow.json + pages/*.json 的原型方案**（Markdown 表格）：

## 2.1 列表页 · 检索条件（filters）

| 字段 ID | 标签 | 类型 | 选项/占位 | 说明 |
|---------|------|------|-----------|------|

## 2.2 列表页 · 工具栏按钮

| 按钮 | 行为 | 说明 |
|------|------|------|

## 2.3 列表页 · 表格展示列（columns）

| 列 key | 列标题 | 展示说明 |
|--------|--------|----------|

## 2.4 列表页 · 行操作按钮（actions）

| 行状态/条件 | 可用操作 | 行为说明 |
|-------------|----------|----------|

## 2.5 详情 / 表单页方案（如有）

| 页面 | 分区/字段要点 |
|------|---------------|

## 2.6 关键交互路径（简要）

## 2.7 Mock 数据方案

| 状态/场景 | mock 行要求 | 说明 |
|-----------|-------------|------|
| 下拉筛选项 | 各非「全部」选项至少 1 行 | 便于验收筛选 |
| 总行数 | 2～20 条 | 不宜过少或过多 |

**阶段二结束。请等待用户确认。**

输出最后一行必须是：
```
✋ 原型方案已整理。若方案正确，请回复「{{CREATE_CONFIRM_PHRASE}}」；若有调整请直接说明，我会修订后再请您确认。
```

---

# 阶段三：创建项目（用户确认方案后执行）

> ⛔ 未收到「{{CREATE_CONFIRM_PHRASE}}」前，禁止执行本阶段

## 创建目录

```
{{DIR}}/
├── flow.json
├── pages/
│   ├── list.json
│   └── form.json          # 如有
├── CREATE.prompt.md       # 本文件（创建流程 Prompt）
├── ITERATE.prompt.md      # 迭代流程 Prompt（可运行 npm run prompts:gen 更新）
├── meta.json
├── CHANGELOG.md
├── REQUIREMENTS.md
├── PRD.md
└── ACCEPTANCE.md
```

## 创建要求

1. flow.json + pages/*.json 严格按阶段二方案编写
2. **meta.json 必填字段**（与 `meta.schema.json` 一致）：
   - `id`、`version`、`title`、`project`、`type`（`flow`）、`mode`（`spec`）
   - `designSystem`（PC：`elsa-enterprise`；移动端/PDA：`elsa-pda`）
   - `author`、`createdAt`、`changeSummary`、`status`（默认 `draft`）
3. **flow.json 的 `pages` 必须是字符串数组**（如 `["list","form"]`），页面定义写在 `pages/{id}.json`，禁止把页面 Spec 内联到 flow.json
4. **REQUIREMENTS.md** 写入阶段一确认的需求
4. **PRD.md** 按 `templates/PRD.template.md` 编写第 3 章，各节含 `{#锚点}`；PRD 只写中文业务名称
5. 运行 `npm run validate` 与 `npm run build`（**0 error**）
6. 运行 `npm run acceptance:gen -- {{SLUG}}/{{VERSION}}`
7. 运行 `npm run prompts:gen -- {{SLUG}}/{{VERSION}}` 同步 Prompt 文件

## 约束 checklist

- [ ] REQUIREMENTS.md / PRD.md 完整
- [ ] mock rows 覆盖筛选项与行操作场景
- [ ] ACCEPTANCE.md 已生成
- [ ] `npm run validate` 0 error
- [ ] 单文件 ≤ 300 行
- [ ] CREATE.prompt.md / ITERATE.prompt.md 已就位
