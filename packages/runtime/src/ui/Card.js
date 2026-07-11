import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePrototypeChrome } from '@prototype/runtime/contexts/PrototypeChromeContext';
import { FaIcon } from '@prototype/ui/Icon';
export function Card({ title, icon, children, className = '' }) {
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-card border border-border ${className}`, children: [title && (_jsx("div", { className: "px-4 sm:px-6 py-3 sm:py-4 border-b border-border-light", children: _jsxs("h3", { className: "text-base sm:text-lg font-semibold text-primary flex items-center", children: [icon && _jsx(FaIcon, { className: `${icon} mr-2 text-accent` }), title] }) })), _jsx("div", { className: "p-4 sm:p-6", children: children })] }));
}
export function PageShell({ brand = 'ELSA', children }) {
    const chrome = usePrototypeChrome();
    const showHeader = !chrome?.hidePageHeader;
    return (_jsxs("div", { className: "min-h-full min-w-0 max-w-full bg-surface overflow-x-hidden", children: [showHeader ? (_jsx("header", { className: "bg-primary text-white shadow-header sticky top-0 z-10", style: { borderBottom: '2px solid #E8A838' }, children: _jsx("div", { className: "px-3 sm:px-4 flex items-center h-12 sm:h-14", children: _jsx("span", { className: "text-base sm:text-lg font-semibold tracking-wide truncate", children: brand }) }) })) : null, _jsx("main", { className: "p-2 sm:p-4 min-w-0", children: children })] }));
}
