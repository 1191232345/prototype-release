import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { FaIcon } from '@prototype/ui/Icon';
function parseValue(value) {
    return value.split(',').map((v) => v.trim()).filter(Boolean);
}
export function MultiSelectDropdown({ options, value, onChange, placeholder = '请选择', className = '', disabled = false, }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const selected = parseValue(value);
    useEffect(() => {
        const onDocClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);
    const toggle = (optValue) => {
        const set = new Set(selected);
        if (set.has(optValue))
            set.delete(optValue);
        else
            set.add(optValue);
        onChange(Array.from(set).join(','));
    };
    const displayText = selected.length === 0
        ? placeholder
        : selected
            .map((v) => options.find((o) => o.value === v)?.label ?? v)
            .join('、');
    return (_jsxs("div", { className: `relative ${className}`, ref: rootRef, children: [_jsxs("button", { type: "button", disabled: disabled, className: `form-input w-full text-left flex items-center justify-between gap-2 ${disabled ? 'bg-light-bg cursor-not-allowed opacity-70' : ''}`, onClick: () => !disabled && setOpen((o) => !o), "aria-haspopup": "listbox", "aria-expanded": open, children: [_jsx("span", { className: `truncate ${selected.length === 0 ? 'text-text-muted' : ''}`, children: displayText }), _jsxs("span", { className: "flex items-center gap-1 shrink-0 text-text-muted", children: [selected.length > 0 && (_jsx("span", { className: "text-xs bg-accent/15 text-accent px-1.5 py-0.5 rounded-full font-medium", children: selected.length })), _jsx(FaIcon, { className: `fas fa-chevron-down text-xs transition-transform ${open ? 'rotate-180' : ''}` })] })] }), open && !disabled && (_jsx("div", { className: "absolute z-30 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-border rounded-lg shadow-card", role: "listbox", children: options.length === 0 ? (_jsx("div", { className: "px-3 py-2 text-sm text-text-muted", children: "\u6682\u65E0\u9009\u9879" })) : (options.map((o) => {
                    const checked = selected.includes(o.value);
                    return (_jsxs("label", { className: `flex items-center gap-2 px-3 py-2 cursor-pointer text-sm hover:bg-hover ${checked ? 'bg-accent/5' : ''}`, children: [_jsx("input", { type: "checkbox", checked: checked, onChange: () => toggle(o.value), className: "accent-accent rounded" }), _jsx("span", { className: checked ? 'font-medium text-dark' : 'text-text-secondary', children: o.label })] }, o.value));
                })) }))] }));
}
