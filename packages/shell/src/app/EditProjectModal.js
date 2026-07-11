import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Button, Modal } from '@prototype/ui';
import { saveProjectInfo, getProjectStatus, collectAllTags } from '../lib/projectStore';
import { PROJECT_STATUS_LABELS } from '../lib/projectStatus';
import { FaIcon } from '@prototype/ui/Icon';
export function EditProjectModal({ project, allProjects, open, onClose, onSaved }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('draft');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const tagSuggestions = useMemo(() => {
        const source = allProjects ?? (project ? [project] : []);
        return collectAllTags(source).filter((t) => !tags.includes(t));
    }, [allProjects, project, tags]);
    useEffect(() => {
        if (!open || !project)
            return;
        setName(project.meta.title);
        setDescription(project.description ?? project.meta.changeSummary ?? '');
        setStatus(getProjectStatus(project));
        setTags(project.tags ?? []);
        setTagInput('');
        setError('');
    }, [open, project]);
    if (!open || !project)
        return null;
    const isPending = project.status === 'pending';
    const addTag = (raw) => {
        const trimmed = raw.trim();
        if (!trimmed || tags.includes(trimmed))
            return;
        setTags((prev) => [...prev, trimmed]);
        setTagInput('');
    };
    const removeTag = (tag) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput);
        }
        else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            setTags((prev) => prev.slice(0, -1));
        }
    };
    const handleSave = () => {
        if (!name.trim()) {
            setError('请填写项目名称');
            return;
        }
        if (!description.trim()) {
            setError('请填写项目描述');
            return;
        }
        saveProjectInfo(project, name.trim(), description.trim(), isPending ? undefined : status, tags);
        onSaved(project.key);
        onClose();
    };
    return (_jsx(Modal, { title: "\u7F16\u8F91\u4FE1\u606F", onClose: onClose, size: "md", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("p", { className: "text-sm text-text-secondary", children: ["\u4FEE\u6539\u9879\u76EE\u540D\u79F0\u4E0E\u63CF\u8FF0\uFF0C", _jsx("strong", { className: "text-primary", children: "\u65E0\u9700 AI" }), "\uFF0C\u4FDD\u5B58\u540E\u7ACB\u5373\u751F\u6548\u3002"] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u540D\u79F0" }), _jsx("input", { className: "form-input", value: name, onChange: (e) => setName(e.target.value) }), _jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u76EE\u5F55 slug\uFF1A", _jsx("code", { className: "bg-light-bg px-1 rounded", children: project.project }), _jsx("span", { className: "ml-1", children: "\uFF08\u4E0D\u53EF\u53D8\u66F4\uFF09" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u63CF\u8FF0" }), _jsx("textarea", { className: "form-input min-h-[100px] resize-y", value: description, onChange: (e) => setDescription(e.target.value), placeholder: "\u5EFA\u8BAE\u4E0E meta.changeSummary \u4FDD\u6301\u4E00\u81F4\uFF0C\u4FBF\u4E8E\u5217\u8868\u5C55\u793A" })] }), !isPending && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u9879\u76EE\u72B6\u6001" }), _jsx("select", { className: "form-input w-full", value: status, onChange: (e) => setStatus(e.target.value), children: Object.keys(PROJECT_STATUS_LABELS).map((s) => (_jsx("option", { value: s, children: PROJECT_STATUS_LABELS[s] }, s))) })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u4E1A\u52A1\u6807\u7B7E" }), _jsxs("div", { className: "form-input flex flex-wrap items-center gap-1.5 min-h-[42px]", children: [tags.map((tag) => (_jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium", children: [tag, _jsx("button", { type: "button", className: "text-primary/60 hover:text-primary ml-0.5", "aria-label": `移除标签 ${tag}`, onClick: () => removeTag(tag), children: _jsx(FaIcon, { className: "fas fa-times text-[10px]" }) })] }, tag))), _jsx("input", { className: "flex-1 min-w-[80px] outline-none text-sm bg-transparent", value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: handleTagKeyDown, onBlur: () => addTag(tagInput), placeholder: tags.length === 0 ? '回车或逗号添加，如「计费域」' : '继续添加…' })] }), tagSuggestions.length > 0 && (_jsxs("div", { className: "mt-1.5 flex flex-wrap gap-1", children: [_jsx("span", { className: "text-[11px] text-text-muted self-center", children: "\u5EFA\u8BAE\uFF1A" }), tagSuggestions.slice(0, 6).map((s) => (_jsxs("button", { type: "button", className: "text-[11px] px-1.5 py-0.5 rounded border border-border-light text-text-muted hover:text-primary hover:border-primary/40 transition-colors", onClick: () => addTag(s), children: ["+ ", s] }, s)))] })), _jsx("p", { className: "text-xs text-text-muted mt-1", children: "\u6807\u7B7E\u4EC5\u5B58\u4E8E\u672C\u6D4F\u89C8\u5668\uFF0C\u7528\u4E8E\u4FA7\u8FB9\u680F\u6309\u4E1A\u52A1\u57DF\u5206\u7EC4\u3002\u56DE\u8F66\u6216\u9017\u53F7\u786E\u8BA4\uFF0C\u5220\u9664\u952E\u56DE\u9000\u3002" })] })] })), !isPending && (_jsx("p", { className: "text-xs text-text-muted", children: "\u540D\u79F0\u3001\u63CF\u8FF0\u3001\u72B6\u6001\u3001\u6807\u7B7E\u4FDD\u5B58\u5728\u6D4F\u89C8\u5668\u672C\u5730\uFF0C\u7528\u4E8E\u5217\u8868\u5C55\u793A\u4E0E\u7B5B\u9009\u3002\u8FED\u4EE3\u65F6 AI \u4F1A\u540C\u6B65\u66F4\u65B0 meta.changeSummary\u3002" })), error && (_jsxs("p", { className: "text-sm text-danger flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle" }), error] })), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onClose, children: "\u53D6\u6D88" }), _jsx(Button, { icon: "fas fa-check", onClick: handleSave, children: "\u4FDD\u5B58" })] })] }) }));
}
