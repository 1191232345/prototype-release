import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SkuFillStatusBadge } from './SkuFillStatusBadge';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function SkuFillDetailContent({ detail, editable, reviewPrefix = 'detail' }) {
    return (_jsx("div", { className: "space-y-6", children: detail.sections.map((section) => (_jsx(SectionBlock, { section: section, editable: editable ?? section.editable, reviewPrefix: reviewPrefix }, section.title))) }));
}
function SectionBlock({ section, editable, reviewPrefix, }) {
    return (_jsxs("div", { ...reviewTarget(`${reviewPrefix}.section`, section.title), children: [_jsxs("h4", { className: "font-semibold text-primary mb-3", children: [_jsx(FaIcon, { className: `fas ${section.icon} mr-2 text-accent` }), section.title] }), section.layout === 'grid' && section.items && _jsx(InfoGrid, { items: section.items }), section.layout === 'sku-table' && section.skuRows && (_jsx(SkuTable, { rows: section.skuRows, editable: editable, reviewPrefix: reviewPrefix }))] }));
}
function InfoGrid({ items }) {
    return (_jsx("div", { className: "grid grid-cols-2 gap-4", children: items.map((item) => (_jsxs("div", { className: "bg-light-bg rounded-lg p-3", children: [_jsx("div", { className: "text-xs text-text-muted mb-1", children: item.label }), _jsx("div", { className: "font-medium text-dark", children: item.label === '工单状态' ? (_jsx(SkuFillStatusBadge, { label: item.value })) : item.type === 'badge' ? (_jsx("span", { className: `inline-flex px-2 py-1 rounded-full text-xs font-semibold ${item.badgeClass}`, children: item.value })) : (item.value) })] }, item.label))) }));
}
function SkuTable({ rows, editable, reviewPrefix, }) {
    if (!rows.length) {
        return _jsx("p", { className: "text-sm text-text-muted", children: "\u6682\u65E0\u5DF2\u63D0\u4EA4\u7684 SKU" });
    }
    return (_jsx("div", { className: "overflow-x-auto", ...reviewTarget(`${reviewPrefix}.sku-table`, 'SKU 补充信息'), children: _jsxs("table", { className: "w-full border-collapse text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-light-bg", children: ['SKU 编码', 'SKU 名称', '长(cm)', '宽(cm)', '高(cm)', '重量(kg)', '图片', '提交时间'].map((h) => (_jsx("th", { className: "border border-border px-2 py-2 text-left text-xs font-semibold text-text-secondary", children: h }, h))) }) }), _jsx("tbody", { children: rows.map((row) => (_jsxs("tr", { className: "bg-white", children: [_jsx("td", { className: "border border-border px-2 py-2", children: row.skuCode }), _jsx("td", { className: "border border-border px-2 py-2", children: row.skuName }), _jsx("td", { className: "border border-border px-2 py-2", children: editable ? _jsx("input", { defaultValue: row.length, className: "w-16 border rounded px-1" }) : row.length }), _jsx("td", { className: "border border-border px-2 py-2", children: editable ? _jsx("input", { defaultValue: row.width, className: "w-16 border rounded px-1" }) : row.width }), _jsx("td", { className: "border border-border px-2 py-2", children: editable ? _jsx("input", { defaultValue: row.height, className: "w-16 border rounded px-1" }) : row.height }), _jsx("td", { className: "border border-border px-2 py-2", children: editable ? _jsx("input", { defaultValue: row.weight, className: "w-16 border rounded px-1" }) : row.weight }), _jsx("td", { className: "border border-border px-2 py-2", children: _jsx(ImageCell, { images: row.images, editable: editable }) }), _jsx("td", { className: "border border-border px-2 py-2 text-xs text-text-muted", children: row.submittedAt ?? '-' })] }, row.skuCode))) })] }) }));
}
function ImageCell({ images, editable }) {
    const list = images ?? [];
    if (!editable) {
        if (!list.length)
            return _jsx("span", { className: "text-text-muted", children: "\u2014" });
        return (_jsx("div", { className: "flex gap-1", children: list.map((img) => (_jsx("span", { title: img, className: "w-8 h-8 bg-light-bg border border-border rounded flex items-center justify-center text-xs text-text-muted", children: _jsx(FaIcon, { className: "fas fa-image" }) }, img))) }));
    }
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-1", ...reviewTarget('audit.sku-images', '图片'), children: [list.map((img) => (_jsxs("span", { className: "relative group", children: [_jsx("span", { title: img, className: "w-8 h-8 bg-light-bg border border-border rounded flex items-center justify-center text-xs text-text-muted", children: _jsx(FaIcon, { className: "fas fa-image" }) }), _jsx("button", { type: "button", title: "\u5220\u9664\u56FE\u7247", className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] leading-none opacity-0 group-hover:opacity-100", ...reviewTarget('audit.sku-image.remove', '删除图片'), children: "\u00D7" })] }, img))), _jsx("button", { type: "button", className: "w-8 h-8 border border-dashed border-accent rounded flex items-center justify-center text-accent hover:bg-accent/5", title: "\u4E0A\u4F20/\u66FF\u6362\u56FE\u7247", ...reviewTarget('audit.sku-image.upload', '上传图片'), children: _jsx(FaIcon, { className: "fas fa-plus text-xs" }) })] }));
}
