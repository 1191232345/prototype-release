# 变更记录 - 规则配置 v1

## 2026-07-07（2）
- **详情弹窗改为独立详情页**
  - 列表「查看」操作改为跳转详情页，替代弹窗展示
  - 详情页内容结构与表单页对齐：基础配置、仓库信息、快递费配置（Tab）、库内费用配置（Tab）、其他费用配置、其他信息、发布状态
  - 费用配置采用 Tab 结构展示，与表单页保持一致性
  - 新增 `pages/detail.json`；flow.json 追加 detail 页面
  - 移除 `list.json` 的 `details` 配置；添加 `rowActions` 定义跳转行为
  - PRD 同步：删除 `{#list.detail-modal}`，新增 `{#detail.init}` `{#detail.sections}` `{#detail.fee-table}` `{#detail.actions}`

## 2026-07-07
- **列表树形结构与仓库列移除**
  - 主表改为树形：一级客户（含「共 N 个有效期」汇总），二级有效期配置；默认折叠
  - 删除主表「仓库」列；检索条件无仓库项（保持现状）
  - 行操作仅对二级（有效期）行生效
  - 生效期重叠规则改为同客户维度；配置名称 mock 不含仓库
  - 详情弹窗基本信息区保留「仓库」字段
  - Spec：`table.tree`、`rowType`、`children` 树形 mock
  - PRD 同步：`{#list.init}` `{#list.columns}` `{#list.row-buttons}` `{#list.effective-logic}` `{#list.column-styles}`；第 2 章验收项
  - Pattern：新增 `TreeListTable` 组件；schema/types 扩展树形表格

## 2026-07-06（2）
- **快速填入交互优化**
  - 移除费用区顶部工具栏的快速填入分段控件
  - 改为仓库列表每项添加「快速填入」按钮
  - 点击按钮触发弹窗，采用三步向导流程：第一步选择复用类型（价卡模板/复用仓库），第二步选择来源，第三步确认覆盖
  - 应用前显示警告提示「应用后将覆盖当前仓库的费用配置」
  - Spec：新增 `warehouseList`、`quickFillModal`；仓库项添加按钮
  - PRD 同步：`{#form.quick-fill}`、`{#form.warehouse-split}`、`{#form.interaction}`

## 2026-07-06
- **列表检索与列字段调整**
  - 删除筛选：仓库、业务类型
  - 新增筛选：创建时间起止、更新人、更新时间起止
  - 主表列：创建人/时间拆分为创建人、创建时间；新增更新人、更新时间
  - PRD 同步 `{#list.filters}` `{#list.columns}`

## 2026-07-05（5）
- **分仓费用配置 UX 重构**
  - 左右分栏：左侧客户授权仓库（只读），右侧按仓编辑费用
  - 快速填入：价卡模板 / 复用仓库二选一，共用下拉与应用按钮
  - 费用导航：大类分段控件 + 子项下划线 Tab，替代三张纵向卡片
  - Spec：`customerWarehouses`、`warehouseOptions`；移除顶部仓库/价卡字段
  - PRD 同步：`{#form.warehouse-split}` `{#form.quick-fill}` `{#form.fee-nav}`；更新 `{#form.fields}` `{#form.interaction}` `{#form.fee-structure}`
  - 对照定位：`reviewLinkRules` 新增 `form.warehouse.*` / `form.fill.*` / `form.fee.*` 锚点映射

## 2026-07-05（4）
- **生效期时间规则调整**
  - 取消半开区间，改为闭区间 `[startTime, endTime]`（含起止）
  - 失效时间默认 **23:59:59**；新规则开始时间默认 **上一规则结束日 +1 天的 00:00:00**
  - 立即生效且重叠时：截断上一条至 **新 start 前一日 23:59:59**
  - 新增 `ruleEffectiveTime.ts` 统一时间计算

## 2026-07-05（3）
- **规则生效逻辑优化（最优解）**
  - 计费匹配：`event_time ∈ [startTime, endTime)` 半开区间；同客户+仓库同时刻仅一条 published 规则
  - 列表新增「生效状态」列与筛选项（生效中 / 待生效 / 已过期 / 未发布）
  - 发布前影响预览：重叠阻断、自动截断上一条、规则快照冻结说明
  - 表单新增「生效方式」（立即生效 / 预约生效）；已发布规则禁止原地编辑
  - mock 样例：rc-004 待生效、rc-006 重叠阻断
  - PRD 同步：`{#list.effective-logic}` `{#form.publish-preview}` 等

## 2026-07-05（2）
- **移除审批时间轴 Extension**
  - 表单页删除 `slots.after-form` 审批时间轴区域
  - 移除 `approval-timeline` Extension 注册

## 2026-07-05
- **引用价卡后三张费用卡片**
  - 表单页选择价卡模板后，在「引用价卡」与「其他信息」之间展示快递费 / 库内费用 / 其他费用三张卡片
  - 结构与价卡管理一致：快递费、库内费用使用 CardWithTabs（库内 5 个 tab），其他费用为独立 surchargeTable
  - 默认根据所选价卡带出费用规则行，支持添加行、删除行、设置折扣
  - 列表详情弹窗「费用项折扣」按三张卡片分类展示
  - PRD 同步：`{#form.fee-structure}` `{#form.surcharge-table}` `{#form.surcharge-buttons}` `{#form.surcharge-import-modal}` `{#form.interaction}` `{#list.detail-modal}`

## 2026-07-04
- **删除操作二次确认**
  - 列表页删除按钮添加二次确认弹窗
  - 弹窗包含警告图标、提示文案、取消/确认按钮
  - 确认后执行删除操作，原型阶段显示 Toast 提示
- **复制新增操作二次确认**
  - 列表页复制按钮添加二次确认弹窗
  - 弹窗包含复制图标、提示文案、取消/确认按钮
  - 确认后跳转到表单页，原型阶段显示 Toast 提示

## v1 (2026-07-03)
- 重构为 Flow 交互模式，侧边栏只展示项目
- 列表页「新增/编辑」跳转表单页，「查看」打开详情弹窗
- 表单页「返回/取消/暂存/发布」回到列表页
- 合并 list-v1 / form-v1 / detail-v1 为单一 Flow Spec
