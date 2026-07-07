import { countLines } from './utils';
import { generateMobileProjectPrompt } from './generateMobileProjectPrompt';
const MAX_PROMPT_LINES = 300;
export const REQUIREMENTS_CONFIRM_PHRASE = '需求理解正确，继续细化';
export const CREATE_CONFIRM_PHRASE = '理解正确，继续创建';
export function generateProjectPrompt(input, platform = 'pc') {
    if (platform === 'mobile') {
        return generateMobileProjectPrompt(input);
    }
    return generatePcProjectPrompt(input);
}
function generatePcProjectPrompt(input) {
    const version = input.version ?? 'v1';
    const today = new Date().toISOString().slice(0, 10);
    const dir = `prototypes/${input.slug}/${version}`;
    const prompt = `# 原型归档 · 新项目创建 Prompt

> 项目：${input.name}（${input.slug}/${version}）
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

---

# 阶段零：准备创建（现在执行）

## 项目信息

| 字段 | 内容 |
|------|------|
| 项目名称 | ${input.name} |
| 目录 slug | ${input.slug} |
| 版本 | ${version} |
| 目标目录 | ${dir}/ |

## 参考模板

请参考 \`prototypes/rule-config/v1/\` 的 Flow 模式：列表（筛选 + 表格 + 行操作 + 详情弹窗）+ 表单页。

## 请你现在执行

1. 简要确认已理解项目名称与目录（1-2 句）
2. **不要编写任何文件，不要假设业务需求**
3. 引导用户在本对话中说明：**现状、痛点、诉求**

输出最后一行必须是：
\`\`\`
📝 请描述本项目的现状（目前怎么做/用什么）、痛点（哪里不顺/效率低/易出错）、诉求（希望做成什么样）。我会逐轮追问不确定之处，信息足够后再整理需求理解供您确认。
\`\`\`

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
\`\`\`
✋ 需求理解已完成。若理解正确，请回复「${REQUIREMENTS_CONFIRM_PHRASE}」；若有误请直接指出需修正之处，我会更新后再请您确认。
\`\`\`

---

# 阶段二：原型方案细化（用户确认需求后执行）

> ⛔ 未收到「${REQUIREMENTS_CONFIRM_PHRASE}」前，禁止执行本阶段

基于阶段一已确认的需求，整理**可写入 flow.json + pages/*.json 的原型方案**（Markdown 表格）：

## 2.1 列表页 · 检索条件（filters）

| 字段 ID | 标签 | 类型 | 选项/占位 | 说明 |
|---------|------|------|-----------|------|

## 2.2 列表页 · 工具栏按钮

| 按钮 | 行为 | 说明 |
|------|------|------|

（如：新增 → navigate('form')；导出 → 提示/mock 等）

## 2.3 列表页 · 表格展示列（columns）

| 列 key | 列标题 | 展示说明 |
|--------|--------|----------|

## 2.4 列表页 · 行操作按钮（actions）

| 行状态/条件 | 可用操作 | 行为说明 |
|-------------|----------|----------|

（view 打开详情弹窗；edit/publish/delete/copy 等按业务定义）

## 2.5 详情弹窗 · 展示区块（details，如有）

| 区块 | 内容要点 |
|------|----------|

## 2.6 表单页 · 分区与字段（sections，如有）

| 分区 | 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|------|

## 2.7 表单页 · 底部操作（formActions）

| 按钮 | 行为 |
|------|------|

## 2.8 关键交互路径（简要）

## 2.9 Mock 数据方案

| 状态/场景 | mock 行要求 | 说明 |
|-----------|-------------|------|
| 行操作 publish | ≥1 行 status=draft | 便于验收发布 |
| 行操作 void | ≥1 行 status=published | 便于验收作废 |
| 行操作 copy | ≥1 行 status=voided | 便于验收复制 |
| 下拉筛选项 | 各非「全部」选项至少 1 行 | 便于验收筛选 |
| 总行数 | 2～20 条 | 不宜过少或过多 |

**阶段二结束。请等待用户确认。**

输出最后一行必须是：
\`\`\`
✋ 原型方案已整理。若方案正确，请回复「${CREATE_CONFIRM_PHRASE}」；若有调整请直接说明，我会修订后再请您确认。
\`\`\`

---

# 阶段三：创建项目（用户确认方案后执行）

> ⛔ 未收到「${CREATE_CONFIRM_PHRASE}」前，禁止执行本阶段

## 创建目录

\`\`\`
${dir}/
├── flow.json           # Flow 骨架（title、entry、pages ID 列表）
├── pages/
│   ├── list.json       # 列表页 PageSpec
│   └── form.json       # 表单页 PageSpec（如有）
├── changelog.json      # 结构化变更记录（可选）
├── meta.json
├── CHANGELOG.md
├── REQUIREMENTS.md
├── PRD.md              # 产品需求规格（必填，见 templates/PRD.template.md）
└── ACCEPTANCE.md       # 验收清单（运行 npm run acceptance:gen 生成/更新）
\`\`\`

## 创建要求

1. flow.json + pages/*.json 严格按阶段二方案编写（页面按类型拆分到独立 JSON）
2. meta.json 含 id、version、title、changeSummary、status（默认 draft）等
3. **REQUIREMENTS.md** 写入阶段一确认的需求（见下方模板）
4. **PRD.md** 按 \`templates/PRD.template.md\` 编写，**第 3 章页面交互规格**须完整填写（初始化、检索、列表属性、主要按钮、列表按钮）；**每个 \`##\` 小节标题末尾加锚点**（如 \`{#list.filters}\`）；**PRD 只写中文业务名称，数据来源写菜单路径，不写字段 ID/key/表名**（技术 id 仅写在 Spec）
5. 列表页含 filters、table（columns + rows 示例）、details（如有）
6. 表单页含 sections、formActions（如有）
7. 运行 \`npm run validate\` 与 \`npm run build\`；**若有 error 须修复至 0 error**
8. 运行 \`npm run acceptance:gen -- ${input.slug}/${version}\` 生成 \`ACCEPTANCE.md\`
9. 更新 CHANGELOG.md

## REQUIREMENTS.md 模板

\`\`\`markdown
# 需求文档 - ${input.name}

## 现状
（阶段一确认内容）

## 痛点
（阶段一确认内容）

## 诉求与目标
（阶段一确认内容）

## 范围边界
### 做
### 不做

## 验收标准
- [ ] （可测试的验收点）

## 变更记录
（迭代时在此追加，格式：### YYYY-MM-DD · 摘要）
\`\`\`

## 约束 checklist

- [ ] REQUIREMENTS.md 已创建且内容完整
- [ ] PRD.md 已创建，第 3 章含初始化/检索/列表属性/主要按钮/列表按钮，且各节标题含 \`{#锚点}\`
- [ ] 有必填字段时 PRD 含 \`{#form.validation}\`；有状态行操作时含 \`{#list.state-flow}\`
- [ ] mock rows 覆盖 PRD 描述的行操作状态与筛选项
- [ ] ACCEPTANCE.md 已生成（\`npm run acceptance:gen\`）
- [ ] \`npm run validate\` 0 error
- [ ] 未复制 packages/ui 代码到 prototypes/
- [ ] 单文件 ≤ 300 行
- [ ] Schema 校验通过
- [ ] 列表新增/编辑 → 表单，查看 → 详情弹窗
`;
    const lines = countLines(prompt);
    if (lines > MAX_PROMPT_LINES) {
        throw new Error(`Prompt 超过 ${MAX_PROMPT_LINES} 行（当前 ${lines} 行）`);
    }
    return prompt;
}
export function getPromptLineCount(input, platform = 'pc') {
    return countLines(generateProjectPrompt(input, platform));
}
