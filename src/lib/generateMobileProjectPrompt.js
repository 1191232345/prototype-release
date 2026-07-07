import { countLines } from './utils';
import { CREATE_CONFIRM_PHRASE, REQUIREMENTS_CONFIRM_PHRASE } from './generateProjectPrompt';
const MAX_PROMPT_LINES = 300;
export function generateMobileProjectPrompt(input) {
    const version = input.version ?? 'v1';
    const today = new Date().toISOString().slice(0, 10);
    const dir = `prototypes/${input.slug}/${version}`;
    const prompt = `# 原型归档 · 移动端新项目创建 Prompt

> 项目：${input.name}（${input.slug}/${version}）
> 平台：**移动端 / PDA**
> 设计系统：\`elsa-pda\`
> 生成日期：${today}

---

## ⚠️ 执行规则（必须严格遵守）

1. **分四个阶段执行，不可跳步、不可合并**
2. 每个阶段完成后 **必须停止**，等待用户输入或确认
3. 阶段一：澄清需求，确认语为 **「${REQUIREMENTS_CONFIRM_PHRASE}」**
4. 阶段二：整理原型方案，确认语为 **「${CREATE_CONFIRM_PHRASE}」**
5. 仅在收到对应确认语后，才可进入下一阶段
6. 所有代码文件单文件不超过 **300 行**
7. 遵循 \`prototype-archive/.cursor/rules/prototype.mdc\` 规范
8. **移动端约束**：固定视口 390×844，使用 \`MobileDeviceFrame\`；触控目标 ≥ 44px

---

# 阶段零：准备创建（现在执行）

## 项目信息

| 字段 | 内容 |
|------|------|
| 项目名称 | ${input.name} |
| 目录 slug | ${input.slug} |
| 版本 | ${version} |
| 目标目录 | ${dir}/ |
| 平台 | 移动端（PDA） |
| designSystem | elsa-pda |

## 参考模板

请参考 \`prototypes/sku-信息填充-pda/v1/\` 的 Flow 模式：

- **一级**：任务列表（\`sku-fill-pda-list\`）— 卡片列表 + 搜索/筛选
- **二级**：任务执行（\`sku-fill-pda-task\`）— 工单信息 + SKU 表单 + 底部操作
- 详情数据放 \`pages/task.details.json\`，列表点击 \`navigate('task', { rowId })\`

## 请你现在执行

1. 简要确认已理解项目名称、目录与**移动端**定位（1-2 句）
2. **不要编写任何文件，不要假设业务需求**
3. 引导用户说明：**现状、痛点、诉求**（侧重仓库/现场使用场景）

输出最后一行必须是：
\`\`\`
📝 请描述本移动端项目的现状、痛点与诉求（使用设备、操作场景、网络环境等）。我会逐轮追问，信息足够后再整理需求理解供您确认。
\`\`\`

---

# 阶段一：需求澄清（与用户多轮对话）

> ⛔ 阶段零未完成前，禁止执行本阶段

## 对话原则

1. **先听用户说**：关注现场操作、单手/双手、弱网、扫码等移动端特有问题
2. **逐轮追问**：每次最多 **1～3 个** 问题
3. **禁止**在本阶段输出 Pattern / 页面字段明细

## 信息足够后，输出需求理解摘要

### 1. 现状 / 2. 痛点 / 3. 诉求与目标
### 4. 目标用户与典型场景（设备、环境）
### 5. 范围边界（做 / 不做）
### 6. 建议页面流（仅页面级）

| 页面 ID | Pattern 建议 | 标题 | 职责 |
|---------|-------------|------|------|

（常见：\`list\` → \`sku-fill-pda-list\`；\`task\` → \`sku-fill-pda-task\`）

**阶段一结束。请等待用户确认。**

输出最后一行必须是：
\`\`\`
✋ 需求理解已完成。若理解正确，请回复「${REQUIREMENTS_CONFIRM_PHRASE}」；若有误请直接指出需修正之处。
\`\`\`

---

# 阶段二：移动端原型方案细化

> ⛔ 未收到「${REQUIREMENTS_CONFIRM_PHRASE}」前，禁止执行本阶段

## 2.1 任务列表页 · 检索与筛选

| 筛选项 | 类型 | 说明 |
|--------|------|------|

## 2.2 任务列表页 · 卡片展示字段

| 字段 | 展示说明 |
|------|----------|

## 2.3 任务列表 · 点击进入二级页

| 行为 | 目标页面 | 参数 |
|------|----------|------|

## 2.4 任务执行页 · 工单信息（只读/折叠）

| 展示项 | 说明 |
|--------|------|

## 2.5 任务执行页 · 可编辑区块（如 SKU 表单）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|

## 2.6 任务执行页 · 底部操作（formActions）

| 按钮 | 行为 |
|------|------|

## 2.7 Mock 数据

| 场景 | 要求 |
|------|------|
| 列表行 | ≥2 条，覆盖不同状态 |
| details | 每条列表行对应 task.details.json 条目 |

**阶段二结束。请等待用户确认。**

输出最后一行必须是：
\`\`\`
✋ 移动端原型方案已整理。若方案正确，请回复「${CREATE_CONFIRM_PHRASE}」；若有调整请直接说明。
\`\`\`

---

# 阶段三：创建项目

> ⛔ 未收到「${CREATE_CONFIRM_PHRASE}」前，禁止执行本阶段

## 创建目录

\`\`\`
${dir}/
├── flow.json              # entry: list；pages: [list, task, ...]
├── pages/
│   ├── list.json          # pattern: sku-fill-pda-list
│   ├── task.json          # pattern: sku-fill-pda-task
│   └── task.details.json  # rowId → 详情数据
├── meta.json              # designSystem: elsa-pda
├── PRD.md / REQUIREMENTS.md / CHANGELOG.md / ACCEPTANCE.md
\`\`\`

## 创建要求

1. **meta.json** 中 \`designSystem\` 必须为 \`elsa-pda\`
2. 列表页 \`pageMode: "pda"\`，表格行 \`id\` 与 details 键一致
3. 执行页含 \`formActions\`，详情通过 \`details[rowId]\` 加载
4. 若需新 Pattern，在 \`src/packages/patterns/\` 实现并注册，复用 \`MobileDeviceFrame\`
5. PRD 第 3 章按页面拆分锚点（如 \`{#list.init}\`、\`{#task.init}\`）
6. 运行 \`npm run validate\` 与 \`npm run build\`（0 error）
7. 运行 \`npm run acceptance:gen -- ${input.slug}/${version}\`

## 约束 checklist

- [ ] designSystem = elsa-pda
- [ ] 两级页面：列表 → 执行
- [ ] 移动端固定屏宽，内容区可滚动
- [ ] PRD / REQUIREMENTS 完整
- [ ] validate 0 error
`;
    const lines = countLines(prompt);
    if (lines > MAX_PROMPT_LINES) {
        throw new Error(`Prompt 超过 ${MAX_PROMPT_LINES} 行（当前 ${lines} 行）`);
    }
    return prompt;
}
export function getMobilePromptLineCount(input) {
    return countLines(generateMobileProjectPrompt(input));
}
