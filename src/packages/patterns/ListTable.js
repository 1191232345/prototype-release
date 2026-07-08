import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { EffectiveStatusBadge } from './EffectiveStatusBadge';
import { ListTableActions } from './ListTableActions';
import { reviewTarget } from '../../lib/reviewLink';
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
export function ListTable({ columns, rows, selectable, selectedIds = new Set(), onSelectionChange, emptyMessage = '暂无补收记录', onView, onEdit, onDelete, onCopy, onPublish, onVoid, }) {
    const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
    const someSelected = rows.some((r) => selectedIds.has(r.id));
    const toggleRow = (rowId) => {
        if (!onSelectionChange)
            return;
        const next = new Set(selectedIds);
        if (next.has(rowId))
            next.delete(rowId);
        else
            next.add(rowId);
        onSelectionChange(next);
    };
    const toggleAll = () => {
        if (!onSelectionChange)
            return;
        if (allSelected) {
            onSelectionChange(new Set());
        }
        else {
            onSelectionChange(new Set(rows.map((r) => r.id)));
        }
    };
    if (rows.length === 0) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow-card py-12 text-center", children: [_jsx(FaIcon, { className: "fas fa-cogs text-4xl text-text-muted mb-4" }), _jsx("p", { className: "text-text-secondary", children: emptyMessage })] }));
    }
    return (_jsx("div", { className: "bg-white rounded-lg shadow-card overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[640px]", ...reviewTarget('list.table'), children: [_jsx("thead", { className: "bg-light-bg", children: _jsxs("tr", { children: [selectable && (_jsx("th", { className: "px-3 sm:px-4 py-2.5 sm:py-3 w-10", ...reviewTarget('list.selectable', '行勾选'), children: _jsx("input", { type: "checkbox", checked: allSelected, ref: (el) => {
                                            if (el)
                                                el.indeterminate = someSelected && !allSelected;
                                        }, onChange: toggleAll, onClick: (e) => e.stopPropagation(), "aria-label": "\u5168\u9009", className: "rounded border-border text-accent focus:ring-accent cursor-pointer" }) })), columns.map((c) => (_jsx("th", { className: "px-3 sm:px-6 py-2.5 sm:py-3 text-left text-xs font-semibold text-text-secondary uppercase whitespace-nowrap", ...reviewTarget(`list.col.${c.key}`, c.label), children: c.label }, c.key)))] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: rows.map((row) => (_jsxs("tr", { className: "hover:bg-hover transition-colors", children: [selectable && (_jsx("td", { className: "px-3 sm:px-4 py-3 sm:py-4", children: _jsx("input", { type: "checkbox", checked: selectedIds.has(row.id), onChange: () => toggleRow(row.id), onClick: (e) => e.stopPropagation(), "aria-label": `选择 ${row.id}`, className: "rounded border-border text-accent focus:ring-accent cursor-pointer" }) })), columns.map((col) => (_jsx("td", { className: "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap", ...(col.key !== 'actions' && col.key !== 'effectiveStatus'
                                        ? reviewTarget(`list.col.${col.key}`, col.label)
                                        : {}), children: col.key === 'effectiveStatus' ? (_jsx(EffectiveStatusBadge, { label: cellText(row.cells[col.key]) || '未发布' })) : col.key === 'actions' ? (_jsx(ListTableActions, { actions: row.actions, rowId: row.id, onView: onView, onEdit: onEdit, onDelete: onDelete, onCopy: onCopy, onPublish: onPublish, onVoid: onVoid })) : (renderCell(row.cells[col.key] ?? '-')) }, col.key)))] }, row.id))) })] }) }) }));
}
