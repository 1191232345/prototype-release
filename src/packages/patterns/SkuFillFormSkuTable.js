import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
function lookupSku(skuOptions, code) {
    return skuOptions.find((o) => o.value === code);
}
export function SkuFillFormSkuTable({ rows, skuOptions, onChange, maxRows }) {
    const singleSku = maxRows === 1;
    const canAddRow = !singleSku && (!maxRows || rows.length < maxRows);
    const addRow = () => {
        if (!canAddRow)
            return;
        onChange([...rows, { id: `line-${Date.now()}`, skuCode: '' }]);
    };
    const removeRow = (id) => {
        if (singleSku)
            return;
        onChange(rows.filter((r) => r.id !== id));
    };
    const updateSku = (id, skuCode) => {
        onChange(rows.map((r) => (r.id === id ? { ...r, skuCode } : r)));
    };
    return (_jsxs("div", { className: "mt-2", ...reviewTarget('form.sku.line.table', singleSku ? 'SKU' : 'SKU 列表'), children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm border-collapse", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-light-bg", children: (singleSku ? ['SKU', '尺寸', '重量'] : ['SKU', '尺寸', '重量', '操作']).map((h) => (_jsx("th", { className: "border border-border px-3 py-2 text-left text-xs font-semibold text-text-secondary", children: h }, h))) }) }), _jsx("tbody", { children: rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: singleSku ? 3 : 4, className: "border border-border px-3 py-6 text-center text-text-muted text-sm", children: singleSku ? '请选择 SKU' : '暂无 SKU，请点击下方「新增一行」添加' }) })) : (rows.map((row) => {
                                const sku = lookupSku(skuOptions, row.skuCode);
                                return (_jsxs("tr", { className: "bg-white", children: [_jsx("td", { className: "border border-border px-3 py-2", children: _jsxs("select", { className: "w-full min-w-[160px] border border-border rounded px-2 py-1.5 text-sm", value: row.skuCode, onChange: (e) => updateSku(row.id, e.target.value), ...reviewTarget('form.field.skus', 'SKU'), children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9 SKU" }), skuOptions.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] }) }), _jsx("td", { className: "border border-border px-3 py-2 text-text-secondary", children: sku?.currentSize ?? (row.skuCode ? '待补充' : '—') }), _jsx("td", { className: "border border-border px-3 py-2 text-text-secondary", children: sku?.currentWeight ?? (row.skuCode ? '待补充' : '—') }), !singleSku && (_jsx("td", { className: "border border-border px-3 py-2", children: _jsx("button", { type: "button", className: "text-red-500 hover:text-red-700 text-sm", title: "\u5220\u9664\u884C", onClick: () => removeRow(row.id), ...reviewTarget('form.sku.btn.remove', '删除行'), children: _jsx(FaIcon, { className: "fas fa-trash" }) }) }))] }, row.id));
                            })) })] }) }), canAddRow && (_jsxs("button", { type: "button", className: "mt-3 px-3 py-1.5 text-sm border border-border rounded-lg text-accent hover:bg-light-bg", onClick: addRow, ...reviewTarget('form.sku.btn.add', '新增一行'), children: [_jsx(FaIcon, { className: "fas fa-plus mr-1" }), " \u65B0\u589E\u4E00\u884C"] }))] }));
}
export function skuCodesToLines(codes) {
    return codes.map((code, i) => ({ id: `line-${i}`, skuCode: code }));
}
export function linesToSkuCodes(rows) {
    return rows.map((r) => r.skuCode).filter(Boolean);
}
