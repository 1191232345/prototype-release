import { renderPromptTemplate, todayIsoDate } from './renderPromptTemplate';
function baseVars(input) {
    const dir = `prototypes/${input.slug}/${input.version}`;
    return {
        NAME: input.name,
        SLUG: input.slug,
        VERSION: input.version,
        PROJECT_KEY: input.projectKey,
        DIR: dir,
        TODAY: todayIsoDate(),
    };
}
export function buildCreatePromptLauncher(input) {
    const isMobile = input.platform === 'mobile';
    const vars = {
        ...baseVars(input),
        REFERENCE: isMobile ? 'sku-信息填充-pda/v1' : 'rule-config/v1',
        TEMPLATE_FALLBACK: isMobile
            ? 'templates/CREATE.mobile.prompt.template.md'
            : 'templates/CREATE.prompt.template.md',
        PLATFORM_NOTE: isMobile ? '（移动端 / PDA · designSystem: elsa-pda）' : '（PC 后台 Web）',
    };
    return renderPromptTemplate(`# 原型创建 · {{NAME}} {{PLATFORM_NOTE}}

> 目录：\`{{DIR}}/\`

## 第一步：阅读本地 Prompt（必须先 Read，禁止假设内容）

1. \`{{DIR}}/CREATE.prompt.md\` — **主 Prompt（阶段规则与创建要求）**
   - 若该文件尚不存在，Read \`{{TEMPLATE_FALLBACK}}\` 并按下方项目信息理解
2. \`.cursor/rules/prototype.mdc\` — 原型规范
3. 参考 \`prototypes/{{REFERENCE}}/\` — 同类型项目结构

## 项目信息

| 字段 | 内容 |
|------|------|
| 项目名称 | {{NAME}} |
| slug | {{SLUG}} |
| 版本 | {{VERSION}} |

## 第二步：执行

严格按 **CREATE.prompt.md 阶段零** 执行，完成后停止，等待我描述现状、痛点与诉求。`, vars);
}
export function buildIteratePromptLauncher(input) {
    const vars = baseVars(input);
    return renderPromptTemplate(`# 原型迭代 · {{NAME}}

> 项目：{{PROJECT_KEY}} · 目录：\`{{DIR}}/\`

## 第一步：阅读本地文件（必须先 Read，禁止假设内容）

| 优先级 | 文件 | 说明 |
|--------|------|------|
| 1 | \`{{DIR}}/ITERATE.prompt.md\` | **主 Prompt（阶段规则与修改要求）** |
| 2 | \`.cursor/rules/prototype.mdc\` | 原型规范 |
| 3 | \`{{DIR}}/flow.json\` | Flow 骨架（entry、pages） |
| 4 | \`{{DIR}}/pages/\` | 各页 Spec（按 flow.pages 逐个 Read；含 \`shared.sections.*.json\` 等片段） |
| 5 | \`{{DIR}}/PRD.md\` | 评审对照真源 |
| 6 | \`{{DIR}}/REQUIREMENTS.md\` | 需求与变更记录 |

PRD 同步映射见 \`src/lib/prdSyncGuide.ts\`。

## 第二步：执行

严格按 **ITERATE.prompt.md 阶段零** 执行，完成后停止，等待我补充变更需求。`, vars);
}
