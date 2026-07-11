import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { EffectiveStatusBadge } from './EffectiveStatusBadge';
import { ListTableActions } from './ListTableActions';
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
    if (value == null || value === '')
        return _jsx("span", { className: "text-text-muted", children: "\u2014" });
    if (typeof value === 'string')
        return value;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "text-sm text-dark", children: value.primary }), value.secondary && _jsx("div", { className: "text-xs text-text-muted mt-1", children: value.secondary })] }));
}
function isGroupRow(row) {
    return row.rowType === 'group' || (row.children?.length ?? 0) > 0;
}
export function TreeListTable({ columns, rows, defaultExpand = false, selectable, selectedIds = new Set(), onSelectionChange, onView, onEdit, onDelete, onCopy, onPublish, onVoid, }) {
    const initialExpanded = useMemo(() => {
        if (!defaultExpand)
            return new Set();
        return new Set(rows.filter(isGroupRow).map((r) => r.id));
    }, [defaultExpand, rows]);
    const [expandedIds, setExpandedIds] = useState(initialExpanded);
    const toggleExpand = (rowId) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(rowId))
                next.delete(rowId);
            else
                next.add(rowId);
            return next;
        });
    };
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
    if (rows.length === 0) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow-card py-12 text-center", children: [_jsx(FaIcon, { className: "fas fa-cogs text-4xl text-text-muted mb-4" }), _jsx("p", { className: "text-text-secondary", children: "\u6682\u65E0\u89C4\u5219\u914D\u7F6E" })] }));
    }
    const renderDataCells = (row, depth, group) => {
        const dataColumns = columns.filter((c) => c.key !== 'actions');
        const actionColumn = columns.find((c) => c.key === 'actions');
        if (group) {
            const nameCol = dataColumns.find((c) => c.key === 'name');
            const cells = [];
            if (nameCol) {
                cells.push(_jsx("td", { colSpan: dataColumns.length, className: "px-3 sm:px-6 py-3 sm:py-4", ...reviewTarget(`list.col.${nameCol.key}`, nameCol.label), children: _jsxs("button", { type: "button", className: "inline-flex items-start gap-2 text-left hover:text-accent transition-colors w-full", onClick: () => toggleExpand(row.id), "aria-expanded": expandedIds.has(row.id), children: [_jsx("i", { className: `fas fa-chevron-${expandedIds.has(row.id) ? 'down' : 'right'} text-text-muted mt-1 text-xs w-3 shrink-0` }), _jsx("span", { className: "font-semibold text-primary", children: renderCell(row.cells[nameCol.key]) })] }) }, nameCol.key));
            }
            if (actionColumn) {
                cells.push(_jsx("td", { className: "px-3 sm:px-6 py-3 sm:py-4" }, "actions"));
            }
            return cells;
        }
        return columns.map((col) => {
            if (col.key === 'effectiveStatus') {
                return (_jsx("td", { className: "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap", children: group ? (_jsx("span", { className: "text-text-muted", children: "\u2014" })) : (_jsx(EffectiveStatusBadge, { label: cellText(row.cells[col.key]) || '未发布' })) }, col.key));
            }
            if (col.key === 'actions') {
                return (_jsx("td", { className: "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right", children: !group && (_jsx(ListTableActions, { actions: row.actions, rowId: row.id, onView: onView, onEdit: onEdit, onDelete: onDelete, onCopy: onCopy, onPublish: onPublish, onVoid: onVoid })) }, col.key));
            }
            const pad = depth > 0 ? { paddingLeft: `${depth * 1.25 + 0.75}rem` } : undefined;
            const isNameCol = col.key === 'name';
            return (_jsx("td", { className: "px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap", style: isNameCol ? pad : undefined, ...(col.key !== 'actions' && col.key !== 'effectiveStatus'
                    ? reviewTarget(`list.col.${col.key}`, col.label)
                    : {}), children: isNameCol && group ? (_jsxs("button", { type: "button", className: "inline-flex items-start gap-2 text-left hover:text-accent transition-colors", onClick: () => toggleExpand(row.id), "aria-expanded": expandedIds.has(row.id), children: [_jsx("i", { className: `fas fa-chevron-${expandedIds.has(row.id) ? 'down' : 'right'} text-text-muted mt-1 text-xs w-3` }), _jsx("span", { children: renderCell(row.cells[col.key]) })] })) : (renderCell(group && col.key !== 'name' ? undefined : row.cells[col.key])) }, col.key));
        });
    };
    const renderRow = (row, depth = 0) => {
        const group = isGroupRow(row);
        const tr = (_jsxs("tr", { className: `hover:bg-hover transition-colors ${group ? 'bg-light-bg/40 font-medium' : ''}`, children: [selectable && !group && (_jsx("td", { className: "px-3 sm:px-4 py-3 sm:py-4", children: _jsx("input", { type: "checkbox", checked: selectedIds.has(row.id), onChange: () => toggleRow(row.id), onClick: (e) => e.stopPropagation(), "aria-label": `选择 ${row.id}`, className: "rounded border-border text-accent focus:ring-accent cursor-pointer" }) })), selectable && group && _jsx("td", { className: "px-3 sm:px-4 py-3 sm:py-4" }), renderDataCells(row, depth, group)] }, row.id));
        if (!group || !expandedIds.has(row.id))
            return [tr];
        return [tr, ...(row.children ?? []).flatMap((child) => renderRow(child, depth + 1))];
    };
    return (_jsx("div", { className: "bg-white rounded-lg shadow-card overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[640px]", ...reviewTarget('list.table'), children: [_jsx("thead", { className: "bg-light-bg", children: _jsxs("tr", { children: [selectable && (_jsx("th", { className: "px-3 sm:px-4 py-2.5 sm:py-3 w-10", ...reviewTarget('list.selectable', '行勾选'), children: "\u52FE\u9009" })), columns.map((c) => (_jsx("th", { className: "px-3 sm:px-6 py-2.5 sm:py-3 text-left text-xs font-semibold text-text-secondary uppercase whitespace-nowrap", ...reviewTarget(`list.col.${c.key}`, c.label), children: c.label }, c.key)))] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: rows.flatMap((row) => renderRow(row)) })] }) }) }));
}
