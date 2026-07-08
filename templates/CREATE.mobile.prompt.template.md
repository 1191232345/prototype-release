# 原型归档 · 移动端新项目创建 Prompt

> 项目：{{NAME}}（{{PROJECT_KEY}}）
> 平台：**移动端 / PDA** · designSystem: `elsa-pda`
> 生成日期：{{TODAY}}

---

## ⚠️ 执行规则（必须严格遵守）

1. **分四个阶段执行，不可跳步、不可合并**
2. 每个阶段完成后 **必须停止**，等待用户输入或确认
3. 阶段一确认语：**「{{REQUIREMENTS_CONFIRM_PHRASE}}」**；阶段二确认语：**「{{CREATE_CONFIRM_PHRASE}}」**
4. 所有代码文件单文件不超过 **300 行**
5. 遵循 `.cursor/rules/prototype.mdc` 规范
6. **移动端约束**：固定视口 390×844，使用 `MobileDeviceFrame`；触控目标 ≥ 44px

---

# 阶段零：准备创建（现在执行）

## 项目信息

| 字段 | 内容 |
|------|------|
| 项目名称 | {{NAME}} |
| 目录 slug | {{SLUG}} |
| 版本 | {{VERSION}} |
| 目标目录 | {{DIR}}/ |
| designSystem | elsa-pda |

## 参考项目（请先 Read）

| 文件 | 路径 |
|------|------|
| Flow | `prototypes/sku-信息填充-pda/v1/flow.json` |
| 列表 | `prototypes/sku-信息填充-pda/v1/pages/list.json` |
| 执行页 | `prototypes/sku-信息填充-pda/v1/pages/task.json` |
| 详情片段 | `prototypes/sku-信息填充-pda/v1/pages/task.details.json` |

## 请你现在执行

1. **Read** 参考文件，确认移动端定位（1-2 句）
2. **不要编写任何文件，不要假设业务需求**
3. 引导用户说明：**现状、痛点、诉求**（设备、现场场景、弱网等）

输出最后一行必须是：
```
📝 请描述本移动端项目的现状、痛点与诉求。我会逐轮追问，信息足够后再整理需求理解供您确认。
```

---

# 阶段一～三

（流程同 PC 版 CREATE.prompt.md：需求澄清 → 移动端页面方案 → 创建文件）

阶段三创建目录须含 `CREATE.prompt.md`、`ITERATE.prompt.md`，且 **meta.json 中 designSystem 必须为 elsa-pda**。

创建完成后运行：
- `npm run validate` / `npm run build`
- `npm run acceptance:gen -- {{SLUG}}/{{VERSION}}`
- `npm run prompts:gen -- {{SLUG}}/{{VERSION}}`
