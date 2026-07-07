import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
const STATE_STYLE = {
    done: { dot: 'bg-accent border-accent', line: 'bg-accent/30' },
    current: { dot: 'bg-white border-accent ring-2 ring-accent/30', line: 'bg-border' },
    pending: { dot: 'bg-white border-border', line: 'bg-border' },
};
export function SkuFillOperationTimeline({ entries, title = '操作时间轴', reviewPrefix = 'detail', }) {
    const timelineReviewId = `${reviewPrefix}.timeline`;
    if (!entries.length) {
        return (_jsx("div", { className: "text-sm text-text-muted", ...reviewTarget(timelineReviewId, title), children: "\u6682\u65E0\u64CD\u4F5C\u8BB0\u5F55" }));
    }
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-card p-5 h-fit sticky top-4", ...reviewTarget(timelineReviewId, title), children: [_jsxs("h3", { className: "font-semibold text-primary mb-4 flex items-center gap-2", children: [_jsx(FaIcon, { className: "fas fa-stream text-accent" }), title] }), _jsx("ol", { className: "relative space-y-0", children: entries.map((entry, index) => {
                    const style = STATE_STYLE[entry.state ?? 'done'] ?? STATE_STYLE.done;
                    const isLast = index === entries.length - 1;
                    return (_jsxs("li", { className: "relative pl-6 pb-6 last:pb-0", children: [!isLast && (_jsx("span", { className: `absolute left-[7px] top-3 bottom-0 w-0.5 ${style.line}`, "aria-hidden": true })), _jsx("span", { className: `absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 ${style.dot}`, "aria-hidden": true }), _jsx("div", { className: "text-xs text-text-muted mb-0.5", children: entry.time }), _jsx("div", { className: "text-sm font-medium text-dark", children: entry.action }), _jsx("div", { className: "text-xs text-text-secondary mt-0.5", children: entry.operator }), entry.remark && (_jsx("div", { className: "text-xs text-text-muted mt-1 bg-light-bg rounded p-2", children: entry.remark }))] }, `${entry.time}-${entry.action}`));
                }) })] }));
}
