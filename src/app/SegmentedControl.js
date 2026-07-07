import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaIcon } from '@prototype/ui/Icon';
export function SegmentedControl({ value, options, onChange, size = 'md', }) {
    const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
    return (_jsx("div", { className: "inline-flex items-center gap-0.5 p-1 bg-surface rounded-lg border border-border-light", children: options.map((opt) => (_jsxs("button", { type: "button", onClick: () => onChange(opt.value), className: `${pad} rounded-md font-medium transition-all inline-flex items-center gap-1.5 ${value === opt.value
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-muted hover:text-dark'}`, children: [opt.icon && _jsx(FaIcon, { className: `fas ${opt.icon} text-[10px] opacity-60` }), opt.label] }, opt.value))) }));
}
