import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaIcon } from '@prototype/ui/Icon';
export function SchemaErrorStrip({ item }) {
    const errors = [...item.specErrors, ...item.metaErrors];
    const [expanded, setExpanded] = useState(false);
    if (!errors.length)
        return null;
    return (_jsxs("div", { className: "shrink-0 border-b border-red-200 bg-red-50", children: [_jsxs("button", { type: "button", onClick: () => setExpanded((v) => !v), className: "w-full px-4 py-2 text-xs text-red-700 flex items-center gap-2 hover:bg-red-100/50 transition-colors", children: [_jsx(FaIcon, { className: "fas fa-exclamation-triangle shrink-0" }), _jsxs("span", { className: "flex-1 text-left font-medium", children: ["Schema \u6821\u9A8C ", errors.length, " \u9879\u9519\u8BEF"] }), _jsx(FaIcon, { className: `fas fa-chevron-${expanded ? 'up' : 'down'} text-[10px] opacity-60` })] }), expanded && (_jsx("ul", { className: "px-4 pb-3 space-y-1", children: errors.map((e, i) => (_jsxs("li", { className: "text-[11px] text-red-600 flex gap-2", children: [_jsx("code", { className: "font-mono bg-red-100/60 px-1.5 py-0.5 rounded shrink-0", children: e.path }), _jsx("span", { children: e.message })] }, i))) }))] }));
}
