import { countLines } from './utils';
import { PRD_SYNC_RULES } from './prdSyncGuide';
const MAX_PROMPT_LINES = 300;
export const ITERATE_CONFIRM_PHRASE = '理解正确，继续迭代';
function summarizeFlow(flow) {
    const lines = [`入口页：\`${flow.entry}\``];
    for (const [pageId, page] of Object.entries(flow.pages)) {
        const parts = [`- **${pageId}** · pattern \`${page.pattern}\` · ${page.title}`];
        if (page.filters?.length) {
            const ids = page.filters.map((f) => f.id).join(', ');
            parts.push(`  筛选（${page.filters.length}）：${ids}`);
        }
        if (page.table) {
            const cols = page.table.columns.map((c) => c.key).join(', ');
            parts.push(`  表格列：${cols} · ${page.table.rows.length} 行 mock 数据`);
        }
        if (page.details) {
            parts.push(`  行级详情弹窗：${Object.keys(page.details).join(', ')}`);
        }
        if (page.sections) {
            const fields = page.sections.flatMap((s) => (s.fields ?? []).map((f) => f.id));
            parts.push(`  表单区块 ${page.sections.length} · 字段：${fields.join(', ')}`);
        }
        if (page.formActions?.length) {
            parts.push(`  表单操作：${page.formActions.map((a) => a.label).join(', ')}`);
        }
        lines.push(parts.join('\n'));
    }
    return lines.join('\n');
}
export function generateIterateProjectPrompt(input) {
    const today = new Date().toISOString().slice(0, 10);
    const dir = `prototypes/${input.slug}/${input.version}`;
    const structure = summarizeFlow(input.flow);
    const prompt = `# 原型归档 · 原型迭代 Prompt

> 项目：${input.name}（${input.projectKey}）
> 生成日期：${today}

---

## ⚠️ 执行规则（必须严格遵守）

1. **分三个阶段执行，不可跳步**
2. 阶段零完成后 **必须停止**，等待用户在对话中补充变更需求
3. 阶段一完成后 **必须停止**，等待用户确认
4. 仅在用户回复 **「${ITERATE_CONFIRM_PHRASE}」** 后，才可进入阶段二
5. 优先修改 \`pages/*.json\` 与 \`flow.json\`，**同步更新 \`PRD.md\`**（第 3 章对应锚点章节），必要时更新 \`meta.json\`、\`CHANGELOG.md\`、\`REQUIREMENTS.md\`
6. 所有代码文件单文件不超过 **300 行**
7. 遵循 \`prototype-archive/.cursor/rules/prototype.mdc\` 规范

## 迭代模式

本 Prompt 适用于所有 Spec/PRD 变更（含加列、改字段、mock、文案、新页面、改交互流）。

---

# 阶段零：准备迭代（现在执行）

## 项目现状

| 字段 | 内容 |
|------|------|
| 项目名称 | ${input.name} |
| 目录 | ${dir} |
| slug | ${input.slug} |
| 版本 | ${input.version} |

## 当前 Flow 结构

${structure}

## 请你现在执行

1. 简要确认已理解上述项目结构（2-3 句即可）
2. **不要修改任何文件**
3. **不要假设变更内容**
4. 明确请用户在**本对话**中补充本次变更需求

输出最后一行必须是：
\`\`\`
📝 请在本对话中描述本次变更需求（如：列表加列、表单改字段、调整 mock 数据等）。收到后我将分析影响并给出修改方案。
\`\`\`

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
\`\`\`
✋ 变更理解已完成。若理解正确，请回复「${ITERATE_CONFIRM_PHRASE}」；若有误请指出需修正之处。
\`\`\`

---

# 阶段二：执行迭代（用户确认后才执行）

> ⛔ 未收到「${ITERATE_CONFIRM_PHRASE}」前，禁止执行本阶段

## 目标目录

\`\`\`
${dir}/
├── flow.json           # 新增页面时更新 pages 数组
├── pages/              # 主要修改对象（按页面拆分）
│   ├── list.json
│   └── form.json
├── changelog.json      # 结构化变更（可选）
├── meta.json           # 更新 changeSummary（一句话摘要本次变更）
├── CHANGELOG.md        # 追加变更记录
├── REQUIREMENTS.md     # 「变更记录」章节追加本次需求
└── PRD.md              # 同步第 3 章受影响锚点章节（评审对照真源）
\`\`\`

${PRD_SYNC_RULES}

## 修改要求

1. **优先改 \`pages/{id}.json\`**：列表列、筛选项、表单字段、mock 数据、详情区块、操作按钮等
2. **同步改 \`PRD.md\`**：按上方映射表更新对应 \`{#锚点}\` 章节的表格行，保持与 Spec 一致
3. 新增页面时在 \`flow.json\` 的 \`pages\` 数组追加 ID，并创建 \`pages/{id}.json\`，PRD 新增对应 \`## 3.x\` 全套小节
4. 在 \`CHANGELOG.md\` 顶部追加本次变更（日期 + 摘要 + 要点列表，含 PRD 同步说明）
5. 在 \`REQUIREMENTS.md\` 的「变更记录」章节追加本次变更说明
6. 更新 \`meta.json\` 的 \`changeSummary\` 为本次变更的一句话摘要
7. 若仅改 Spec 内容，**不要**改 slug、版本目录、Pattern 类型（除非阶段一已明确需要新 Pattern）
8. 运行 \`npm run validate\` 和 \`npm run build\` 确保通过（**0 error**）
9. 运行 \`npm run acceptance:gen -- ${input.slug}/${input.version}\` 更新 \`ACCEPTANCE.md\`

## 约束 checklist

- [ ] flow.json + pages/*.json 通过 schema 校验
- [ ] **PRD.md 第 3 章受影响锚点章节已同步**（与 Spec 字段/按钮/列一致）
- [ ] mock rows 状态/筛选项覆盖仍满足 validate-mock 规则
- [ ] ACCEPTANCE.md 已更新（\`npm run acceptance:gen\`）
- [ ] \`npm run validate\` 0 error
- [ ] meta.changeSummary 已更新
- [ ] REQUIREMENTS.md 变更记录已追加
- [ ] 未复制 packages/ui 代码到 prototypes/
- [ ] 单文件 ≤ 300 行
- [ ] CHANGELOG 已追加记录
- [ ] 列表/表单/详情交互仍符合 FlowContext 约定
`;
    const lines = countLines(prompt);
    if (lines > MAX_PROMPT_LINES) {
        throw new Error(`Prompt 超过 ${MAX_PROMPT_LINES} 行（当前 ${lines} 行）`);
    }
    return prompt;
}
export function getIteratePromptLineCount(input) {
    return countLines(generateIterateProjectPrompt(input));
}
