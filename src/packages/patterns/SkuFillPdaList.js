import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { MobileDeviceFrame } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { SkuFillStatusBadge } from './SkuFillStatusBadge';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
function cellText(value) {
    if (!value)
        return '—';
    return typeof value === 'string' ? value : value.primary;
}
function cellSecondary(value) {
    if (!value || typeof value === 'string')
        return '';
    return value.secondary ?? '';
}
function cellSearch(value) {
    if (!value)
        return [];
    if (typeof value === 'string')
        return [value];
    return [value.primary, value.secondary ?? ''].filter(Boolean);
}
function resolveTaskPageId(pageLabels) {
    if (pageLabels?.task !== undefined)
        return 'task';
    if (pageLabels?.pda !== undefined)
        return 'pda';
    return 'task';
}
function resolveRowSku(row, details) {
    const fromCell = row.cells.sku;
    if (fromCell) {
        return {
            name: cellText(fromCell),
            code: cellSecondary(fromCell),
        };
    }
    const skuRow = details?.[row.id]?.sections
        ?.find((section) => section.layout === 'pda-sku-form')
        ?.skuRows?.[0];
    if (skuRow) {
        return { name: skuRow.skuName, code: skuRow.skuCode };
    }
    return { name: '', code: '' };
}
export function SkuFillPdaListPattern({ spec }) {
    const flow = useFlowNav();
    const taskPageId = resolveTaskPageId(flow?.pageLabels);
    const searchFilter = spec.filters?.find((item) => item.id === 'keyword' || item.type === 'text');
    const statusFilterConfig = spec.filters?.find((item) => item.id === 'status' && item.options?.length);
    const statusOptions = statusFilterConfig?.options?.length
        ? statusFilterConfig.options
        : [
            { value: 'all', label: '全部' },
            { value: 'pending_warehouse', label: '待处理' },
            { value: 'returned', label: '已退回' },
            { value: 'completed', label: '已完结' },
        ];
    const [statusFilter, setStatusFilter] = useState('all');
    const [keyword, setKeyword] = useState('');
    const rows = useMemo(() => {
        const all = spec.table?.rows ?? [];
        return all.filter((row) => {
            const statusText = cellText(row.cells.status);
            const statusOk = statusFilter === 'all' ||
                row.status === statusFilter ||
                statusText === statusFilter;
            if (!statusOk)
                return false;
            if (!keyword.trim())
                return true;
            const q = keyword.trim().toLowerCase();
            const cells = Object.values(row.cells).flatMap((value) => cellSearch(value)).map((text) => text.toLowerCase());
            return cells.some((text) => text.includes(q));
        });
    }, [spec.table?.rows, statusFilter, keyword]);
    const openTask = (rowId, status) => {
        flow?.navigate(taskPageId, { rowId, status: status ?? '' });
    };
    return (_jsx(MobileDeviceFrame, { children: _jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface", children: [_jsxs("header", { className: "shrink-0 bg-primary text-white px-4 py-3 border-b-2 border-accent", ...reviewTarget('list.title', spec.title), children: [_jsx("p", { className: "text-[11px] text-white/70 font-medium tracking-wide", children: spec.header?.brand ?? 'ELSA PDA' }), _jsx("h1", { className: "text-base font-semibold mt-0.5", children: spec.title })] }), _jsxs("div", { className: "shrink-0 px-3 pt-3 pb-2 space-y-2 bg-white border-b border-border-light", children: [_jsx("div", { ...reviewTarget('list.filter.search', '搜索'), children: _jsxs("div", { className: "relative", children: [_jsx(FaIcon, { className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs" }), _jsx("input", { type: "search", value: keyword, onChange: (e) => setKeyword(e.target.value), placeholder: searchFilter?.placeholder || `搜索 ${searchFilter?.label || '任务信息'}`, className: "w-full h-10 pl-8 pr-3 text-sm border border-border rounded-lg bg-light-bg focus:outline-none focus:ring-2 focus:ring-accent/30" })] }) }), _jsx("div", { className: "flex gap-1.5 overflow-x-auto pb-0.5", ...reviewTarget('list.filter.status', statusFilterConfig?.label || '状态'), children: statusOptions.map((opt) => (_jsx("button", { type: "button", className: `shrink-0 px-3 h-8 rounded-full text-xs font-medium transition-colors ${statusFilter === opt.value
                                    ? 'bg-accent text-white'
                                    : 'bg-light-bg text-text-secondary border border-border-light'}`, onClick: () => setStatusFilter(opt.value), children: opt.label }, opt.value))) })] }), _jsx("div", { className: "flex-1 min-h-0 overflow-y-auto overscroll-contain p-3", ...reviewTarget('list.table', '任务列表'), children: rows.length ? (_jsx("ul", { className: "space-y-2.5", children: rows.map((row) => (_jsx(PdaTaskCard, { row: row, details: spec.details, onOpen: () => openTask(row.id, row.status) }, row.id))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-text-muted", children: [_jsx(FaIcon, { className: "fas fa-inbox text-3xl mb-3 opacity-40" }), _jsx("p", { className: "text-sm", children: "\u6682\u65E0\u5339\u914D\u4EFB\u52A1" })] })) })] }) }));
}
function PdaTaskCard({ row, details, onOpen, }) {
    const sku = resolveRowSku(row, details);
    const orderNo = cellText(row.cells.orderNo);
    const warehouse = cellText(row.cells.warehouse);
    const locationCode = cellText(row.cells.locationCode);
    const palletNo = cellText(row.cells.palletNo);
    const statusText = cellText(row.cells.status);
    const isCompleted = row.status === 'completed' || statusText === '已完成' || statusText === '已完结';
    const isReturned = row.status === 'returned' || statusText === '驳回';
    const isViewDetail = isCompleted || isReturned;
    const hasSku = Boolean(sku.name);
    const cardTitle = hasSku ? sku.name : orderNo;
    const cardSubtitle = hasSku ? sku.code : '';
    const hasMeta = (hasSku && orderNo !== '—') ||
        warehouse !== '—' ||
        locationCode !== '—' ||
        palletNo !== '—';
    return (_jsx("li", { children: _jsxs("button", { type: "button", className: "w-full text-left bg-white rounded-xl border border-border-light shadow-sm p-3 active:bg-light-bg transition-colors", onClick: onOpen, ...reviewTarget(`list.row.${row.id}`, cardTitle), children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-dark truncate", children: cardTitle }), cardSubtitle ? (_jsx("p", { className: "text-xs text-text-muted truncate mt-0.5", children: cardSubtitle })) : null] }), _jsx(SkuFillStatusBadge, { label: statusText })] }), hasMeta ? (_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-[11px] text-text-secondary mb-2", children: [hasSku && orderNo !== '—' ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-clipboard-list text-text-muted" }), orderNo] })) : null, warehouse !== '—' ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-warehouse text-text-muted" }), warehouse] })) : null, locationCode !== '—' ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-map-marker-alt text-text-muted" }), locationCode] })) : null, palletNo !== '—' ? (_jsxs("span", { className: "inline-flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-pallet text-text-muted" }), palletNo] })) : null] })) : null, _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border-light", children: [_jsx("span", { className: isReturned
                                ? 'text-xs text-red-600 font-bold'
                                : 'text-xs text-accent font-medium', children: isViewDetail ? '查看详情' : '开始录入' }), _jsx(FaIcon, { className: `fas fa-chevron-right text-xs ${isReturned ? 'text-red-600' : 'text-accent'}` })] })] }) }));
}
