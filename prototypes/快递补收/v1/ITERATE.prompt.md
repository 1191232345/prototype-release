# 原型归档 · 原型迭代 Prompt

> 项目：快递补收（快递补收/v1）
> 生成日期：2026-07-08

---

## ⚠️ 执行规则（必须严格遵守）

1. **分三个阶段执行，不可跳步**
2. 阶段零完成后 **必须停止**，等待用户在对话中补充变更需求
3. 阶段一完成后 **必须停止**，等待用户确认
4. 仅在用户回复 **「理解正确，继续迭代」** 后，才可进入阶段二
5. 优先修改 `pages/*.json` 与 `flow.json`，**同步更新 `PRD.md`**（第 3 章对应锚点章节）
6. 所有代码文件单文件不超过 **300 行**
7. 遵循 `.cursor/rules/prototype.mdc` 规范

## 迭代模式

本 Prompt 适用于所有 Spec/PRD 变更（含加列、改字段、mock、文案、新页面、改交互流）。

---

# 阶段零：准备迭代（现在执行）

## 项目现状

| 字段 | 内容 |
|------|------|
| 项目名称 | 快递补收 |
| 目录 | prototypes/快递补收/v1 |
| slug | 快递补收 |
| 版本 | v1 |

## 当前项目文件（必须先 Read，禁止依赖本 Prompt 内摘要）

> 执行前请用 Read 工具逐个打开以下文件，基于**最新本地内容**理解现状。

| 优先级 | 文件 | 说明 |
|--------|------|------|
| 1 | `prototypes/快递补收/v1/flow.json` | 入口页、pages 列表 |
| 2 | `prototypes/快递补收/v1/pages/*.json` | 各页 Spec（含 `shared.sections.*.json`、`*.details.json` 等片段） |
| 3 | `prototypes/快递补收/v1/PRD.md` | 评审对照真源（第 3 章锚点） |
| 4 | `prototypes/快递补收/v1/REQUIREMENTS.md` | 需求与变更记录 |
| 5 | `prototypes/快递补收/v1/meta.json` | changeSummary、status |
| 6 | `prototypes/快递补收/v1/CHANGELOG.md` | 历史变更 |

PRD 同步规则与 Checklist 见 **`src/lib/prdSyncGuide.ts`**（`PRD_SYNC_RULES`、`PRD_SYNC_CHECKLIST`）。

## 请你现在执行

1. **Read** 上表文件后，简要确认已理解项目结构（2-3 句即可）
2. **不要修改任何文件**
3. **不要假设变更内容**
4. 明确请用户在**本对话**中补充本次变更需求

输出最后一行必须是：
```
📝 请在本对话中描述本次变更需求（如：列表加列、表单改字段、调整 mock 数据等）。收到后我将分析影响并给出修改方案。
```

---

# 阶段一：变更理解（收到用户需求后执行）

> ⛔ 用户尚未补充变更需求前，禁止执行本阶段

基于用户在对话中描述的变更需求，输出以下内容（Markdown 格式）：

### 1. 变更摘要
### 2. Spec 影响分析（逐 page）
### 3. PRD 影响分析（逐锚点章节：list.filters / list.columns / form.fields 等）
### 4. 交互影响
### 5. 建议修改文件清单（须含 PRD.md）
### 6. 无需修改的部分
### 7. 待澄清问题（如有）

**阶段一结束。请等待用户确认后再继续。**

输出最后一行必须是：
```
✋ 变更理解已完成。若理解正确，请回复「理解正确，继续迭代」；若有误请指出需修正之处。
```

---

# 阶段二：执行迭代（用户确认后才执行）

> ⛔ 未收到「理解正确，继续迭代」前，禁止执行本阶段

## 目标目录

```
prototypes/快递补收/v1/
├── flow.json
├── pages/
├── meta.json
├── CHANGELOG.md
├── REQUIREMENTS.md
├── PRD.md
├── ITERATE.prompt.md    # 本文件
└── ACCEPTANCE.md
```

## 修改要求

1. **优先改 `pages/{id}.json`**：列表列、筛选项、表单字段、mock、按钮等
2. **同步改 `PRD.md`**：按 `src/lib/prdSyncGuide.ts` 映射表更新对应 `{#锚点}` 章节
3. 新增页面时更新 `flow.json` 并创建 `pages/{id}.json`，PRD 新增 `## 3.x` 全套小节
4. 更新 `CHANGELOG.md`、`REQUIREMENTS.md` 变更记录、`meta.changeSummary`
5. 运行 `npm run validate`、`npm run build`（**0 error**）
6. 运行 `npm run acceptance:gen -- 快递补收/v1`
7. 若 Prompt 规则有变，运行 `npm run prompts:gen -- 快递补收/v1`

## 约束 checklist

- [ ] flow.json + pages/*.json 通过 schema 校验
- [ ] PRD 第 3 章受影响锚点已同步
- [ ] mock 覆盖仍满足 validate-mock 规则
- [ ] ACCEPTANCE.md 已更新
- [ ] `npm run validate` 0 error
- [ ] 单文件 ≤ 300 行
- [ ] CHANGELOG / REQUIREMENTS / meta 已更新

