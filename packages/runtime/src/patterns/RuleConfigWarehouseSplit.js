import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Card } from '@prototype/ui';
import { reviewTarget } from '@prototype/review';
import { FeeCategoryConfig } from './FeeCategoryConfig';
import { RuleConfigFeeEmptyPrompt } from './RuleConfigFeeEmptyPrompt';
import { countConfiguredSubTabs, countFeeSectionConfigured, countFeeSubTabs, filterFeeSectionsByLockedType, getPriceCardTemplates, getWarehouseOptions, isWarehouseConfigured, feeTypeTabLabel, } from './ruleConfigFormUtils';
function toSelectedSet(ids) {
    return ids instanceof Set ? ids : new Set(ids);
}
export function RuleConfigWarehouseSplit({ spec, customerId, warehouseIds, selectedWarehouseIds, onSelectedWarehouseChange, unifiedConfig, onUnifiedConfigChange, importedFrom, onImportTemplate, readOnly = false, lockedFeeType, initialFeeType, }) {
    const warehouseOptions = getWarehouseOptions(spec);
    const priceCardTemplates = getPriceCardTemplates(spec);
    const [manualConfig, setManualConfig] = useState(false);
    const selected = toSelectedSet(selectedWarehouseIds);
    const warehouseLabel = (id) => warehouseOptions.find((o) => o.value === id)?.label ?? id;
    const configured = isWarehouseConfigured(unifiedConfig);
    const showEmptyPrompt = !readOnly && !configured && !manualConfig;
    const feeSections = useMemo(() => filterFeeSectionsByLockedType(spec, lockedFeeType), [spec, lockedFeeType]);
    const progressSection = feeSections[0];
    const totalItems = progressSection
        ? countFeeSectionConfigured(unifiedConfig, progressSection)
        : 0;
    const totalSubTabs = progressSection ? countFeeSubTabs(progressSection) : 0;
    const doneSubTabs = progressSection
        ? countConfiguredSubTabs(unifiedConfig, progressSection)
        : 0;
    const toggleWarehouse = (id) => {
        const next = new Set(selected);
        if (next.has(id))
            next.delete(id);
        else
            next.add(id);
        onSelectedWarehouseChange(next);
    };
    const selectAll = () => onSelectedWarehouseChange(new Set(warehouseIds));
    const clearAll = () => onSelectedWarehouseChange(new Set());
    const handleApplyTemplate = (templateId) => {
        const label = priceCardTemplates.find((t) => t.value === templateId)?.label ?? templateId;
        onImportTemplate(label);
        setManualConfig(true);
    };
    const cardTitle = lockedFeeType
        ? `配置${feeTypeTabLabel(lockedFeeType)}`
        : '费用配置';
    return (_jsx(Card, { title: cardTitle, icon: "fas fa-coins", children: _jsxs("div", { className: "space-y-4", children: [!readOnly && configured && (_jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 rounded-lg bg-light-bg/50 border border-border-light text-sm", ...reviewTarget('form.fee.toolbar', '快速填入'), children: [_jsx("span", { className: "text-xs text-text-muted shrink-0", children: "\u5FEB\u901F\u586B\u5165" }), _jsxs("select", { className: "form-input text-sm min-w-[160px] max-w-[240px]", defaultValue: "", onChange: (e) => {
                                if (e.target.value)
                                    handleApplyTemplate(e.target.value);
                                e.target.value = '';
                            }, ...reviewTarget('form.import.template', '价卡模板'), children: [_jsx("option", { value: "", children: "\u5207\u6362\u4EF7\u5361\u6A21\u677F\u2026" }), priceCardTemplates.map((t) => (_jsx("option", { value: t.value, children: t.label }, t.value)))] }), importedFrom && (_jsxs("span", { className: "text-xs text-text-muted", children: ["\u66FE\u5F15\u7528\uFF1A", importedFrom] })), progressSection && (_jsxs("span", { className: "text-xs text-text-secondary ml-auto", ...reviewTarget('form.fee.progress', '配置进度'), children: ["\u5DF2\u914D\u7F6E ", totalItems, " \u9879", totalSubTabs > 1 && ` · ${doneSubTabs}/${totalSubTabs} 类`] }))] })), _jsx("div", { className: "min-h-[320px] flex flex-col", ...reviewTarget('form.warehouse.fees', '费用配置'), children: showEmptyPrompt ? (_jsx(RuleConfigFeeEmptyPrompt, { templates: priceCardTemplates, onApply: handleApplyTemplate, onManualConfig: () => setManualConfig(true) })) : (_jsx(FeeCategoryConfig, { spec: spec, variant: "embedded", rows: unifiedConfig, readOnly: readOnly, lockedFeeType: lockedFeeType, initialFeeType: initialFeeType, onRowsChange: readOnly ? undefined : onUnifiedConfigChange })) }), _jsxs("div", { className: "pt-4 border-t border-border-light space-y-2", ...reviewTarget('form.warehouse.chips', '适用仓库'), children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("p", { className: "text-xs font-semibold text-text-secondary", children: "\u9002\u7528\u4ED3\u5E93" }), _jsxs("div", { className: "flex items-center gap-3 text-xs", children: [_jsxs("span", { className: "text-text-muted", children: ["\u5DF2\u9009 ", selected.size, "/", warehouseIds.length] }), !readOnly && customerId && warehouseIds.length > 0 && (_jsxs(_Fragment, { children: [_jsx("button", { type: "button", className: "text-accent hover:underline", onClick: selectAll, ...reviewTarget('form.warehouse.select-all', '全选'), children: "\u5168\u9009" }), _jsx("button", { type: "button", className: "text-text-muted hover:underline", onClick: clearAll, ...reviewTarget('form.warehouse.clear-all', '取消全选'), children: "\u53D6\u6D88\u5168\u9009" })] }))] })] }), !customerId ? (_jsx("p", { className: "text-sm text-text-muted py-2", children: "\u8BF7\u5148\u9009\u62E9\u5BA2\u6237" })) : warehouseIds.length === 0 ? (_jsx("p", { className: "text-sm text-text-muted py-2", children: "\u8BE5\u5BA2\u6237\u6682\u65E0\u6388\u6743\u4ED3\u5E93" })) : (_jsx("div", { className: "flex flex-wrap gap-2", children: warehouseIds.map((id) => {
                                const checked = selected.has(id);
                                const shortLabel = warehouseLabel(id).replace(/\s*\([^)]*\)\s*$/, '');
                                if (readOnly) {
                                    if (!checked)
                                        return null;
                                    return (_jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-primary border border-accent/30", ...reviewTarget(`form.warehouse.item.${id}`, warehouseLabel(id)), children: [_jsx("i", { className: "fas fa-check text-[10px]", "aria-hidden": true }), shortLabel] }, id));
                                }
                                return (_jsxs("button", { type: "button", className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${checked
                                        ? 'bg-accent/10 text-primary border-accent/40'
                                        : 'bg-white text-text-muted border-border hover:border-accent/30'}`, onClick: () => toggleWarehouse(id), ...reviewTarget(`form.warehouse.item.${id}`, warehouseLabel(id)), children: [_jsx("i", { className: `fas ${checked ? 'fa-check-square' : 'fa-square'} text-[10px] opacity-70`, "aria-hidden": true }), shortLabel] }, id));
                            }) })), !readOnly && customerId && selected.size === 0 && (_jsx("p", { className: "text-xs text-amber-600", children: "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u9002\u7528\u4ED3\u5E93\uFF08\u6682\u5B58/\u53D1\u5E03\u65F6\u5C06\u6821\u9A8C\uFF09" })), readOnly && selected.size === 0 && (_jsx("p", { className: "text-sm text-text-muted", children: "\u672A\u9009\u62E9\u9002\u7528\u4ED3\u5E93" }))] })] }) }));
}
export { FormFieldInput } from './RuleConfigFormFieldInput';
