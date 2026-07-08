import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@prototype/ui';
import { getPromptLineCount } from '../lib/generateProjectPrompt';
import { PLATFORM_ICONS, PLATFORM_LABELS } from '../lib/projectPlatform';
import { slugExists } from '../lib/projectStore';
import { slugify } from '../lib/utils';
import { FaIcon } from '@prototype/ui/Icon';
const PLATFORM_HINTS = {
    pc: '将在 <code class="text-xs bg-light-bg px-1 rounded">prototypes/</code> 创建项目骨架，并<strong class="text-primary">自动复制</strong>启动 Prompt 到剪贴板，随后在 Cursor 中粘贴即可。',
    mobile: '将创建移动端/PDA 项目骨架，并<strong class="text-primary">自动复制</strong>启动 Prompt；AI 会先 Read 本地 <code>CREATE.prompt.md</code> 再澄清需求。',
};
export function PromptFormStep({ platform, name, error, submitting = false, onNameChange, onSubmit, onCancel, }) {
    const slug = name.trim() ? slugify(name) : '';
    const slugConflict = slug ? slugExists(slug) : false;
    const previewLines = name.trim()
        ? getPromptLineCount({ name: name.trim(), slug: slugify(name) }, platform)
        : 0;
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: `inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold ${platform === 'mobile' ? 'bg-teal-50 text-teal-800' : 'bg-primary/5 text-primary'}`, children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]}` }), PLATFORM_LABELS[platform], "\u539F\u578B"] }), _jsx("p", { className: "text-sm text-text-secondary leading-relaxed", dangerouslySetInnerHTML: { __html: PLATFORM_HINTS[platform] } }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u540D\u79F0" }), _jsx("input", { className: "form-input", placeholder: platform === 'mobile' ? '如：入库任务 PDA' : '如：入库费规则', value: name, disabled: submitting, onChange: (e) => onNameChange(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !submitting && !slugConflict && name.trim()) {
                                void onSubmit();
                            }
                        } }), slug && (_jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u76EE\u5F55 slug\uFF1A", _jsx("code", { className: "bg-light-bg px-1 rounded", children: slug })] })), slugConflict && (_jsxs("p", { className: "text-xs text-orange-700 mt-1 flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-triangle" }), "\u8BE5 slug \u5DF2\u88AB\u5360\u7528\uFF0C\u8BF7\u4FEE\u6539\u9879\u76EE\u540D\u79F0\u540E\u518D\u521B\u5EFA"] }))] }), previewLines > 0 && (_jsxs("p", { className: "text-xs text-text-muted", children: ["\u542F\u52A8 Prompt \u7EA6 ", previewLines, " \u884C \u00B7 \u5B8C\u6574\u89C4\u5219\u89C1 CREATE.prompt.md"] })), error && (_jsxs("p", { className: "text-sm text-danger flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle" }), error] })), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: submitting, children: "\u53D6\u6D88" }), _jsx(Button, { icon: `fas ${submitting ? 'fa-spinner fa-spin' : 'fa-plus'}`, disabled: submitting || slugConflict || !name.trim(), onClick: () => void onSubmit(), children: submitting ? '创建中…' : '创建项目' })] })] }));
}
