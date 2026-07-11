import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@prototype/ui';
import { reviewTarget } from '@prototype/review';
export function RuleConfigFeeEmptyPrompt({ templates, onApply, onManualConfig }) {
    const [templateId, setTemplateId] = useState('');
    const handleApply = () => {
        if (!templateId)
            return;
        const label = templates.find((t) => t.value === templateId)?.label ?? templateId;
        onApply(templateId, label);
        setTemplateId('');
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center text-center px-6 py-12 sm:py-16 border border-dashed border-border rounded-lg bg-light-bg/30", ...reviewTarget('form.fee.empty', '费用空状态'), children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4", children: _jsx("i", { className: "fas fa-coins text-accent text-lg", "aria-hidden": true }) }), _jsx("h4", { className: "text-base font-semibold text-primary mb-1", children: "\u5C1A\u672A\u914D\u7F6E\u8D39\u7528\u9879" }), _jsx("p", { className: "text-sm text-text-secondary max-w-md mb-6", children: "\u5EFA\u8BAE\u4ECE\u4EF7\u5361\u6A21\u677F\u5FEB\u901F\u5E26\u5165\u9ED8\u8BA4\u8D39\u7528\u9879\uFF0C\u518D\u6309\u9700\u5FAE\u8C03\u6298\u6263\u4E0E\u5907\u6CE8\u3002" }), _jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-md", children: [_jsxs("select", { className: "form-input text-sm flex-1", value: templateId, onChange: (e) => setTemplateId(e.target.value), ...reviewTarget('form.import.template', '价卡模板'), children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9\u4EF7\u5361\u6A21\u677F\u2026" }), templates.map((t) => (_jsx("option", { value: t.value, children: t.label }, t.value)))] }), _jsx(Button, { variant: "primary", icon: "fas fa-file-import", disabled: !templateId, onClick: handleApply, ...reviewTarget('form.fill.apply', '从价卡模板带入'), children: "\u4ECE\u4EF7\u5361\u6A21\u677F\u5E26\u5165" })] }), _jsx("button", { type: "button", className: "mt-4 text-sm text-accent hover:underline", onClick: onManualConfig, ...reviewTarget('form.fee.manual', '手动配置'), children: "\u8DF3\u8FC7\uFF0C\u624B\u52A8\u6DFB\u52A0\u8D39\u7528\u9879" })] }));
}
