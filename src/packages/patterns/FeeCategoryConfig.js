import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { SurchargeTableEditor } from './SurchargeTableEditor';
import { ZonePriceTableEditor } from './ZonePriceTableEditor';
import { countFeeSectionConfigured, getFeeSections, sectionKey, shortFeeSectionLabel, } from './ruleConfigFormUtils';
import { FaIcon } from '@prototype/ui/Icon';
export function FeeCategoryConfig({ spec, title = '费用配置', icon = 'fas fa-coins', description, rows, onRowsChange, className = '', variant = 'card', }) {
    const feeSections = getFeeSections(spec);
    const [activeFeeCategoryIndex, setActiveFeeCategoryIndex] = useState(0);
    const [subTabBySection, setSubTabBySection] = useState({});
    const activeFeeSection = feeSections[activeFeeCategoryIndex];
    const activeSubTab = activeFeeSection
        ? (subTabBySection[activeFeeSection.title] ?? 0)
        : 0;
    const subTabs = activeFeeSection?.tabs ?? [];
    const hasSubNav = subTabs.length > 1;
    const activeRows = rows ?? {};
    const body = (_jsxs("div", { className: `flex flex-col border border-border rounded-lg bg-white overflow-hidden min-h-[360px] ${variant === 'embedded' ? 'flex-1 min-h-0' : ''}`, ...reviewTarget('form.warehouse.fees', '费用配置'), children: [_jsxs("div", { className: "shrink-0 border-b border-border-light bg-white", ...reviewTarget('form.fee.nav', '费用导航'), children: [_jsx("div", { className: "px-4 py-3", children: _jsx("div", { className: "inline-flex items-center gap-0.5 p-1 bg-surface rounded-lg border border-border-light", role: "tablist", "aria-label": "\u8D39\u7528\u5927\u7C7B", children: feeSections.map((section, index) => {
                                const configured = countFeeSectionConfigured(activeRows, section);
                                const active = index === activeFeeCategoryIndex;
                                const badgeLabel = section.tabs
                                    ? `${configured}项`
                                    : configured > 0
                                        ? '已配'
                                        : '未配';
                                return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${active
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-text-muted hover:text-dark'}`, onClick: () => setActiveFeeCategoryIndex(index), ...reviewTarget(`form.fee.category.${index}`, shortFeeSectionLabel(section.title)), children: [section.icon && _jsx(FaIcon, { className: `${section.icon} text-xs opacity-70` }), shortFeeSectionLabel(section.title), _jsx("span", { className: `text-[10px] px-1 py-0.5 rounded font-semibold leading-none ${configured > 0
                                                ? active
                                                    ? 'bg-success/15 text-success'
                                                    : 'bg-success/10 text-success'
                                                : 'bg-gray-100 text-text-muted'}`, children: badgeLabel })] }, section.title));
                            }) }) }), hasSubNav && activeFeeSection && (_jsx("div", { className: "px-4 flex overflow-x-auto border-t border-border-light/70 bg-light-bg/25", role: "tablist", "aria-label": `${shortFeeSectionLabel(activeFeeSection.title)}子项`, ...reviewTarget('form.fee.sub.tabs', '费用子类'), children: subTabs.map((tab, index) => {
                            const tabRows = activeRows[sectionKey(activeFeeSection.title, tab.label)] ?? [];
                            const hasConfig = tabRows.some((r) => Boolean(r.feeRuleId?.trim()));
                            const active = index === activeSubTab;
                            return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, className: `inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${active
                                    ? 'border-accent text-primary'
                                    : 'border-transparent text-text-muted hover:text-primary hover:border-border'}`, onClick: () => setSubTabBySection((prev) => ({
                                    ...prev,
                                    [activeFeeSection.title]: index,
                                })), children: [tab.icon && _jsx(FaIcon, { className: `${tab.icon} text-xs opacity-60` }), tab.label, hasConfig && (_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${active ? 'bg-success' : 'bg-success/60'}`, "aria-label": "\u5DF2\u914D\u7F6E" }))] }, tab.label));
                        }) }))] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 min-h-0", children: activeFeeSection && (_jsx(FeeSectionPanel, { section: activeFeeSection, subTab: subTabs[activeSubTab], rows: rows, onRowsChange: onRowsChange })) })] }));
    if (variant === 'embedded')
        return body;
    return (_jsxs(Card, { title: title, icon: icon, className: className, children: [description && (_jsx("p", { className: "text-sm text-text-secondary mb-4", children: description })), body] }));
}
function FeeSectionPanel({ section, subTab, rows, onRowsChange, }) {
    const bindRows = (key) => ({
        rows: rows?.[key],
        onRowsChange: onRowsChange
            ? (next) => onRowsChange(key, next)
            : undefined,
    });
    if (subTab) {
        const key = sectionKey(section.title, subTab.label);
        return (_jsx(FeeSectionContent, { content: subTab.content, sectionTitle: section.title, ...bindRows(key) }));
    }
    const key = sectionKey(section.title);
    return (_jsx(FeeSectionContent, { content: { surchargeTable: section.surchargeTable, zonePriceTable: section.zonePriceTable }, sectionTitle: section.title, ...bindRows(key) }));
}
function FeeSectionContent({ content, sectionTitle, rows, onRowsChange, }) {
    return (_jsxs(_Fragment, { children: [content.zonePriceTable && (_jsx("div", { ...reviewTarget('form.zone.table'), children: _jsx(ZonePriceTableEditor, { table: content.zonePriceTable }) })), content.surchargeTable && (_jsx("div", { ...reviewTarget(sectionTitle.includes('其他') ? 'form.other.table' : 'form.surcharge.table'), children: _jsx(SurchargeTableEditor, { table: content.surchargeTable, rows: rows, onRowsChange: onRowsChange }) }))] }));
}
