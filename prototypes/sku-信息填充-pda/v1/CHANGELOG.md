# 变更记录 - SKU 信息填充 PDA 端 v1

## 2026-07-07 · SKU 为主展示与直达录入

- **列表**：卡片主标题改为 SKU 名称，工单号降为辅助信息；搜索支持 SKU / 工单号
- **任务页**：页头以 SKU 为主，点击后首屏直接展示尺寸/重量/图片表单（无折叠）
- **退回提示**：已退回任务在表单上方展示退回原因条，移除工单信息折叠区
- **Spec**：`list.json` 新增 `sku` 列，状态改为任务视角（待填写/已退回/已完结）
- **PRD 同步**：`{#list.init}` `{#list.columns}` `{#list.filters}` `{#list.row-buttons}` `{#task.init}` `{#task.info}`

## 2026-07-07 · 对齐 PC 端数据结构

- **数据模型**：每工单 1 个 SKU，进度统一为 `0/1` 或 `1/1`
- **列表 Mock**：`wo-001` 进度改为 `0/1`；`wo-003` 改为 `1/1`；删除错误样例 `wo-002`，新增 `wo-004`（已完结）
- **任务详情**：`task.details.json` 每工单仅保留 1 个 SKU，字段值对齐 PC 端
- **状态文案**：「已完成」统一为「已完结」
- **Pattern**：`SkuFillPdaList` 筛选项文案同步
- **PRD 同步**：`{#list.init}` `{#list.columns}` `{#list.filters}` `{#task.init}` `{#task.sku-form}` `{#task.main-buttons}`

## 2026-07-07 · 列表筛选与 SKU 填写说明

- **状态筛选**：任务列表新增「已完成」标签，可筛选已完结工单
- **Mock 数据**：新增 wo-002（已完成）样例行及对应 task.details 只读详情
- **SKU 填写说明**：每张 SKU 卡片新增「填写说明」按钮，点击底部弹层展示指引文案
- **Spec**：`skuRows` 扩展 `fillInstruction` 字段；已完成工单隐藏暂存/提交按钮
- **PRD 同步**：`{#list.init}` `{#list.filters}` `{#list.columns}` `{#task.sku-form}` 新增 `{#task.fill-instruction-modal}`

## 2026-07-07 · 新增任务列表页（二级页面）

- **页面结构**：由单页改为两级页面
  - 一级：任务列表（list）— 入口页，展示待处理/已退回工单
  - 二级：任务执行（task）— 点击列表卡片进入，填写 SKU 信息
- **Pattern 新增**：`sku-fill-pda-list` 移动端任务列表
- **导航**：列表 → 执行页（携带 rowId）；执行页顶部「返回列表」
- **Mock 数据**：2 条任务（wo-001 待处理、wo-003 已退回），详情见 task.details.json

## 2026-07-07 · 创建独立 PDA 端项目

- **项目创建**：创建独立 PDA 端项目（prototypes/sku-信息填充-pda/v1），与客服端项目分离
- **功能**：
  - 工单基本信息展示（工单号、客户代码、仓库代码、优先级、备注）
  - SKU 信息补充表单（尺寸/重量/图片上传）
  - 暂存/提交按钮，提交后工单变为待客服审核
- **设计系统**：使用 elsa-pda 移动端设计系统
