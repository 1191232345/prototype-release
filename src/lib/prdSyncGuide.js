export const PRD_SYNC_CHECKLIST = `### PRD 对照锚点 Checklist（创建 / 迭代结束前逐项核对）

**PRD 第 3 章**
- [ ] 每个 \`##\` 小节标题末尾含 \`{#锚点}\`（参照 \`templates/PRD.template.md\`）
- [ ] 列表页基础锚点齐全：\`{#list.init}\` \`{#list.filters}\` \`{#list.columns}\` \`{#list.main-buttons}\` \`{#list.row-buttons}\`
- [ ] 表单页基础锚点齐全：\`{#form.init}\` \`{#form.fields}\` \`{#form.main-buttons}\`
- [ ] 有特殊 UI 时补扩展锚点：\`{#list.detail-modal}\` \`{#list.import-modal}\` \`{#form.zone-table}\` \`{#form.zone-buttons}\` \`{#form.zone-import-modal}\` \`{#list.state-flow}\` 等

**Spec ↔ PRD 对齐（产品语言）**
- [ ] PRD 第 3 章表格**不含**「字段 ID」「字段 key」列；检索项/列名/字段名均用**中文业务名称**
- [ ] **数据来源** 写 **菜单路径**（如 \`客户管理 > 客户列表\`），不写表名、mock 变量、\`cells.xxx\`、\`list.json\` 等
- [ ] 触发动作写业务描述（如「进入编辑表单页」），不写 \`navigate()\` 或 action key
- [ ] 行操作 PRD 写 **UI 文案**（如「确认」「复制」），不是 action key（如 publish / copy）
- [ ] 筛选项 / 列 / 字段 / 按钮变更时，已同步对应 \`{#锚点}\` 章节表格行
- [ ] 只改受影响的 PRD 章节，未误改无关节

**review-id 约定**（Pattern 自动生成，见 \`src/lib/reviewLinkRules.ts\`）
- [ ] 列表页导入弹窗使用 \`list.import.*\`，禁止新增 \`form.*\` 标记列表导入（legacy 除外）
- [ ] 新增控件类型时：改 \`reviewLinkRules.ts\` + \`prototype.mdc\`，不在 \`reviewLink.ts\` 加 if

**验收**
- [ ] 已运行 \`npm run validate\`（含 PRD 锚点 + label + mock 覆盖校验），**0 error**
- [ ] 已运行 \`npm run build\`
- [ ] 已运行 \`npm run acceptance:gen\` 更新 \`ACCEPTANCE.md\``;
export const PRD_SYNC_RULES = `## PRD.md 同步规则（评审对照真源，迭代时必须同步）

> PRD 第 3 章「页面交互规格」与 \`pages/*.json\` 一一对应；**Spec 改了，PRD 必须改**。

### Spec 变更 → PRD 章节映射

| Spec 变更 | 须同步的 PRD 锚点章节 |
|-----------|----------------------|
| 筛选项增删改（filters） | \`{#list.filters}\` |
| 表格列增删改（table.columns） | \`{#list.columns}\`、必要时 \`{#list.column-styles}\` |
| 行内操作按钮（row.actions） | \`{#list.row-buttons}\` |
| 页面级/工具栏按钮 | \`{#list.main-buttons}\` 或 \`{#form.main-buttons}\` |
| 列表初始化、排序、空状态 | \`{#list.init}\` |
| 状态流转规则 | \`{#list.state-flow}\` |
| 详情弹窗区块 | \`{#list.detail-modal}\` |
| 列表导入弹窗 | \`{#list.import-modal}\` |
| 表单字段增删改（sections.fields） | \`{#form.fields}\` |
| 字段验证规则 | \`{#form.validation}\` |
| 表单联动/交互 | \`{#form.interaction}\` |
| 分区报价表格（zonePriceTable） | \`{#form.zone-table}\`、\`{#form.zone-buttons}\`、\`{#form.zone-import-modal}\` |
| 新增页面 | 复制模板新增 \`## 3.x\` 全套小节并加锚点 |
| 删除页面 | 删除 PRD 对应 \`## 3.x\` 各节 |

### 同步要求

1. **只改受影响的章节**，无变更的 PRD 节保持不动
2. 新增 \`##\` 小节时**必须保留锚点** \`{#xxx}\`（参照 \`templates/PRD.template.md\`）
3. PRD 表格行与 Spec **label / 按钮文案 / 触发动作** 业务含义一致；技术 id 仅保留在 Spec，不在 PRD 重复
4. 若变更影响验收标准，同步更新 PRD 第 2 章 Acceptance Criteria（勾选列表）
5. **禁止**只改 Spec 不更新 PRD——否则对照评审定位将失效

${PRD_SYNC_CHECKLIST}`;
