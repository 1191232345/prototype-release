import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Button, Card } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { FeeCategoryConfig } from './FeeCategoryConfig';
import { getPriceCardTemplates, getWarehouseOptions, isWarehouseConfigured, summarizeWarehouseConfig, } from './ruleConfigFormUtils';
export function RuleConfigWarehouseSplit({ spec, customerId, activeWarehouseId, onActiveWarehouseChange, warehouseIds, warehouseConfigs, onWarehouseConfigChange, warehouseMeta, onImportTemplate, onReuseFromWarehouse, readOnly = false, }) {
    const warehouseOptions = getWarehouseOptions(spec);
    const priceCardTemplates = getPriceCardTemplates(spec);
    const [warehouseSearch, setWarehouseSearch] = useState('');
    const [fillMode, setFillMode] = useState('template');
    const [fillSourceId, setFillSourceId] = useState('');
    const warehouseLabel = (id) => warehouseOptions.find((o) => o.value === id)?.label ?? id;
    const filteredWarehouseIds = useMemo(() => {
        const q = warehouseSearch.trim().toLowerCase();
        if (!q)
            return warehouseIds;
        return warehouseIds.filter((id) => warehouseLabel(id).toLowerCase().includes(q));
    }, [warehouseIds, warehouseSearch, warehouseOptions]);
    const activeRows = activeWarehouseId ? warehouseConfigs[activeWarehouseId] : undefined;
    const reuseOptions = warehouseIds.filter((id) => id !== activeWarehouseId);
    const canReuseWarehouse = reuseOptions.length > 0;
    const handleApplyFill = () => {
        if (!activeWarehouseId || !fillSourceId)
            return;
        if (fillMode === 'template') {
            const label = priceCardTemplates.find((t) => t.value === fillSourceId)?.label ?? fillSourceId;
            onImportTemplate(activeWarehouseId, label);
        }
        else {
            onReuseFromWarehouse(fillSourceId);
        }
        setFillSourceId('');
    };
    useEffect(() => {
        setFillSourceId('');
        if (!canReuseWarehouse)
            setFillMode('template');
    }, [activeWarehouseId, canReuseWarehouse]);
    const configuredCount = warehouseIds.filter((id) => isWarehouseConfigured(warehouseConfigs[id] ?? {})).length;
    return (_jsxs(Card, { title: "\u5206\u4ED3\u8D39\u7528\u914D\u7F6E", icon: "fas fa-warehouse", children: [_jsxs("p", { className: "text-sm text-text-secondary mb-4", children: ["\u4ED3\u5E93\u7531\u5BA2\u6237\u6388\u6743\u81EA\u52A8\u5E26\u51FA\uFF0C\u4E0D\u53EF\u589E\u5220\u3002\u5DE6\u4FA7\u9009\u62E9\u4ED3\u5E93\uFF0C\u53F3\u4FA7\u6309\u8D39\u7528\u5927\u7C7B\u7F16\u8F91\u3002", warehouseIds.length > 0 && (_jsxs("span", { className: "ml-2 text-text-muted", children: ["\u6388\u6743 ", warehouseIds.length, " \u4ED3 \u00B7 \u5DF2\u914D\u7F6E ", configuredCount, " \u4ED3"] }))] }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-4 min-h-[480px]", children: [_jsxs("div", { className: "lg:w-64 xl:w-72 shrink-0 flex flex-col border border-border rounded-lg bg-light-bg/40 overflow-hidden", ...reviewTarget('form.warehouse.sidebar', '仓库列表'), children: [_jsxs("div", { className: "p-3 border-b border-border-light space-y-2 bg-white", children: [_jsx("p", { className: "text-xs text-text-muted px-0.5", children: "\u5BA2\u6237\u6388\u6743\u4ED3\u5E93" }), _jsx("input", { type: "search", className: "form-input text-sm", placeholder: "\u641C\u7D22\u4ED3\u5E93", value: warehouseSearch, onChange: (e) => setWarehouseSearch(e.target.value), disabled: !customerId || warehouseIds.length === 0, ...reviewTarget('form.warehouse.search', '搜索仓库') })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: !customerId ? (_jsx("p", { className: "text-sm text-text-muted text-center py-8 px-2", children: "\u8BF7\u5148\u9009\u62E9\u5BA2\u6237" })) : filteredWarehouseIds.length === 0 ? (_jsx("p", { className: "text-sm text-text-muted text-center py-8 px-2", children: warehouseIds.length === 0 ? '该客户暂无授权仓库' : '无匹配仓库' })) : (filteredWarehouseIds.map((id) => {
                                    const configured = isWarehouseConfigured(warehouseConfigs[id] ?? {});
                                    const summary = summarizeWarehouseConfig(warehouseConfigs[id] ?? {});
                                    const active = id === activeWarehouseId;
                                    return (_jsxs("button", { type: "button", className: `w-full text-left rounded-lg px-3 py-2.5 transition-colors border ${active
                                            ? 'border-accent bg-accent/10 shadow-sm'
                                            : 'border-transparent hover:bg-hover'}`, onClick: () => onActiveWarehouseChange(id), ...reviewTarget(`form.warehouse.item.${id}`, warehouseLabel(id)), children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: `text-sm font-medium ${active ? 'text-primary' : 'text-dark'}`, children: warehouseLabel(id) }), _jsx("span", { className: `shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${configured
                                                            ? 'bg-success/15 text-success'
                                                            : 'bg-gray-100 text-text-muted'}`, children: configured ? '已配置' : '未配置' })] }), _jsx("div", { className: "text-xs text-text-muted mt-1 truncate", children: summary }), warehouseMeta[id]?.importedFrom && (_jsxs("div", { className: "text-[10px] text-text-muted mt-0.5 truncate", children: ["\u66FE\u5F15\u7528\uFF1A", warehouseMeta[id].importedFrom] }))] }, id));
                                })) })] }), _jsx("div", { className: "flex-1 min-w-0 flex flex-col border border-border rounded-lg bg-white overflow-hidden min-h-[480px]", ...reviewTarget('form.warehouse.fees', '费用配置'), children: !activeWarehouseId ? (_jsx("div", { className: "flex flex-1 items-center justify-center text-text-muted text-sm p-8", children: readOnly ? '请从左侧选择仓库以查看费用配置' : '请从左侧选择仓库以配置费用规则' })) : (_jsxs(_Fragment, { children: [!readOnly && (_jsxs("div", { className: "flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border-light bg-light-bg/40 shrink-0", ...reviewTarget('form.fee.toolbar', '费用配置工具栏'), children: [_jsx("span", { className: "text-xs text-text-muted whitespace-nowrap shrink-0", children: "\u5FEB\u901F\u586B\u5165" }), _jsxs("div", { className: "inline-flex items-center gap-0.5 p-1 bg-surface rounded-lg border border-border-light shrink-0", role: "tablist", "aria-label": "\u586B\u5165\u65B9\u5F0F", children: [_jsx("button", { type: "button", role: "tab", "aria-selected": fillMode === 'template', className: `px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${fillMode === 'template'
                                                        ? 'bg-white text-primary shadow-sm'
                                                        : 'text-text-muted hover:text-dark'}`, onClick: () => {
                                                        setFillMode('template');
                                                        setFillSourceId('');
                                                    }, ...reviewTarget('form.fill.mode.template', '价卡模板'), children: "\u4EF7\u5361\u6A21\u677F" }), canReuseWarehouse && (_jsx("button", { type: "button", role: "tab", "aria-selected": fillMode === 'warehouse', className: `px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap ${fillMode === 'warehouse'
                                                        ? 'bg-white text-primary shadow-sm'
                                                        : 'text-text-muted hover:text-dark'}`, onClick: () => {
                                                        setFillMode('warehouse');
                                                        setFillSourceId('');
                                                    }, ...reviewTarget('form.fill.mode.warehouse', '复用仓库'), children: "\u590D\u7528\u4ED3\u5E93" }))] }), _jsxs("select", { className: "form-input text-sm flex-1 min-w-[140px] max-w-[240px]", value: fillSourceId, onChange: (e) => setFillSourceId(e.target.value), ...reviewTarget(fillMode === 'template' ? 'form.import.template' : 'form.reuse.source', fillMode === 'template' ? '价卡模板' : '复用仓库'), children: [_jsx("option", { value: "", children: fillMode === 'template' ? '请选择价卡模板…' : '请选择来源仓库…' }), fillMode === 'template'
                                                    ? priceCardTemplates.map((t) => (_jsx("option", { value: t.value, children: t.label }, t.value)))
                                                    : reuseOptions.map((id) => (_jsx("option", { value: id, children: warehouseLabel(id) }, id)))] }), _jsx(Button, { variant: "secondary", icon: fillMode === 'template' ? 'fas fa-file-import' : 'fas fa-clone', onClick: handleApplyFill, disabled: !fillSourceId, ...reviewTarget('form.fill.apply', '应用'), children: "\u5E94\u7528" })] })), activeWarehouseId && (_jsx(FeeCategoryConfig, { spec: spec, variant: "embedded", rows: activeRows, readOnly: readOnly, onRowsChange: readOnly
                                        ? undefined
                                        : (key, rows) => onWarehouseConfigChange(activeWarehouseId, key, rows) }, activeWarehouseId))] })) })] })] }));
}
export function FormFieldInput({ field, defaultValue, isEdit, onChange, readOnly = false, }) {
    const spanCls = field.span === 2 ? 'md:col-span-2' : '';
    const label = field.required ? `*${field.label}` : field.label;
    const isDisabled = isEdit && field.id === 'feeType';
    const disabledCls = isDisabled ? 'bg-light-bg cursor-not-allowed' : '';
    if (field.id === 'warehouse')
        return null;
    const displayValue = field.type === 'select'
        ? field.options?.find((o) => o.value === defaultValue)?.label ?? defaultValue
        : defaultValue;
    if (readOnly) {
        return (_jsxs("div", { className: spanCls, ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsx("div", { className: "text-xs text-text-muted mb-1", children: field.label }), _jsx("div", { className: "text-sm font-medium text-dark py-2", children: displayValue || '—' })] }));
    }
    return (_jsxs("div", { className: spanCls, ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsx("label", { className: "form-label", children: label }), field.type === 'select' ? (_jsxs("select", { className: `form-input ${disabledCls}`, value: defaultValue, disabled: isDisabled, onChange: (e) => onChange(field.id, e.target.value), children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9" }), field.options?.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] })) : field.type === 'datetime' ? (_jsx("input", { type: "datetime-local", className: `form-input ${disabledCls}`, value: defaultValue, disabled: isDisabled, onChange: (e) => onChange(field.id, e.target.value) })) : (_jsx("input", { type: "text", className: `form-input ${disabledCls}`, placeholder: field.placeholder, value: defaultValue, disabled: isDisabled, onChange: (e) => onChange(field.id, e.target.value) }))] }));
}
