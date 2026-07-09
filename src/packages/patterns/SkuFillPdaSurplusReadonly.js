import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function SurplusReadonlySections({ sections, reviewPrefix, }) {
    return (_jsx(_Fragment, { children: sections.map((section) => (_jsx(ReadonlyGridSection, { section: section, reviewPrefix: reviewPrefix }, section.title))) }));
}
function ReadonlyGridSection({ section, reviewPrefix, }) {
    if (section.layout !== 'grid' || !section.items?.length)
        return null;
    const visibleItems = section.items.filter((item) => item.label !== 'RFID 清单' && item.label !== '驳回原因');
    return (_jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", ...reviewTarget(`${reviewPrefix}.detail.${section.title}`, section.title), children: [_jsxs("h2", { className: "text-sm font-semibold text-primary mb-2 flex items-center gap-1.5", children: [_jsx(FaIcon, { className: `fas ${section.icon} text-accent text-xs` }), section.title] }), _jsx("dl", { className: "space-y-2", children: visibleItems.map((item) => (_jsxs("div", { ...reviewTarget(`${reviewPrefix}.field.${item.label}`, item.label), children: [_jsx("dt", { className: "text-[11px] text-text-muted mb-0.5", children: item.label }), _jsx("dd", { className: "text-xs text-text-secondary whitespace-pre-wrap leading-relaxed", children: item.value })] }, item.label))) })] }));
}
