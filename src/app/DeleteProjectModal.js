import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button, Modal } from '@prototype/ui';
import { deleteProjectByKey } from '../lib/deleteProject';
import { isLocalPendingDraft, removePendingProject } from '../lib/projectStore';
import { FaIcon } from '@prototype/ui/Icon';
export function DeleteProjectModal({ project, open, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (open) {
            setLoading(false);
            setError(null);
        }
    }, [open]);
    if (!open || !project)
        return null;
    const isPendingDraft = isLocalPendingDraft(project);
    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        if (isPendingDraft) {
            removePendingProject(project.key);
            onDeleted('待创建项目已移除');
            onClose();
            return;
        }
        const result = await deleteProjectByKey(project.key);
        if (!result.ok) {
            setError(result.error);
            setLoading(false);
            return;
        }
        onDeleted(`项目已删除：${project.meta.title}`);
        onClose();
        window.location.reload();
    };
    return (_jsx(Modal, { title: "\u5220\u9664\u9879\u76EE", onClose: onClose, size: "md", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-text-secondary", children: ["\u786E\u5B9A\u5220\u9664\u9879\u76EE ", _jsx("strong", { children: project.meta.title }), "\uFF08", project.key, "\uFF09\uFF1F"] }), isPendingDraft ? (_jsx("p", { className: "text-xs text-text-muted", children: "\u5F85\u521B\u5EFA\u9879\u76EE\u5C06\u76F4\u63A5\u4ECE\u5217\u8868\u79FB\u9664\u3002" })) : (_jsxs("p", { className: "text-xs text-text-muted", children: ["\u5C06\u6C38\u4E45\u5220\u9664 ", _jsxs("code", { className: "text-[11px]", children: ["prototypes/", project.key, "/"] }), ' ', "\u76EE\u5F55\u53CA\u5176\u5168\u90E8\u6587\u4EF6\uFF0C\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\u3002"] })), error && (_jsxs("p", { className: "text-xs text-red-600", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle mr-1" }), error] })), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "secondary", onClick: onClose, disabled: loading, children: "\u53D6\u6D88" }), _jsx(Button, { icon: "fas fa-trash", onClick: handleDelete, disabled: loading, children: loading ? '删除中…' : '确认删除' })] })] }) }));
}
