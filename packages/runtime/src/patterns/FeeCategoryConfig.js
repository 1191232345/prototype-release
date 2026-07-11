import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Card } from '@prototype/ui';
import { reviewTarget } from '@prototype/review';
import { SurchargeTableEditor } from './SurchargeTableEditor';
import { ZonePriceTableEditor } from './ZonePriceTableEditor';
import { FeeCategorySubTabs } from './FeeCategorySubTabs';
import { FeeCategoryTypeSidebar } from './FeeCategoryTypeSidebar';
import { countConfiguredSubTabs, countFeeSectionConfigured, countFeeSubTabs, getFeeSections, initialFeeCategoryIndex, sectionKey, shortFeeSectionLabel, usesTabbedFeeCategoryLayout, } from './ruleConfigFormUtils';
export function FeeCategoryConfig({ spec, title = '费用配置', icon = 'fas fa-coins', description, rows, onRowsChange, className = '', variant = 'card', readOnly = false, lockedFeeType, initialFeeType, }) {
    const allFeeSections = getFeeSections(spec);
    const feeSections = lockedFeeType
        ? allFeeSections.filter((s) => {
            const keyword = lockedFeeType === 'express'
                ? '快递'
                : lockedFeeType === 'storage'
                    ? '库内'
                    : lockedFeeType === 'other'
                        ? '其他费用'
                        : lockedFeeType === 'fuel'
                            ? '燃油费'
                            : lockedFeeType === 'peak'
                                ? '旺季附加费'
                                : '';
            return keyword ? s.title.includes(keyword) : true;
        })
        : allFeeSections;
    const [activeFeeCategoryIndex, setActiveFeeCategoryIndex] = useState(() => initialFeeCategoryIndex(spec, initialFeeType ?? lockedFeeType));
    const [subTabBySection, setSubTabBySection] = useState({});
    const resolvedCategoryIndex = lockedFeeType && feeSections.length === 1 ? 0 : activeFeeCategoryIndex;
    const activeFeeSection = feeSections[resolvedCategoryIndex];
    const subTabs = activeFeeSection?.tabs ?? [];
    const storedSubTab = activeFeeSection
        ? (subTabBySection[activeFeeSection.title] ?? 0)
        : 0;
    const activeSubTab = subTabs.length > 0 ? Math.min(storedSubTab, subTabs.length - 1) : 0;
    const activeRows = rows ?? {};
    const activeConfigured = activeFeeSection
        ? countFeeSectionConfigured(activeRows, activeFeeSection)
        : 0;
    const activeSubTabTotal = activeFeeSection ? countFeeSubTabs(activeFeeSection) : 0;
    const activeSubTabDone = activeFeeSection
        ? countConfiguredSubTabs(activeRows, activeFeeSection)
        : 0;
    const lockedSingleCategory = Boolean((lockedFeeType && feeSections.length === 1) || feeSections.length === 1);
    const useSplitNav = usesTabbedFeeCategoryLayout(spec) && !lockedSingleCategory && feeSections.length > 1;
    const activeBadgeLabel = activeFeeSection?.tabs
        ? `${activeConfigured}项`
        : activeConfigured > 0
            ? '已配'
            : '未配';
    const shellCls = variant === 'embedded'
        ? 'flex flex-col flex-1 min-h-0 overflow-hidden'
        : 'flex flex-col border border-border rounded-lg bg-white overflow-hidden min-h-[360px]';
    const setSubTab = (index) => {
        if (!activeFeeSection)
            return;
        setSubTabBySection((prev) => ({ ...prev, [activeFeeSection.title]: index }));
    };
    const contentPanel = activeFeeSection ? (_jsxs(_Fragment, { children: [_jsxs("header", { className: "shrink-0 px-4 py-3 border-b border-border-light bg-light-bg/30 flex flex-wrap items-center justify-between gap-2", children: [_jsx("h4", { className: "text-sm font-semibold text-primary", children: shortFeeSectionLabel(activeFeeSection.title) }), _jsxs("span", { className: "text-xs text-text-muted", ...reviewTarget('form.fee.progress', '配置进度'), children: ["\u5DF2\u914D\u7F6E ", activeConfigured, " \u9879", activeSubTabTotal > 1 && (_jsxs("span", { className: "ml-2 text-text-secondary", children: ["\u00B7 ", activeSubTabDone, "/", activeSubTabTotal, " \u7C7B"] }))] })] }), _jsx(FeeCategorySubTabs, { section: activeFeeSection, subTabs: subTabs, activeSubTab: activeSubTab, rows: activeRows, onSelect: setSubTab }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 min-h-0", children: _jsx(FeeSectionPanel, { section: activeFeeSection, subTab: subTabs[activeSubTab], rows: rows, onRowsChange: onRowsChange, readOnly: readOnly }) })] })) : null;
    const body = (_jsx("div", { className: shellCls, ...(variant !== 'embedded' ? reviewTarget('form.warehouse.fees', '费用配置') : {}), children: useSplitNav ? (_jsxs("div", { className: "flex flex-col lg:flex-row flex-1 min-h-0", children: [_jsx(FeeCategoryTypeSidebar, { sections: feeSections, activeIndex: activeFeeCategoryIndex, rows: activeRows, onSelect: setActiveFeeCategoryIndex }), _jsx("section", { className: "flex-1 min-w-0 flex flex-col min-h-0 bg-white", children: contentPanel })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "shrink-0 border-b border-border-light bg-white", ...reviewTarget('form.fee.nav', '费用导航'), children: [lockedSingleCategory && activeFeeSection ? (_jsxs("div", { className: "px-4 py-3 flex flex-wrap items-center justify-between gap-2", children: [_jsx("h4", { className: "text-sm font-semibold text-primary", children: shortFeeSectionLabel(activeFeeSection.title) }), _jsxs("span", { className: "text-xs text-text-muted", ...reviewTarget('form.fee.progress', '配置进度'), children: ["\u5DF2\u914D\u7F6E ", activeConfigured, " \u9879", activeSubTabTotal > 1 && (_jsxs("span", { className: "ml-2 text-text-secondary", children: ["\u00B7 ", activeSubTabDone, "/", activeSubTabTotal, " \u7C7B"] }))] })] })) : (_jsxs("div", { className: "px-4 py-3 flex flex-wrap items-center gap-2 sm:gap-3", children: [_jsx("label", { htmlFor: "fee-category-select", className: "form-label mb-0 shrink-0", children: "\u8D39\u7528\u7C7B\u578B" }), _jsx("select", { id: "fee-category-select", className: "form-input text-sm min-w-[160px] max-w-[240px]", value: String(activeFeeCategoryIndex), onChange: (e) => setActiveFeeCategoryIndex(Number(e.target.value)), disabled: readOnly, "aria-label": "\u8D39\u7528\u7C7B\u578B", ...reviewTarget(`form.fee.category.${activeFeeCategoryIndex}`, activeFeeSection
                                        ? shortFeeSectionLabel(activeFeeSection.title)
                                        : '费用类型'), children: feeSections.map((section, index) => (_jsx("option", { value: String(index), children: shortFeeSectionLabel(section.title) }, section.title))) }), activeFeeSection && (_jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded font-semibold leading-none ${activeConfigured > 0
                                        ? 'bg-success/15 text-success'
                                        : 'bg-gray-100 text-text-muted'}`, children: activeBadgeLabel }))] })), activeFeeSection && (_jsx(FeeCategorySubTabs, { section: activeFeeSection, subTabs: subTabs, activeSubTab: activeSubTab, rows: activeRows, onSelect: setSubTab }))] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4 min-h-0", children: activeFeeSection && (_jsx(FeeSectionPanel, { section: activeFeeSection, subTab: subTabs[activeSubTab], rows: rows, onRowsChange: onRowsChange, readOnly: readOnly })) })] })) }));
    if (variant === 'embedded')
        return body;
    return (_jsxs(Card, { title: title, icon: icon, className: className, children: [description && (_jsx("p", { className: "text-sm text-text-secondary mb-4", children: description })), body] }));
}
function FeeSectionPanel({ section, subTab, rows, onRowsChange, readOnly = false, }) {
    const bindRows = (key) => ({
        rows: rows?.[key],
        onRowsChange: onRowsChange
            ? (next) => onRowsChange(key, next)
            : undefined,
    });
    if (subTab) {
        const key = sectionKey(section.title, subTab.label);
        return (_jsx(FeeSectionContent, { content: subTab.content, sectionTitle: section.title, readOnly: readOnly, ...bindRows(key) }));
    }
    const key = sectionKey(section.title);
    return (_jsx(FeeSectionContent, { content: { surchargeTable: section.surchargeTable, zonePriceTable: section.zonePriceTable }, sectionTitle: section.title, readOnly: readOnly, ...bindRows(key) }));
}
function FeeSectionContent({ content, sectionTitle, rows, onRowsChange, readOnly = false, }) {
    return (_jsxs(_Fragment, { children: [content.zonePriceTable && (_jsx("div", { ...reviewTarget('form.zone.table'), children: _jsx(ZonePriceTableEditor, { table: content.zonePriceTable }) })), content.surchargeTable && (_jsx("div", { ...reviewTarget(sectionTitle.includes('其他')
                    ? 'form.other.table'
                    : sectionTitle.includes('燃油费')
                        ? 'form.fuel.table'
                        : sectionTitle.includes('旺季附加费')
                            ? 'form.peak.table'
                            : 'form.surcharge.table'), children: _jsx(SurchargeTableEditor, { table: content.surchargeTable, rows: rows, onRowsChange: onRowsChange, readOnly: readOnly }) }))] }));
}
