import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { SkuFillListTableActions } from './SkuFillListTableActions';
import { SkuFillStatusBadge } from './SkuFillStatusBadge';
import { reviewTarget } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
function cellText(value) {
    if (value == null)
        return '';
    if (typeof value === 'string')
        return value;
    return value.primary ?? '';
}
function renderCell(value) {
    if (typeof value === 'string')
        return value;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm text-dark", children: value.primary }), value.secondary && _jsx("div", { className: "text-xs text-text-muted mt-1", children: value.secondary })] }));
}
export function SkuFillListTable({ columns, rows, onView, onEdit, onReview }) {
    if (rows.length === 0) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow-card py-12 text-center", children: [_jsx(FaIcon, { className: "fas fa-clipboard-list text-4xl text-text-muted mb-4" }), _jsx("p", { className: "text-text-secondary", children: "\u6682\u65E0\u5DE5\u5355\u8BB0\u5F55" })] }));
    }
    return (_jsx("div", { className: "bg-white rounded-lg shadow-card overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[640px]", ...reviewTarget('list.table'), children: [_jsx("thead", { className: "bg-light-bg", children: _jsx("tr", { children: columns.map((c) => (_jsx("th", { className: "px-3 sm:px-6 py-2.5 sm:py-3 text-left text-xs font-semibold text-text-secondary uppercase whitespace-nowrap", ...reviewTarget(`list.col.${c.key}`, c.label), children: c.label }, c.key))) }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: rows.map((row) => (_jsx("tr", { className: "hover:bg-hover transition-colors", children: columns.map((col) => (_jsx("td", { className: "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap", children: col.key === 'status' ? (_jsx(SkuFillStatusBadge, { label: cellText(row.cells[col.key]) })) : col.key === 'priority' && cellText(row.cells[col.key]) === '高' ? (_jsx("span", { className: "text-red-600 font-semibold text-sm", children: "\u9AD8" })) : col.key === 'actions' ? (_jsx(SkuFillListTableActions, { actions: row.actions, rowId: row.id, onView: onView, onEdit: onEdit, onReview: onReview })) : (renderCell(row.cells[col.key] ?? '-')) }, col.key))) }, row.id))) })] }) }) }));
}
