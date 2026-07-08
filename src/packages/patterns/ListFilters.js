import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { MultiSelectDropdown } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function ListFilters({ filters, onFilter, variant = 'page' }) {
    const [filterValues, setFilterValues] = useState({});
    const handleChange = (id, value) => {
        setFilterValues((prev) => ({ ...prev, [id]: value }));
    };
    const embedded = variant === 'embedded';
    const wrapperCls = embedded
        ? 'shrink-0 px-4 py-3 border-b border-border-light bg-white'
        : 'bg-white rounded-lg shadow-card p-4 sm:p-6 mb-4 sm:mb-6';
    const titleCls = embedded
        ? 'text-sm font-semibold text-primary mb-2'
        : 'text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4';
    const gridCls = embedded
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3'
        : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4';
    return (_jsxs("div", { className: wrapperCls, ...(embedded ? reviewTarget('list.rules.filters', '规则列表检索') : {}), children: [_jsxs("h3", { className: titleCls, children: [_jsx(FaIcon, { className: "fas fa-filter mr-2 text-accent" }), embedded ? '检索条件' : '筛选条件'] }), _jsx("div", { className: gridCls, children: filters.map((f) => (_jsxs("div", { ...reviewTarget(`list.filter.${f.id}`, f.label), children: [_jsx("label", { className: "form-label", children: f.label }), f.type === 'select' ? (_jsxs("select", { className: "form-input", value: filterValues[f.id] ?? '', onChange: (e) => handleChange(f.id, e.target.value), children: [_jsx("option", { value: "", children: "\u5168\u90E8" }), f.options?.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] })) : f.type === 'multiSelect' ? (_jsx(MultiSelectDropdown, { options: f.options ?? [], value: filterValues[f.id] ?? '', placeholder: "\u5168\u90E8\u4ED3\u5E93", onChange: (v) => handleChange(f.id, v) })) : f.type === 'datetime' ? (_jsx("input", { className: "form-input", type: "datetime-local", placeholder: f.placeholder })) : (_jsx("input", { className: "form-input", placeholder: f.placeholder }))] }, f.id))) }), _jsxs("div", { className: `${embedded ? 'mt-2' : 'mt-3 sm:mt-4'} flex flex-col-reverse sm:flex-row justify-end gap-2`, children: [_jsxs("button", { className: "btn btn-secondary w-full sm:w-auto", type: "button", onClick: () => setFilterValues({}), ...reviewTarget('list.filter.reset'), children: [_jsx(FaIcon, { className: "fas fa-redo mr-1" }), "\u91CD\u7F6E"] }), _jsxs("button", { className: "btn btn-secondary w-full sm:w-auto", type: "button", onClick: onFilter, ...reviewTarget('list.filter.search'), children: [_jsx(FaIcon, { className: "fas fa-search mr-2" }), "\u67E5\u8BE2"] })] })] }));
}
