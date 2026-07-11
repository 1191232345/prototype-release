import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Button } from '@prototype/ui';
import { ListTable } from './ListTable';
import { reviewTarget } from '@prototype/review';
function cellText(value) {
    if (value == null)
        return '';
    if (typeof value === 'string')
        return value;
    return value.primary ?? '';
}
function cellSecondary(value) {
    if (value == null || typeof value === 'string')
        return '';
    return value.secondary ?? '';
}
function rowFeeType(row) {
    const ft = row.cells.feeType;
    if (typeof ft === 'string')
        return ft;
    if (ft && typeof ft === 'object')
        return ft.primary ?? '';
    return '';
}
function isGroupRow(row) {
    return row.rowType === 'group' || (row.children?.length ?? 0) > 0;
}
function buildCustomerGroups(rows) {
    return rows.filter(isGroupRow).map((group) => {
        const activeSummary = group.cells.activeSummary;
        const activeHint = typeof activeSummary === 'object' && activeSummary
            ? [activeSummary.primary, activeSummary.secondary].filter(Boolean).join(' · ')
            : typeof activeSummary === 'string'
                ? activeSummary
                : '';
        const customerCode = typeof group.cells.customerCode === 'string' ? group.cells.customerCode : undefined;
        return {
            id: group.id,
            name: cellText(group.cells.name),
            customerCode,
            ruleCountLabel: cellSecondary(group.cells.name) || `共 ${group.children?.length ?? 0} 条规则`,
            activeHint,
            children: group.children ?? [],
        };
    });
}
function activeSummaryForFeeType(children, feeType) {
    const published = children.filter((row) => rowFeeType(row) === feeType && row.status === 'published');
    const active = published.find((row) => row.cells.effectiveStatus === '生效中');
    if (active) {
        const period = active.cells.period;
        if (period && typeof period === 'object') {
            const start = period.primary?.slice(0, 7).replace('-', '-');
            const end = period.secondary?.replace('至 ', '').slice(0, 7);
            return [active.cells.effectiveStatus, `${start} ~ ${end}`].filter(Boolean).join(' · ');
        }
        return String(active.cells.effectiveStatus ?? '生效中');
    }
    const future = published.find((row) => row.cells.effectiveStatus === '待生效');
    if (future)
        return '待生效';
    return published.length ? '已过期' : '暂无生效规则';
}
export function CustomerRuleMasterDetail({ activeFeeType, feeTypeTabs, columns, rows, statusLabels, selectable, selectedIds, onSelectionChange, onAdd, onView, onEdit, onDelete, onCopy, onPublish, onVoid, }) {
    const customers = useMemo(() => buildCustomerGroups(rows), [rows]);
    const [selectedCustomerId, setSelectedCustomerId] = useState(() => customers[0]?.id ?? null);
    const [customerSearch, setCustomerSearch] = useState('');
    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) ?? customers[0];
    const activeFeeTab = feeTypeTabs?.find((t) => t.value === activeFeeType) ?? feeTypeTabs?.[0];
    const filteredCustomers = useMemo(() => {
        const q = customerSearch.trim().toLowerCase();
        if (!q)
            return customers;
        return customers.filter((c) => c.name.toLowerCase().includes(q));
    }, [customers, customerSearch]);
    const ruleRows = useMemo(() => {
        const all = selectedCustomer?.children ?? [];
        if (!feeTypeTabs?.length || !activeFeeType)
            return all;
        return all.filter((row) => rowFeeType(row) === activeFeeType);
    }, [selectedCustomer, activeFeeType, feeTypeTabs]);
    const tabRuleCount = useMemo(() => {
        if (!selectedCustomer || !activeFeeType)
            return 0;
        return selectedCustomer.children.filter((row) => rowFeeType(row) === activeFeeType).length;
    }, [selectedCustomer, activeFeeType]);
    const tabActiveHint = useMemo(() => {
        if (!selectedCustomer || !activeFeeType)
            return '';
        return activeSummaryForFeeType(selectedCustomer.children, activeFeeType);
    }, [selectedCustomer, activeFeeType]);
    const emptyMessage = activeFeeTab
        ? `该客户暂无${activeFeeTab.label}规则配置`
        : '该客户暂无规则配置';
    return (_jsxs("div", { className: "flex flex-col lg:flex-row gap-4 min-h-[520px]", ...reviewTarget('list.master-detail', '客户规则分栏'), children: [_jsxs("aside", { className: "lg:w-64 xl:w-72 shrink-0 flex flex-col border border-border rounded-lg bg-light-bg/40 overflow-hidden max-h-[70vh] lg:max-h-none", ...reviewTarget('list.customer.sidebar', '客户列表'), children: [_jsxs("div", { className: "p-3 border-b border-border-light bg-white space-y-2", children: [_jsx("p", { className: "text-xs font-semibold text-text-secondary px-0.5", children: "\u5BA2\u6237" }), _jsx("input", { type: "search", className: "form-input text-sm", placeholder: "\u641C\u7D22\u5BA2\u6237", value: customerSearch, onChange: (e) => setCustomerSearch(e.target.value), ...reviewTarget('list.customer.search', '搜索客户') })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1", children: filteredCustomers.length === 0 ? (_jsx("p", { className: "text-sm text-text-muted text-center py-8 px-2", children: "\u65E0\u5339\u914D\u5BA2\u6237" })) : (filteredCustomers.map((customer) => {
                            const active = customer.id === selectedCustomer?.id;
                            const badgeCount = activeFeeType
                                ? customer.children.filter((row) => rowFeeType(row) === activeFeeType).length
                                : customer.children.length;
                            return (_jsxs("button", { type: "button", className: `w-full text-left rounded-lg px-3 py-2.5 transition-colors border ${active
                                    ? 'border-accent bg-accent/10 shadow-sm'
                                    : 'border-transparent hover:bg-hover'}`, onClick: () => setSelectedCustomerId(customer.id), ...reviewTarget(`list.customer.item.${customer.id}`, customer.name), children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx("span", { className: `text-sm font-medium ${active ? 'text-primary' : 'text-dark'}`, children: customer.name }), _jsx("span", { className: "shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-gray-100 text-text-muted", children: badgeCount })] }), _jsx("div", { className: "text-xs text-text-muted mt-1", children: activeFeeTab ? `${activeFeeTab.label} · 共 ${badgeCount} 条` : customer.ruleCountLabel }), active && tabActiveHint && (_jsxs("div", { className: "text-[10px] text-accent mt-0.5 truncate", children: ["\u5F53\u524D\uFF1A", tabActiveHint] }))] }, customer.id));
                        })) })] }), _jsx("section", { className: "flex-1 min-w-0 flex flex-col border border-border rounded-lg bg-white overflow-hidden", ...reviewTarget('list.rules.panel', '规则列表'), children: selectedCustomer ? (_jsxs(_Fragment, { children: [_jsxs("header", { className: "shrink-0 px-4 py-3 border-b border-border-light bg-light-bg/30 flex flex-wrap items-center gap-x-3 gap-y-1", ...reviewTarget('list.rules.header', '规则列表标题'), children: [_jsx("h3", { className: "text-sm font-semibold text-primary", children: selectedCustomer.name }), activeFeeTab && (_jsxs("span", { className: "text-xs text-text-muted", children: [activeFeeTab.label, " \u00B7 \u5171 ", tabRuleCount, " \u6761"] })), tabActiveHint && (_jsxs("span", { className: "text-xs text-text-secondary lg:ml-auto", children: ["\u5F53\u524D\u751F\u6548\uFF1A", tabActiveHint] }))] }), onAdd && activeFeeType && (_jsx("div", { className: "shrink-0 px-4 py-2 border-b border-border-light bg-white flex justify-start", ...reviewTarget('list.rules.toolbar', '规则列表工具栏'), children: _jsx(Button, { icon: "fas fa-plus", onClick: () => onAdd({ feeType: activeFeeType, customerCode: selectedCustomer.customerCode }), ...reviewTarget('list.btn.add', '新增'), children: "\u65B0\u589E" }) })), _jsx("div", { className: "flex-1 overflow-auto p-2 sm:p-4", children: _jsx(ListTable, { columns: columns, rows: ruleRows, emptyMessage: emptyMessage, statusLabels: statusLabels, selectable: selectable, selectedIds: selectedIds, onSelectionChange: onSelectionChange, onView: onView, onEdit: onEdit, onDelete: onDelete, onCopy: onCopy, onPublish: onPublish, onVoid: onVoid }) })] })) : (_jsx("div", { className: "flex flex-1 items-center justify-center text-text-muted text-sm p-8", children: "\u8BF7\u4ECE\u5DE6\u4FA7\u9009\u62E9\u5BA2\u6237" })) })] }));
}
