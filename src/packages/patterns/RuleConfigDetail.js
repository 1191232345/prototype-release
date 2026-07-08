import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageShell } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { DetailContent } from './DetailContent';
import { RuleConfigDetailView } from './RuleConfigDetailView';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function RuleConfigDetailPattern({ spec }) {
    const flow = useFlowNav();
    const rowId = flow?.params.rowId ?? '';
    const editValues = rowId ? spec.editData?.[rowId] ?? spec.editData?.['pc-001'] : undefined;
    const detail = spec.detail;
    const useFormMirror = (spec.sections?.length ?? 0) > 0;
    const goList = () => flow?.navigate('list');
    if (!detail && !useFormMirror) {
        return (_jsx(PageShell, { brand: spec.header?.brand, children: _jsxs("div", { className: "p-8 text-center text-text-secondary", children: [_jsx("p", { children: "Spec \u7F3A\u5C11 detail \u5B57\u6BB5" }), _jsx("button", { type: "button", className: "text-accent mt-4", onClick: goList, children: "\u8FD4\u56DE\u5217\u8868" })] }) }));
    }
    const pageTitle = (editValues?.name ? `价卡详情 - ${editValues.name}` : undefined) ??
        detail?.title ??
        spec.title ??
        '规则配置详情';
    return (_jsx(PageShell, { brand: spec.header?.brand, children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("button", { type: "button", className: "text-sm text-accent hover:underline mb-4", onClick: goList, ...reviewTarget('detail.back', '返回列表'), children: [_jsx(FaIcon, { className: "fas fa-arrow-left mr-1" }), " \u8FD4\u56DE\u5217\u8868"] }), _jsx("h2", { className: "text-xl font-semibold text-primary mb-6", ...reviewTarget('detail.title', pageTitle), children: pageTitle }), _jsx("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", ...reviewTarget('detail.content', '详情内容'), children: useFormMirror ? (_jsx(RuleConfigDetailView, { spec: spec })) : (detail && _jsx(DetailContent, { detail: detail })) })] }) }));
}
