import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { PrototypeModal } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { normalizeRowAction, rowActionKey } from '../../lib/rowActionUtils';
import { FaIcon } from '@prototype/ui/Icon';
export function ListTableActions(props) {
    const { actions, rowId, onView, onEdit, onDelete, onCopy, onPublish, onVoid } = props;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCopyConfirm, setShowCopyConfirm] = useState(false);
    const [showVoidConfirm, setShowVoidConfirm] = useState(false);
    const iconMap = {
        view: { icon: 'fas fa-eye', title: '查看', reviewId: 'list.action.view' },
        edit: { icon: 'fas fa-edit', title: '编辑', reviewId: 'list.action.edit' },
        publish: { icon: 'fas fa-paper-plane', title: '发布', color: '#2D936C', reviewId: 'list.action.publish' },
        delete: { icon: 'fas fa-trash', title: '删除', color: '#C44536', reviewId: 'list.action.delete' },
        void: { icon: 'fas fa-ban', title: '作废', color: '#D4853A', reviewId: 'list.action.void' },
        copy: { icon: 'fas fa-copy', title: '复制', reviewId: 'list.action.copy' },
    };
    const handleClick = (action) => {
        if (action === 'view' && onView)
            onView(rowId);
        if (action === 'edit' && onEdit)
            onEdit(rowId);
        if (action === 'delete')
            setShowDeleteConfirm(true);
        if (action === 'copy')
            setShowCopyConfirm(true);
        if (action === 'publish' && onPublish)
            onPublish(rowId);
        if (action === 'void')
            setShowVoidConfirm(true);
    };
    const items = actions?.length ? actions : ['view'];
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex gap-1", children: items.map((item, index) => {
                    const action = normalizeRowAction(item);
                    const label = typeof item === 'string' ? undefined : item.label;
                    const cfg = iconMap[action] ?? iconMap.view;
                    const title = label ?? cfg.title;
                    return (_jsx("button", { type: "button", className: "action-btn", title: title, style: { color: cfg.color }, onClick: () => handleClick(action), ...reviewTarget(cfg.reviewId, title), children: _jsx(FaIcon, { className: cfg.icon }) }, rowActionKey(item, index)));
                }) }), showDeleteConfirm && (_jsx(PrototypeModal, { title: "\u786E\u8BA4\u5220\u9664", onClose: () => setShowDeleteConfirm(false), size: "md", children: _jsxs("div", { className: "text-center py-4", children: [_jsx(FaIcon, { className: "fas fa-exclamation-triangle text-5xl text-red-500 mb-4" }), _jsx("p", { className: "text-base text-text-secondary mb-6", children: "\u786E\u5B9A\u8981\u5220\u9664\u8BE5\u89C4\u5219\u914D\u7F6E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002" }), _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx("button", { type: "button", className: "px-6 py-2 bg-gray-200 rounded-lg", onClick: () => setShowDeleteConfirm(false), children: "\u53D6\u6D88" }), _jsx("button", { type: "button", className: "px-6 py-2 bg-red-500 text-white rounded-lg", onClick: () => { onDelete?.(rowId); setShowDeleteConfirm(false); }, children: "\u786E\u8BA4\u5220\u9664" })] })] }) })), showCopyConfirm && (_jsx(PrototypeModal, { title: "\u786E\u8BA4\u590D\u5236\u65B0\u589E", onClose: () => setShowCopyConfirm(false), size: "md", children: _jsxs("div", { className: "text-center py-4", children: [_jsx(FaIcon, { className: "fas fa-copy text-5xl text-blue-500 mb-4" }), _jsx("p", { className: "text-base text-text-secondary mb-6", children: "\u786E\u5B9A\u8981\u57FA\u4E8E\u8BE5\u89C4\u5219\u914D\u7F6E\u521B\u5EFA\u65B0\u8349\u7A3F\u5417\uFF1F" }), _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx("button", { type: "button", className: "px-6 py-2 bg-gray-200 rounded-lg", onClick: () => setShowCopyConfirm(false), children: "\u53D6\u6D88" }), _jsx("button", { type: "button", className: "px-6 py-2 bg-blue-500 text-white rounded-lg", onClick: () => { onCopy?.(rowId); setShowCopyConfirm(false); }, children: "\u786E\u8BA4\u590D\u5236" })] })] }) })), showVoidConfirm && (_jsx(PrototypeModal, { title: "\u786E\u8BA4\u4F5C\u5E9F", onClose: () => setShowVoidConfirm(false), size: "md", children: _jsxs("div", { className: "text-center py-4", children: [_jsx(FaIcon, { className: "fas fa-ban text-5xl text-amber-500 mb-4" }), _jsx("p", { className: "text-base text-text-secondary mb-6", children: "\u786E\u5B9A\u8981\u4F5C\u5E9F\u8BE5\u89C4\u5219\u914D\u7F6E\u5417\uFF1F\u4F5C\u5E9F\u540E\u4E0D\u53EF\u6062\u590D\uFF0C\u5386\u53F2\u8BA1\u8D39\u4ECD\u4FDD\u7559\u5FEB\u7167\u8FFD\u6EAF\u3002" }), _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx("button", { type: "button", className: "px-6 py-2 bg-gray-200 rounded-lg", onClick: () => setShowVoidConfirm(false), children: "\u53D6\u6D88" }), _jsx("button", { type: "button", className: "px-6 py-2 bg-amber-600 text-white rounded-lg", onClick: () => { onVoid?.(rowId); setShowVoidConfirm(false); }, children: "\u786E\u8BA4\u4F5C\u5E9F" })] })] }) }))] }));
}
