import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@prototype/ui';
import { getPromptLineCount } from '../lib/prompt';
import { PLATFORM_ICONS, PLATFORM_LABELS } from '../lib/projectPlatform';
import { sanitizeProjectFolder } from '../lib/utils';
import { FaIcon } from '@prototype/ui/Icon';
const PLATFORM_HINTS = {
    pc: '填写项目名称即可，<strong class="text-primary">目录与项目 ID 将自动生成</strong>，并复制启动 Prompt 到剪贴板。',
    mobile: '填写项目名称即可，目录与项目 ID 自动生成（移动端/PDA 骨架）。',
};
export function PromptFormStep({ platform, name, error, submitting = false, onNameChange, onSubmit, onCancel, }) {
    const trimmed = name.trim();
    const folderPreview = trimmed ? sanitizeProjectFolder(trimmed) : '';
    const canSubmit = Boolean(trimmed) && !/[/\\:*?"<>|]/.test(trimmed);
    const previewLines = canSubmit
        ? getPromptLineCount({ name: trimmed, slug: folderPreview }, platform)
        : 0;
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: `inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold ${platform === 'mobile' ? 'bg-teal-50 text-teal-800' : 'bg-primary/5 text-primary'}`, children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]}` }), PLATFORM_LABELS[platform], "\u539F\u578B"] }), _jsx("p", { className: "text-sm text-text-secondary leading-relaxed", dangerouslySetInnerHTML: { __html: PLATFORM_HINTS[platform] } }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "*\u9879\u76EE\u540D\u79F0" }), _jsx("input", { className: "form-input", placeholder: platform === 'mobile' ? '如：SKU 信息填充 PDA' : '如：订单管理', value: name, disabled: submitting, onChange: (e) => onNameChange(e.target.value), onKeyDown: (e) => {
                            if (e.key === 'Enter' && !submitting && canSubmit) {
                                void onSubmit();
                            }
                        } }), folderPreview && (_jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u9884\u8BA1\u76EE\u5F55\uFF1A", _jsxs("code", { className: "bg-light-bg px-1 rounded", children: ["prototypes/", folderPreview, "/v1/"] }), _jsx("span", { className: "mx-1", children: "\u00B7" }), "\u91CD\u540D\u65F6\u81EA\u52A8\u52A0\u540E\u7F00"] }))] }), previewLines > 0 && (_jsxs("p", { className: "text-xs text-text-muted", children: ["\u542F\u52A8 Prompt \u7EA6 ", previewLines, " \u884C \u00B7 \u5B8C\u6574\u89C4\u5219\u89C1 CREATE.prompt.md"] })), error && (_jsxs("p", { className: "text-sm text-danger flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle" }), error] })), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onCancel, disabled: submitting, children: "\u53D6\u6D88" }), _jsx(Button, { icon: `fas ${submitting ? 'fa-spinner fa-spin' : 'fa-plus'}`, disabled: submitting || !canSubmit, onClick: () => void onSubmit(), children: submitting ? '创建中…' : '创建项目' })] })] }));
}
