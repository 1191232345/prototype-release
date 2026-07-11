import { jsx as _jsx } from "react/jsx-runtime";
import { reviewTarget } from '@prototype/review';
import { normalizeRowAction, rowActionKey } from '@prototype/runtime/utils/rowActionUtils';
import { FaIcon } from '@prototype/ui/Icon';
const ICON_MAP = {
    view: { icon: 'fas fa-eye', title: '查看', reviewId: 'list.action.view' },
    edit: { icon: 'fas fa-edit', title: '编辑', reviewId: 'list.action.edit' },
    review: { icon: 'fas fa-clipboard-check', title: '审核', color: '#2D936C', reviewId: 'list.action.review' },
};
export function SkuFillListTableActions({ actions, rowId, onView, onEdit, onReview }) {
    const handleClick = (action) => {
        if (action === 'view' && onView)
            onView(rowId);
        if (action === 'edit' && onEdit)
            onEdit(rowId);
        if (action === 'review' && onReview)
            onReview(rowId);
    };
    const items = actions?.length ? actions : ['view'];
    return (_jsx("div", { className: "flex gap-1", children: items.map((item, index) => {
            const action = normalizeRowAction(item);
            const label = typeof item === 'string' ? undefined : item.label;
            const cfg = ICON_MAP[action] ?? ICON_MAP.view;
            const title = label ?? cfg.title;
            return (_jsx("button", { type: "button", className: "action-btn", title: title, style: { color: cfg.color }, onClick: () => handleClick(action), ...reviewTarget(cfg.reviewId, title), children: _jsx(FaIcon, { className: cfg.icon }) }, rowActionKey(item, index)));
        }) }));
}
