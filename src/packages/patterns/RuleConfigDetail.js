import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PageShell, PrototypeModal } from '@prototype/ui';
import { DetailContent } from './DetailContent';
import { FaIcon } from '@prototype/ui/Icon';
export function RuleConfigDetailPattern({ spec }) {
    const [open, setOpen] = useState(true);
    const detail = spec.detail;
    if (!detail) {
        return (_jsx(PageShell, { brand: spec.header?.brand, children: _jsx("p", { className: "text-danger text-sm p-4", children: "Spec \u7F3A\u5C11 detail \u5B57\u6BB5" }) }));
    }
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [_jsxs("div", { className: "bg-white rounded-lg shadow-card p-8 text-center", children: [_jsx(FaIcon, { className: "fas fa-eye text-3xl text-primary mb-3" }), _jsx("p", { className: "text-text-secondary mb-4", children: "\u89C4\u5219\u914D\u7F6E\u8BE6\u60C5\u5F39\u7A97\u9884\u89C8" }), _jsxs("button", { type: "button", className: "btn btn-primary", onClick: () => setOpen(true), children: [_jsx(FaIcon, { className: "fas fa-external-link-alt mr-2" }), "\u6253\u5F00\u8BE6\u60C5\u5F39\u7A97"] })] }), open && (_jsx(PrototypeModal, { title: detail.title ?? '规则配置详情', onClose: () => setOpen(false), size: "xl", children: _jsx(DetailContent, { detail: detail }) }))] }));
}
