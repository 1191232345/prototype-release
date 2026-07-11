import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { reviewTarget } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
import { countTabConfiguredRows, shortFeeSectionLabel } from './ruleConfigFormUtils';
export function FeeCategorySubTabs({ section, subTabs, activeSubTab, rows, onSelect, }) {
    if (subTabs.length <= 1)
        return null;
    return (_jsx("div", { className: "shrink-0 px-4 flex overflow-x-auto border-b border-border-light/70 bg-light-bg/25", role: "tablist", "aria-label": `${shortFeeSectionLabel(section.title)}子项`, ...reviewTarget('form.fee.sub.tabs', '费用子类'), children: subTabs.map((tab, index) => {
            const tabCount = countTabConfiguredRows(rows, section, tab.label);
            const hasConfig = tabCount > 0;
            const active = index === activeSubTab;
            return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, className: `inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${active
                    ? 'border-accent text-primary'
                    : 'border-transparent text-text-muted hover:text-primary hover:border-border'}`, onClick: () => onSelect(index), children: [tab.icon && _jsx(FaIcon, { className: `${tab.icon} text-xs opacity-60` }), tab.label, _jsxs("span", { className: `text-[10px] tabular-nums ${hasConfig ? 'text-success font-semibold' : 'text-text-muted'}`, children: ["(", tabCount, ")"] })] }, tab.label));
        }) }));
}
