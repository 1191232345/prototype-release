import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SplitReviewPanel } from './SplitReviewPanel';
import { SchemaErrorStrip } from './SchemaErrorStrip';
import { FaIcon } from '@prototype/ui/Icon';
import { isLocalPendingDraft } from '../lib/projectStore';
function EmptyState({ icon, title, description, action, }) {
    return (_jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center max-w-sm", children: [_jsxs("div", { className: "relative w-20 h-20 mx-auto mb-5", children: [_jsx("div", { className: "absolute inset-0 rounded-2xl bg-primary/[0.06] border border-border-light" }), _jsx("div", { className: "absolute inset-2.5 rounded-xl bg-accent/[0.12]" }), _jsx("div", { className: "absolute inset-4 rounded-lg bg-white flex items-center justify-center shadow-soft", children: _jsx(FaIcon, { className: `fas ${icon} text-xl text-primary/50` }) })] }), _jsx("p", { className: "text-base font-semibold text-dark", children: title }), _jsx("p", { className: "text-sm text-text-muted mt-2 leading-relaxed", children: description }), action && _jsx("div", { className: "mt-5", children: action })] }) }));
}
function PreviewFrame({ project, children }) {
    return (_jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [_jsx(SchemaErrorStrip, { item: project }), _jsx("div", { className: "flex-1 flex flex-col min-h-0", children: children })] }));
}
export function PreviewPanel({ project, loading = false, onPrdSaved }) {
    if (!project) {
        return (_jsx(EmptyState, { icon: "fa-layer-group", title: "\u6B22\u8FCE\u4F7F\u7528\u539F\u578B\u5F52\u6863", description: "\u4ECE\u5DE6\u4FA7\u9009\u62E9\u9879\u76EE\u9884\u89C8\uFF0C\u6216\u5728 PC / \u79FB\u52A8\u7AEF\u5206\u533A\u70B9\u51FB + \u521B\u5EFA\u65B0\u539F\u578B" }));
    }
    if (project.status === 'pending') {
        const isPendingDraft = isLocalPendingDraft(project);
        const hasSpecErrors = project.specErrors.length + project.metaErrors.length > 0;
        return (_jsx(PreviewFrame, { project: project, children: _jsx(EmptyState, { icon: hasSpecErrors ? 'fa-triangle-exclamation' : isPendingDraft ? 'fa-hourglass-half' : 'fa-file-circle-exclamation', title: project.meta.title, description: hasSpecErrors
                    ? '项目文件已部分创建但尚未通过校验。请让 AI 按 CREATE.prompt.md 补全 flow.json / meta.json / pages/*.json，并运行 npm run validate'
                    : isPendingDraft
                        ? '项目已创建，点击右上角「复制 Prompt」粘贴到 Cursor 对话中，AI 将自动完成文件创建与归档'
                        : 'Spec 尚未就绪。请补全 flow.json / pages/*.json 后刷新列表，或运行 npm run validate 查看详情' }) }));
    }
    if (loading) {
        return (_jsx(PreviewFrame, { project: project, children: _jsxs("div", { className: "flex-1 flex items-center justify-center p-8 text-text-muted", children: [_jsx(FaIcon, { className: "fas fa-spinner fa-spin mr-2" }), _jsx("span", { className: "text-sm", children: "\u52A0\u8F7D\u9879\u76EE\u8BE6\u60C5\u2026" })] }) }));
    }
    if (Object.keys(project.flow.pages).length === 0) {
        return (_jsx(PreviewFrame, { project: project, children: _jsx(EmptyState, { icon: "fa-file-circle-exclamation", title: "\u9875\u9762 Spec \u5C1A\u672A\u5C31\u7EEA", description: "flow.json \u6216 pages/*.json \u4E0D\u5B8C\u6574\uFF0C\u65E0\u6CD5\u6E32\u67D3\u9884\u89C8\u3002\u8BF7\u5C55\u5F00\u4E0A\u65B9 Schema \u9519\u8BEF\u67E5\u770B\u8BE6\u60C5\u3002" }) }));
    }
    return _jsx(SplitReviewPanel, { project: project, onPrdSaved: onPrdSaved });
}
