export const DOC_TABS = [
    {
        value: 'requirements',
        label: '需求文档',
        icon: 'fa-file-alt',
        short: '需求',
        hint: 'REQUIREMENTS.md · 现状/痛点/验收',
        file: 'REQUIREMENTS.md',
    },
    {
        value: 'prd',
        label: 'PRD',
        icon: 'fa-file-contract',
        short: 'PRD',
        hint: 'PRD.md · 页面交互规格（评审对照）',
        file: 'PRD.md',
    },
    {
        value: 'changelog',
        label: '变更记录',
        icon: 'fa-history',
        short: '变更',
        hint: 'CHANGELOG.md · 版本变更',
        file: 'CHANGELOG.md',
    },
];
export function getDocTabConfig(tab) {
    return DOC_TABS.find((t) => t.value === tab) ?? DOC_TABS[0];
}
