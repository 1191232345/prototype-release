import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@prototype/ui';
import { copyText } from '../lib/utils';
import { getProjectStatus } from '../lib/projectStore';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_STYLES } from '../lib/projectStatus';
import { FaIcon } from '@prototype/ui/Icon';
export function SelectedProjectPanel({ project, onEdit, onIterate, onDelete, }) {
    const [copied, setCopied] = useState(false);
    const [showMeta, setShowMeta] = useState(false);
    if (!project) {
        return (_jsx("div", { className: "shrink-0 border-t border-border-light px-4 py-5 text-center", children: _jsx("p", { className: "text-xs text-text-muted", children: "\u9009\u62E9\u9879\u76EE\u4EE5\u67E5\u770B\u64CD\u4F5C" }) }));
    }
    const isPending = project.status === 'pending';
    const errors = [...project.specErrors, ...project.metaErrors];
    const pageCount = Object.keys(project.flow.pages).length;
    const summary = project.description ?? project.meta.changeSummary;
    const status = getProjectStatus(project);
    const hasDocs = !!(project.requirementsText?.trim() ||
        project.prdText?.trim() ||
        project.changelogText?.trim());
    const handleCopyCreatePrompt = async () => {
        if (!project.prompt)
            return;
        setCopied(await copyText(project.prompt));
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsx("div", { className: "shrink-0 border-t border-border-light bg-surface/50 max-h-[50vh] overflow-y-auto", children: _jsxs("div", { className: "px-4 py-3 space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "text-[10px] font-medium text-text-muted uppercase tracking-wide", children: "\u5F53\u524D\u9879\u76EE" }), _jsxs("div", { className: "flex gap-0.5", children: [_jsx(IconBtn, { icon: "fa-edit", title: "\u7F16\u8F91\u4FE1\u606F", onClick: onEdit }), _jsx(IconBtn, { icon: "fa-trash", title: "\u5220\u9664", onClick: onDelete, danger: true })] })] }), _jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-dark truncate flex-1", children: project.meta.title }), !isPending && (_jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${PROJECT_STATUS_STYLES[status]}`, children: PROJECT_STATUS_LABELS[status] }))] }), _jsxs("p", { className: "text-[11px] text-text-muted mt-0.5", children: [project.key, !isPending && pageCount > 0 && ` · ${pageCount} 页`] })] }), isPending ? (_jsx(Button, { icon: "fas fa-copy", className: "w-full py-1.5 text-sm", onClick: handleCopyCreatePrompt, children: copied ? '已复制' : '复制创建 Prompt' })) : (_jsx("div", { className: "space-y-1.5", children: _jsx(Button, { icon: "fas fa-code-branch", className: "w-full py-1.5 text-sm", onClick: onIterate, children: "\u8FED\u4EE3\u539F\u578B" }) })), _jsxs("button", { type: "button", onClick: () => setShowMeta((v) => !v), className: "text-[11px] text-text-muted hover:text-primary flex items-center gap-1", children: [_jsx(FaIcon, { className: `fas fa-chevron-${showMeta ? 'up' : 'down'} text-[9px]` }), showMeta ? '收起详情' : '查看详情'] }), showMeta && (_jsxs("div", { className: "text-[11px] text-text-secondary space-y-2 pt-1 border-t border-border-light", children: [isPending ? (_jsxs("p", { className: "text-orange-700", children: [_jsx(FaIcon, { className: "fas fa-clock mr-1" }), "\u7B49\u5F85 AI \u521B\u5EFA\u6587\u4EF6"] })) : (_jsxs("p", { className: "text-text-muted", children: [project.meta.author, " \u00B7 ", project.meta.createdAt] })), summary && summary !== '待 IDE 补充需求' && (_jsx("p", { className: "text-text-muted leading-relaxed", children: summary })), !isPending && hasDocs && (_jsxs("p", { className: "text-text-muted", children: [_jsx(FaIcon, { className: "fas fa-file-alt mr-1" }), "\u9700\u6C42/\u53D8\u66F4\u6587\u6863\u8BF7\u5728\u53F3\u4FA7\u300C\u9879\u76EE\u6587\u6863\u300DTab \u67E5\u770B"] })), errors.length > 0 && (_jsx("ul", { className: "text-red-600 space-y-0.5", children: errors.map((e, i) => (_jsxs("li", { className: "break-all", children: [_jsx("code", { className: "text-[10px]", children: e.path }), " ", e.message] }, i))) }))] }))] }) }));
}
function IconBtn({ icon, title, onClick, danger, }) {
    return (_jsx("button", { type: "button", title: title, onClick: onClick, className: `p-1.5 rounded-md transition-colors ${danger ? 'text-text-muted hover:text-danger hover:bg-red-50' : 'text-text-muted hover:text-primary hover:bg-hover'}`, children: _jsx(FaIcon, { className: `fas ${icon} text-xs` }) }));
}
export const ProjectSideDetail = SelectedProjectPanel;
