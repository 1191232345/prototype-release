import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button, PrototypeModal } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { describeEffectiveByStart, endOfDay, formatClosedPeriod, formatDateTime, intervalsOverlapClosed, isStartAfterToday, parseDateTime, startOfDay, truncateEndBeforeNewStart, } from './ruleEffectiveTime';
import { FaIcon } from '@prototype/ui/Icon';
const RC001 = {
    id: 'rc-001',
    name: '客户A-规则配置',
    start: parseDateTime('2026-01-01 00:00:00'),
    end: parseDateTime('2026-12-31 23:59:59'),
};
function formatContextPeriod(context) {
    const start = parseDateTime(context.startTime);
    if (!start)
        return '—';
    const end = parseDateTime(context.endTime) ?? endOfDay(start);
    return formatClosedPeriod(startOfDay(start), end);
}
function formatStartLabel(startTime) {
    const d = parseDateTime(startTime);
    if (!d)
        return '—';
    return formatDateTime(startOfDay(d));
}
function EffectiveStatusBadge({ startTime }) {
    const future = isStartAfterToday(startTime);
    const cls = future
        ? 'bg-blue-100 text-blue-800'
        : 'bg-green-100 text-green-800';
    const label = future ? '待生效' : '立即生效';
    return (_jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`, children: label }));
}
function truncateImpactNote(startTime) {
    return isStartAfterToday(startTime)
        ? '旧规则继续执行至调整后失效时间，之后由新规则接管'
        : '旧规则立即停用（失效时间截断）';
}
export function RulePublishPreviewModal({ open, context, preview, onClose, onConfirm }) {
    if (!open)
        return null;
    const hasTruncation = preview.truncations.length > 0;
    const future = isStartAfterToday(context.startTime);
    return (_jsx(PrototypeModal, { title: "\u53D1\u5E03\u524D\u5F71\u54CD\u9884\u89C8", onClose: onClose, size: "lg", children: _jsxs("div", { className: "space-y-4 text-sm", ...reviewTarget('form.publish.preview', '发布前影响预览'), children: [_jsxs("section", { className: "rounded-lg border border-amber-200 bg-amber-50/60 p-4", ...reviewTarget('form.publish.actions', '发布后将执行'), children: [_jsx("h4", { className: "font-semibold text-primary mb-2", children: "\u53D1\u5E03\u540E\u5C06\u6267\u884C" }), _jsxs("ul", { className: "space-y-1.5 text-text-secondary", children: [_jsxs("li", { className: "flex gap-2", children: [_jsx("span", { className: "text-amber-700 shrink-0", children: "\u2460" }), _jsxs("span", { children: [_jsx("strong", { className: "text-dark", children: "\u751F\u6210\u65B0\u89C4\u5219" }), "\uFF1A\u5F53\u524D\u8349\u7A3F\u53D1\u5E03\u4E3A\u5DF2\u53D1\u5E03\u8BB0\u5F55\uFF0C\u51BB\u7ED3\u4EF7\u5361\u5F15\u7528\u4E0E\u8D39\u7528\u9879\u5FEB\u7167"] })] }), _jsxs("li", { className: "flex gap-2", children: [_jsx("span", { className: "text-amber-700 shrink-0", children: "\u2461" }), _jsx("span", { children: hasTruncation ? (_jsxs(_Fragment, { children: [_jsx("strong", { className: "text-dark", children: "\u4FEE\u6539\u65E7\u89C4\u5219" }), "\uFF1A\u5C06 ", preview.truncations.length, " \u6761\u91CD\u53E0\u89C4\u5219\u7684\u5931\u6548\u65F6\u95F4\u622A\u65AD\u81F3\u65B0\u89C4\u5219\u5F00\u59CB\u524D\u4E00\u5929 23:59:59"] })) : (_jsxs(_Fragment, { children: [_jsx("strong", { className: "text-dark", children: "\u4E0D\u4FEE\u6539\u65E7\u89C4\u5219" }), "\uFF1A\u65E0\u65F6\u95F4\u91CD\u53E0\uFF0C\u5DF2\u6709\u89C4\u5219\u4FDD\u6301\u4E0D\u53D8"] })) })] })] })] }), _jsxs("section", { className: "rounded-lg border border-border p-4 bg-light-bg/50", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "font-semibold text-primary", children: "\u65B0\u89C4\u5219" }), _jsx(EffectiveStatusBadge, { startTime: context.startTime })] }), _jsxs("dl", { className: "grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-text-secondary", children: [_jsx("dt", { className: "text-text-muted shrink-0", children: "\u914D\u7F6E\u540D\u79F0" }), _jsx("dd", { className: "font-medium text-dark", children: context.rowName ?? '新建规则配置' }), context.customer && (_jsxs(_Fragment, { children: [_jsx("dt", { className: "text-text-muted shrink-0", children: "\u5BA2\u6237" }), _jsxs("dd", { children: [context.customer, context.warehouse ? ` / ${context.warehouse}` : ''] })] })), context.startTime && (_jsxs(_Fragment, { children: [_jsx("dt", { className: "text-text-muted shrink-0", children: "\u751F\u6548\u5468\u671F" }), _jsxs("dd", { children: [formatContextPeriod(context), _jsx("span", { className: "text-text-muted ml-1", children: "\uFF08\u95ED\u533A\u95F4\uFF09" })] })] })), context.startTime && (_jsxs(_Fragment, { children: [_jsx("dt", { className: "text-text-muted shrink-0", children: "\u751F\u6548\u5224\u5B9A" }), _jsx("dd", { children: describeEffectiveByStart(context.startTime) })] })), context.priceCard && (_jsxs(_Fragment, { children: [_jsx("dt", { className: "text-text-muted shrink-0", children: "\u5F15\u7528\u4EF7\u5361" }), _jsx("dd", { children: context.priceCard })] }))] })] }), _jsxs("section", { className: "rounded-lg border border-border p-4", children: [_jsx("h4", { className: "font-semibold text-primary mb-3", children: "\u5BF9\u5DF2\u6709\u89C4\u5219\u7684\u5F71\u54CD" }), hasTruncation ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-text-secondary mb-3", children: ["\u68C0\u6D4B\u5230\u540C\u5BA2\u6237\u4E0B\u5B58\u5728\u65F6\u95F4\u91CD\u53E0\u7684\u5DF2\u53D1\u5E03\u89C4\u5219\uFF0C\u53D1\u5E03\u540E\u5C06", _jsx("strong", { className: "text-dark", children: "\u6C38\u4E45\u66FF\u4EE3" }), "\uFF08\u6362\u5B8C\u4E0D\u56DE\u5934\uFF09\uFF1A"] }), _jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "bg-light-bg text-text-muted", children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-2 text-left font-medium", children: "\u5DF2\u6709\u89C4\u5219" }), _jsx("th", { className: "px-3 py-2 text-left font-medium", children: "\u539F\u5931\u6548\u65F6\u95F4" }), _jsx("th", { className: "px-3 py-2 text-left font-medium", children: "\u8C03\u6574\u540E" }), _jsx("th", { className: "px-3 py-2 text-left font-medium", children: "\u8BF4\u660E" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: preview.truncations.map((t) => (_jsxs("tr", { className: "hover:bg-hover/50", children: [_jsxs("td", { className: "px-3 py-2", children: [_jsx("div", { className: "font-medium text-dark", children: t.name }), _jsx("div", { className: "text-xs text-text-muted", children: t.id })] }), _jsx("td", { className: "px-3 py-2 text-text-secondary line-through", children: t.currentEndTime }), _jsx("td", { className: "px-3 py-2 font-medium text-amber-800", children: t.newEndTime }), _jsx("td", { className: "px-3 py-2 text-text-secondary", children: truncateImpactNote(context.startTime) })] }, t.id))) })] }) }), _jsxs("p", { className: "mt-3 text-xs text-text-muted", children: ["\u65B0\u89C4\u5219\u4ECE ", _jsx("strong", { className: "text-dark", children: formatStartLabel(context.startTime) }), " \u8D77", future ? '进入待生效状态' : '立即生效', "\u3002"] })] })) : (_jsxs("div", { className: "rounded-lg border border-green-200 bg-green-50 p-3 text-green-900", children: [_jsx(FaIcon, { className: "fas fa-check-circle mr-1" }), "\u65E0\u65F6\u95F4\u91CD\u53E0\uFF0C\u4E0D\u5F71\u54CD\u5DF2\u6709\u89C4\u5219\uFF0C\u53D1\u5E03\u540E\u76F4\u63A5\u6309\u751F\u6548\u5468\u671F\u6267\u884C\u3002"] }))] }), _jsxs("section", { className: "rounded-lg border border-border p-4", children: [_jsx("h4", { className: "font-semibold text-primary mb-2", children: "\u89C4\u5219\u5FEB\u7167" }), _jsx("p", { className: "text-text-secondary", children: "\u53D1\u5E03\u65F6\u5C06\u51BB\u7ED3\u5F53\u524D\u4EF7\u5361\u5F15\u7528\u4E0E\u4E09\u5F20\u8D39\u7528\u5361\u7247\u914D\u7F6E\uFF0C\u751F\u6210\u4E0D\u53EF\u53D8\u5FEB\u7167\uFF1B\u540E\u7EED\u4EF7\u5361\u6A21\u677F\u53D8\u66F4\u4E0D\u5F71\u54CD\u672C\u89C4\u5219\u8BA1\u8D39\u8FFD\u6EAF\u3002" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onClose, ...reviewTarget('form.publish.btn.cancel', '取消'), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", icon: "fas fa-paper-plane", onClick: onConfirm, ...reviewTarget('form.publish.btn.confirm', '确认发布'), children: "\u786E\u8BA4\u53D1\u5E03" })] })] }) }));
}
function buildNewPeriod(context) {
    const rawStart = parseDateTime(context.startTime);
    if (!rawStart)
        return null;
    const start = startOfDay(rawStart);
    const rawEnd = parseDateTime(context.endTime);
    const end = rawEnd ? endOfDay(rawEnd) : endOfDay(start);
    return { start, end };
}
function evaluateCustomerOverlap(context) {
    if (context.customer !== 'c1' && context.customer !== '客户A')
        return null;
    const newPeriod = buildNewPeriod(context);
    if (!newPeriod)
        return { truncations: [] };
    if (!intervalsOverlapClosed(newPeriod, RC001)) {
        return { truncations: [] };
    }
    return {
        truncations: [{
                id: RC001.id,
                name: RC001.name,
                currentEndTime: formatDateTime(RC001.end),
                newEndTime: truncateEndBeforeNewStart(newPeriod.start),
            }],
    };
}
export function resolvePublishPreview(context, publishMeta) {
    if (context.rowId && publishMeta?.[context.rowId]?.autoTruncate) {
        const t = publishMeta[context.rowId].autoTruncate;
        return {
            truncations: [{
                    id: t.id,
                    name: t.name,
                    currentEndTime: t.currentEndTime ?? '—',
                    newEndTime: t.newEndTime,
                }],
        };
    }
    return evaluateCustomerOverlap(context) ?? { truncations: [] };
}
