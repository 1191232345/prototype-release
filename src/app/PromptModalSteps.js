import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@prototype/ui';
import { CREATE_CONFIRM_PHRASE, REQUIREMENTS_CONFIRM_PHRASE, getPromptLineCount, } from '../lib/generateProjectPrompt';
import { PLATFORM_ICONS, PLATFORM_LABELS } from '../lib/projectPlatform';
import { slugExists } from '../lib/projectStore';
import { slugify } from '../lib/utils';
import { FaIcon } from '@prototype/ui/Icon';
const PLATFORM_HINTS = {
    pc: '复制<strong className="text-primary">短启动 Prompt</strong>后，AI 会先 Read 本地 <code>CREATE.prompt.md</code>，再分阶段澄清现状、痛点与诉求。',
    mobile: '复制短启动 Prompt 后，AI 会先 Read 本地 <code>CREATE.prompt.md</code>（或模板），再按<strong className="text-primary">移动端/PDA</strong>场景澄清需求。',
};
export function PromptFormStep({ platform, name, error, onNameChange, onSubmit, onCancel, }) {
    const slug = name.trim() ? slugify(name) : '';
    const slugConflict = slug ? slugExists(slug) : false;
    const previewLines = name.trim()
        ? getPromptLineCount({ name: name.trim(), slug: slugify(name) }, platform)
        : 0;
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: `inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold ${platform === 'mobile' ? 'bg-teal-50 text-teal-800' : 'bg-primary/5 text-primary'}`, children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]}` }), PLATFORM_LABELS[platform], "\u539F\u578B"] }), _jsx("p", { className: "text-sm text-text-secondary", dangerouslySetInnerHTML: { __html: PLATFORM_HINTS[platform] } }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u540D\u79F0" }), _jsx("input", { className: "form-input", placeholder: platform === 'mobile' ? '如：入库任务 PDA' : '如：入库费规则', value: name, onChange: (e) => onNameChange(e.target.value) }), slug && (_jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u76EE\u5F55 slug\uFF1A", _jsx("code", { className: "bg-light-bg px-1 rounded", children: slug })] })), slugConflict && (_jsxs("p", { className: "text-xs text-orange-700 mt-1 flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-triangle" }), "\u8BE5 slug \u5DF2\u88AB\u5360\u7528\uFF0C\u8BF7\u4FEE\u6539\u9879\u76EE\u540D\u79F0\u540E\u518D\u521B\u5EFA"] }))] }), previewLines > 0 && (_jsxs("p", { className: "text-xs text-text-muted", children: ["\u9884\u4F30\u542F\u52A8 Prompt\uFF1A", previewLines, " \u884C\uFF08\u5B8C\u6574\u89C4\u5219\u5728 CREATE.prompt.md\uFF09"] })), error && (_jsxs("p", { className: "text-sm text-danger flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle" }), error] })), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onCancel, children: "\u53D6\u6D88" }), _jsx(Button, { icon: "fas fa-magic", onClick: onSubmit, children: "\u751F\u6210 Prompt \u5E76\u521B\u5EFA" })] })] }));
}
export function PromptSuccessStep({ platform, prompt, copied, onCopyAgain, onClose, }) {
    const lineCount = prompt.split('\n').length;
    const extraStep = platform === 'mobile'
        ? '确认移动端页面流（列表 → 执行页）与 Mock 数据方案'
        : '确认原型方案（检索、按钮、字段）';
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: `p-3 rounded-lg text-sm ${copied ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`, children: [_jsx(FaIcon, { className: `fas ${copied ? 'fa-check-circle' : 'fa-info-circle'} mr-2` }), copied
                        ? `${PLATFORM_LABELS[platform]} 启动 Prompt 已复制（${lineCount} 行，请确保 AI Read CREATE.prompt.md）`
                        : '自动复制失败，请手动点击下方按钮复制'] }), _jsxs("ol", { className: "text-sm text-text-secondary space-y-1 list-decimal list-inside", children: [_jsx("li", { children: "\u5728 Cursor \u4E2D\u7C98\u8D34\u542F\u52A8 Prompt \u5E76\u53D1\u9001" }), _jsxs("li", { children: ["\u786E\u8BA4 AI \u5DF2 Read ", _jsx("code", { className: "text-xs bg-light-bg px-1 rounded", children: "prototypes/\u2026/CREATE.prompt.md" }), "\uFF08\u4E0D\u5B58\u5728\u5219\u8BFB templates \u6A21\u677F\uFF09"] }), _jsxs("li", { children: ["\u63CF\u8FF0", _jsx("strong", { children: "\u73B0\u72B6\u3001\u75DB\u70B9\u3001\u8BC9\u6C42" }), "\uFF0C\u6309 AI \u9010\u8F6E\u8FFD\u95EE\u8865\u5145\u7EC6\u8282"] }), _jsxs("li", { children: ["\u786E\u8BA4\u9700\u6C42\u7406\u89E3\uFF0C\u56DE\u590D\u300C", REQUIREMENTS_CONFIRM_PHRASE, "\u300D"] }), _jsxs("li", { children: [extraStep, "\uFF0C\u56DE\u590D\u300C", CREATE_CONFIRM_PHRASE, "\u300D"] }), _jsxs("li", { children: ["AI \u521B\u5EFA\u6587\u4EF6\u540E\u8FD0\u884C ", _jsx("code", { className: "text-xs", children: "npm run prompts:gen" }), " \u540C\u6B65 Prompt \u6587\u4EF6"] })] }), _jsx("textarea", { className: "form-input font-mono text-xs min-h-[160px] resize-y", readOnly: true, value: prompt }), _jsxs("div", { className: "flex justify-between items-center text-xs text-text-muted", children: [_jsxs("span", { children: ["\u542F\u52A8 Prompt ", lineCount, " \u884C \u00B7 \u5B8C\u6574\u89C4\u5219\u89C1 CREATE.prompt.md"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "secondary", icon: "fas fa-copy", onClick: onCopyAgain, children: "\u518D\u6B21\u590D\u5236" }), _jsx(Button, { icon: "fas fa-check", onClick: onClose, children: "\u5B8C\u6210" })] })] })] }));
}
