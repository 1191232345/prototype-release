import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { usePrototypeChrome } from '../../lib/PrototypeChromeContext';
import { FaIcon } from '@prototype/ui/Icon';
export function Card({ title, icon, children, className = '' }) {
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-card border border-border ${className}`, children: [title && (_jsx("div", { className: "px-4 sm:px-6 py-3 sm:py-4 border-b border-border-light", children: _jsxs("h3", { className: "text-base sm:text-lg font-semibold text-primary flex items-center", children: [icon && _jsx(FaIcon, { className: `${icon} mr-2 text-accent` }), title] }) })), _jsx("div", { className: "p-4 sm:p-6", children: children })] }));
}
export function CardWithTabs({ title, icon, tabs, defaultActiveTab = 0, className = '' }) {
    const [activeTab, setActiveTab] = useState(defaultActiveTab);
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-card border border-border ${className}`, children: [title && (_jsx("div", { className: "px-4 sm:px-6 py-3 sm:py-4 border-b border-border-light", children: _jsxs("h3", { className: "text-base sm:text-lg font-semibold text-primary flex items-center", children: [icon && _jsx(FaIcon, { className: `${icon} mr-2 text-accent` }), title] }) })), _jsx("div", { className: "border-b border-border-light", children: _jsx("div", { className: "flex px-4 sm:px-6", children: tabs.map((tab, index) => (_jsxs("button", { className: `px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 ${activeTab === index
                            ? 'text-primary border-b-2 border-accent bg-light-bg'
                            : 'text-text-muted hover:text-primary hover:bg-light-bg'}`, onClick: () => setActiveTab(index), children: [tab.icon && _jsx(FaIcon, { className: `${tab.icon} mr-1` }), tab.label] }, index))) }) }), _jsx("div", { className: "p-4 sm:p-6", children: tabs[activeTab]?.content })] }));
}
export function PageShell({ brand = 'ELSA', children }) {
    const chrome = usePrototypeChrome();
    const showHeader = !chrome?.hidePageHeader;
    return (_jsxs("div", { className: "min-h-full min-w-0 max-w-full bg-surface overflow-x-hidden", children: [showHeader ? (_jsx("header", { className: "bg-primary text-white shadow-header sticky top-0 z-10", style: { borderBottom: '2px solid #E8A838' }, children: _jsx("div", { className: "px-3 sm:px-4 flex items-center h-12 sm:h-14", children: _jsx("span", { className: "text-base sm:text-lg font-semibold tracking-wide truncate", children: brand }) }) })) : null, _jsx("main", { className: "p-2 sm:p-4 min-w-0", children: children })] }));
}
