import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@prototype/ui';
import { SkuFillFormSkuTable, linesToSkuCodes, skuCodesToLines } from './SkuFillFormSkuTable';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
function findField(sections, id) {
    for (const section of sections ?? []) {
        const field = section.fields?.find((f) => f.id === id);
        if (field)
            return field;
    }
    return undefined;
}
export function SkuFillWorkOrderForm({ sections, skuOptions = [], editData, formActions, editId, skuMaxRows, onCancel, onSubmit, }) {
    const rowEdit = editId ? editData?.[editId] : undefined;
    const skuSection = sections?.find((s) => s.layout === 'sku-line-table');
    const maxRows = skuMaxRows ?? skuSection?.maxRows;
    const [customer, setCustomer] = useState(rowEdit?.customer ?? '');
    const [priority, setPriority] = useState(rowEdit?.priority ?? 'medium');
    const [warehouse, setWarehouse] = useState(rowEdit?.warehouse ?? '');
    const [remark, setRemark] = useState(rowEdit?.remark ?? '');
    const [skuLines, setSkuLines] = useState(() => {
        const codes = rowEdit?.skuLines?.split(',').filter(Boolean) ?? [];
        const limited = maxRows === 1 ? codes.slice(0, 1) : codes;
        return limited.length ? skuCodesToLines(limited) : [{ id: 'line-0', skuCode: '' }];
    });
    const warehouseField = findField(sections, 'warehouse');
    const priorityField = findField(sections, 'priority');
    const handleSubmit = () => {
        const skuCount = linesToSkuCodes(skuLines).length;
        if (!customer || !warehouse || skuCount === 0)
            return;
        if (maxRows === 1 && skuCount !== 1)
            return;
        onSubmit();
    };
    const renderField = (field) => {
        if (field.id === 'customer') {
            return (_jsxs("div", { ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsxs("label", { className: "block text-sm text-text-secondary mb-1", children: [field.label, " ", field.required && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm", value: customer, onChange: (e) => setCustomer(e.target.value), children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9\u5BA2\u6237" }), (field.options ?? []).map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] })] }, field.id));
        }
        if (field.id === 'priority') {
            return (_jsxs("div", { ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsxs("label", { className: "block text-sm text-text-secondary mb-1", children: [field.label, " ", field.required && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("select", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm", value: priority, onChange: (e) => setPriority(e.target.value), children: (field.options ?? priorityField?.options ?? []).map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value))) })] }, field.id));
        }
        if (field.id === 'warehouse') {
            return (_jsxs("div", { ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsxs("label", { className: "block text-sm text-text-secondary mb-1", children: [field.label, " ", field.required && _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm", value: warehouse, onChange: (e) => setWarehouse(e.target.value), children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9\u4ED3\u5E93" }), (field.options ?? warehouseField?.options ?? []).map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] })] }, field.id));
        }
        if (field.id === 'remark') {
            return (_jsxs("div", { className: "col-span-2", ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsx("label", { className: "block text-sm text-text-secondary mb-1", children: field.label }), _jsx("textarea", { className: "w-full border border-border rounded-lg px-3 py-2 text-sm", rows: 3, maxLength: 500, placeholder: field.placeholder, value: remark, onChange: (e) => setRemark(e.target.value) })] }, field.id));
        }
        return null;
    };
    return (_jsxs("div", { className: "space-y-6", children: [(sections ?? []).map((section) => (_jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-primary mb-4", children: [section.icon && _jsx(FaIcon, { className: `fas ${section.icon} mr-2 text-accent` }), section.title] }), section.layout === 'sku-line-table' ? (_jsx(SkuFillFormSkuTable, { rows: skuLines, skuOptions: skuOptions, onChange: setSkuLines, maxRows: section.maxRows })) : (_jsx("div", { className: "grid grid-cols-2 gap-4", children: (section.fields ?? []).map((field) => renderField(field)) }))] }, section.title))), _jsx("div", { className: "flex justify-end gap-3 pt-2 border-t border-border-light", children: (formActions ?? [{ label: '取消', variant: 'secondary' }, { label: '提交', variant: 'primary' }]).map((action) => {
                    const reviewId = action.label === '取消' ? 'form.btn.cancel' : action.label === '提交' ? 'form.btn.submit' : `form.btn.${action.label}`;
                    return (_jsx(Button, { variant: action.variant, icon: action.icon, onClick: action.label === '取消' ? onCancel : handleSubmit, ...reviewTarget(reviewId, action.label), children: action.label }, action.label));
                }) })] }));
}
