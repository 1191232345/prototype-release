import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button, Modal } from '@prototype/ui';
import { saveProjectInfo, getProjectStatus } from '../lib/projectStore';
import { PROJECT_STATUS_LABELS } from '../lib/projectStatus';
import { FaIcon } from '@prototype/ui/Icon';
export function EditProjectModal({ project, open, onClose, onSaved }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('draft');
    const [error, setError] = useState('');
    useEffect(() => {
        if (!open || !project)
            return;
        setName(project.meta.title);
        setDescription(project.description ?? project.meta.changeSummary ?? '');
        setStatus(getProjectStatus(project));
        setError('');
    }, [open, project]);
    if (!open || !project)
        return null;
    const isPending = project.status === 'pending';
    const handleSave = () => {
        if (!name.trim()) {
            setError('请填写项目名称');
            return;
        }
        if (!description.trim()) {
            setError('请填写项目描述');
            return;
        }
        saveProjectInfo(project, name.trim(), description.trim(), isPending ? undefined : status);
        onSaved(project.key);
        onClose();
    };
    return (_jsx(Modal, { title: "\u7F16\u8F91\u4FE1\u606F", onClose: onClose, size: "md", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-text-secondary", children: ["\u4FEE\u6539\u9879\u76EE\u540D\u79F0\u4E0E\u63CF\u8FF0\uFF0C", _jsx("strong", { className: "text-primary", children: "\u65E0\u9700 AI" }), "\uFF0C\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\u3002"] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u540D\u79F0" }), _jsx("input", { className: "form-input", value: name, onChange: (e) => setName(e.target.value) }), _jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u76EE\u5F55 slug\uFF1A", _jsx("code", { className: "bg-light-bg px-1 rounded", children: project.project }), _jsx("span", { className: "ml-1", children: "\uFF08\u4E0D\u53EF\u53D8\u66F4\uFF09" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u63CF\u8FF0" }), _jsx("textarea", { className: "form-input min-h-[100px] resize-y", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "\u5EFA\u8BAE\u4E0E meta.changeSummary \u4FDD\u6301\u4E00\u81F4\uFF0C\u4FBF\u4E8E\u5217\u8868\u5C55\u793A" })] }), !isPending && (_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u9879\u76EE\u72B6\u6001" }), _jsx("select", { className: "form-input w-full", value: status, onChange: (e) => setStatus(e.target.value), children: Object.keys(PROJECT_STATUS_LABELS).map((s) => (_jsx("option", { value: s, children: PROJECT_STATUS_LABELS[s] }, s))) })] })), !isPending && (_jsx("p", { className: "text-xs text-text-muted", children: "\u540D\u79F0\u3001\u63CF\u8FF0\u3001\u72B6\u6001\u4FDD\u5B58\u5728\u6D4F\u89C8\u5668\u672C\u5730\uFF0C\u7528\u4E8E\u5217\u8868\u5C55\u793A\u4E0E\u7B5B\u9009\u3002\u8FED\u4EE3\u65F6 AI \u4F1A\u540C\u6B65\u66F4\u65B0 meta.changeSummary\u3002" })), error && (_jsxs("p", { className: "text-sm text-danger flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle" }), error] })), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onClose, children: "\u53D6\u6D88" }), _jsx(Button, { icon: "fas fa-check", onClick: handleSave, children: "\u4FDD\u5B58" })] })] }) }));
}
