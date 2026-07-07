import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaIcon } from '@prototype/ui/Icon';
const MAP = {
    draft: { cls: 'badge-secondary', icon: 'fas fa-pencil-alt', label: '草稿' },
    published: { cls: 'badge-success', icon: 'fas fa-check-circle', label: '已发布' },
    voided: { cls: 'badge-danger', icon: 'fas fa-ban', label: '已作废' },
    pending_warehouse: { cls: 'badge-secondary', icon: 'fas fa-clock', label: '待仓库处理' },
    pending_review: { cls: 'badge-accent', icon: 'fas fa-clipboard-check', label: '待客服审核' },
    returned: { cls: 'bg-amber-100 text-amber-800', icon: 'fas fa-undo', label: '已退回' },
    completed: { cls: 'badge-success', icon: 'fas fa-check-double', label: '已完结' },
    default: { cls: 'badge-secondary', icon: 'fas fa-circle', label: '-' },
};
export function Badge({ status = 'default', label, accent }) {
    if (accent) {
        return _jsx("span", { className: "badge badge-accent", children: label });
    }
    const cfg = MAP[status] ?? MAP.default;
    return (_jsxs("span", { className: `badge ${cfg.cls}`, children: [_jsx(FaIcon, { className: `${cfg.icon} mr-1` }), label ?? cfg.label] }));
}
export function DiscountBadge({ text, configured }) {
    if (!configured) {
        return (_jsxs("span", { className: "badge bg-orange-100 text-orange-800", children: [_jsx(FaIcon, { className: "fas fa-exclamation-triangle mr-1" }), "\u672A\u914D\u7F6E"] }));
    }
    return (_jsxs("span", { className: "badge badge-accent", children: [_jsx(FaIcon, { className: "fas fa-layer-group mr-1" }), text] }));
}
