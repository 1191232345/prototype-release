import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { reviewTarget } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
import { countFeeSectionConfigured, shortFeeSectionLabel, } from './ruleConfigFormUtils';
export function FeeCategoryTypeSidebar({ sections, activeIndex, rows, onSelect, }) {
    return (_jsxs("aside", { className: "lg:w-52 xl:w-56 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border-light bg-light-bg/40 overflow-hidden max-h-[40vh] lg:max-h-none", ...reviewTarget('form.fee.nav', '费用导航'), children: [_jsx("div", { className: "shrink-0 px-3 py-2.5 border-b border-border-light bg-white", children: _jsx("p", { className: "text-xs font-semibold text-text-secondary", children: "\u8D39\u7528\u7C7B\u578B" }) }), _jsx("nav", { className: "flex-1 overflow-y-auto p-2 space-y-1 lg:block flex gap-1 overflow-x-auto lg:overflow-x-visible lg:flex-col", role: "tablist", "aria-label": "\u8D39\u7528\u7C7B\u578B", children: sections.map((section, index) => {
                    const configured = countFeeSectionConfigured(rows, section);
                    const badge = section.tabs
                        ? `${configured}项`
                        : configured > 0
                            ? '已配'
                            : '未配';
                    const active = index === activeIndex;
                    return (_jsx("button", { type: "button", role: "tab", "aria-selected": active, className: `shrink-0 lg:shrink lg:w-full text-left rounded-lg px-3 py-2.5 transition-colors border ${active
                            ? 'border-accent bg-accent/10 shadow-sm'
                            : 'border-transparent hover:bg-hover'}`, onClick: () => onSelect(index), ...reviewTarget(`form.fee.category.${index}`, shortFeeSectionLabel(section.title)), children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("span", { className: `inline-flex items-center gap-2 text-sm font-medium ${active ? 'text-primary' : 'text-dark'}`, children: [section.icon && (_jsx(FaIcon, { className: `${section.icon} text-xs opacity-70` })), shortFeeSectionLabel(section.title)] }), _jsx("span", { className: `shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${configured > 0
                                        ? 'bg-success/15 text-success'
                                        : 'bg-gray-100 text-text-muted'}`, children: badge })] }) }, section.title));
                }) })] }));
}
