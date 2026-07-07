import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SplitReviewPanel } from './SplitReviewPanel';
import { FaIcon } from '@prototype/ui/Icon';
function EmptyState({ icon, title, description, action, }) {
    return (_jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center max-w-sm", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-5 rounded-2xl bg-white border border-border-light flex items-center justify-center shadow-soft", children: _jsx(FaIcon, { className: `fas ${icon} text-2xl text-primary/40` }) }), _jsx("p", { className: "text-base font-semibold text-dark", children: title }), _jsx("p", { className: "text-sm text-text-muted mt-2 leading-relaxed", children: description }), action && _jsx("div", { className: "mt-5", children: action })] }) }));
}
export function PreviewPanel({ project, loading = false }) {
    if (!project) {
        return (_jsx(EmptyState, { icon: "fa-layer-group", title: "\u6B22\u8FCE\u4F7F\u7528\u539F\u578B\u5F52\u6863", description: "\u4ECE\u5DE6\u4FA7\u9009\u62E9\u5DF2\u6709\u9879\u76EE\u9884\u89C8\uFF0C\u6216\u70B9\u51FB + \u521B\u5EFA\u65B0\u9879\u76EE" }));
    }
    if (project.status === 'pending') {
        return (_jsx(EmptyState, { icon: "fa-hourglass-half", title: project.meta.title, description: "\u9879\u76EE\u5DF2\u521B\u5EFA\uFF0C\u70B9\u51FB\u53F3\u4E0A\u89D2\u300C\u590D\u5236 Prompt\u300D\u7C98\u8D34\u5230 Cursor \u5BF9\u8BDD\u4E2D\uFF0CAI \u5C06\u81EA\u52A8\u5B8C\u6210\u6587\u4EF6\u521B\u5EFA\u4E0E\u5F52\u6863" }));
    }
    if (loading || Object.keys(project.flow.pages).length === 0) {
        return (_jsxs("div", { className: "flex-1 flex items-center justify-center p-8 text-text-muted", children: [_jsx(FaIcon, { className: "fas fa-spinner fa-spin mr-2" }), _jsx("span", { className: "text-sm", children: "\u52A0\u8F7D\u9879\u76EE\u8BE6\u60C5\u2026" })] }));
    }
    return _jsx(SplitReviewPanel, { project: project });
}
