export const DOC_TABS = [
    {
        value: 'prd',
        label: 'PRD',
        icon: 'fa-file-contract',
        short: 'PRD',
        hint: 'PRD.md · 页面交互规格（评审对照）',
        file: 'PRD.md',
    },
];
export function getDocTabConfig(tab) {
    return DOC_TABS.find((t) => t.value === tab) ?? DOC_TABS[0];
}
