import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { PageShell, Toast, useToast } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { SkuFillAuditActions } from './SkuFillAuditActions';
import { SkuFillDetailContent } from './SkuFillDetailContent';
import { SkuFillOperationTimeline } from './SkuFillOperationTimeline';
import { reviewTarget } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
export function SkuFillDetailPagePattern({ spec }) {
    const flow = useFlowNav();
    const rowId = flow?.params?.rowId ?? '';
    const auditMode = spec.pageMode === 'audit';
    const entry = spec.details[rowId];
    const { toastMessage, showToast } = useToast(1500);
    const goList = () => flow?.navigate('list');
    const handleAuditDone = (message) => {
        showToast(message);
        setTimeout(() => goList(), 1500);
    };
    if (!entry) {
        return (_jsx(PageShell, { brand: spec.header?.brand, children: _jsxs("div", { className: "p-8 text-center text-text-secondary", children: [_jsxs("p", { children: ["\u672A\u627E\u5230\u5DE5\u5355\u6570\u636E\uFF08rowId: ", rowId || '—', "\uFF09"] }), _jsx("button", { type: "button", className: "text-accent mt-4", onClick: goList, children: "\u8FD4\u56DE\u5217\u8868" })] }) }));
    }
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("button", { type: "button", className: "text-sm text-accent hover:underline mb-4", onClick: goList, ...reviewTarget(auditMode ? 'audit.back' : 'detail.back', '返回列表'), children: [_jsx(FaIcon, { className: "fas fa-arrow-left mr-1" }), " \u8FD4\u56DE\u5217\u8868"] }), _jsx("h2", { className: "text-xl font-semibold text-primary mb-6", ...reviewTarget(auditMode ? 'audit.title' : 'detail.title', auditMode ? '工单审核' : '工单详情'), children: auditMode ? spec.title : (entry.title ?? spec.title) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-card p-6 min-w-0", ...reviewTarget(auditMode ? 'audit.content' : 'detail.content', '工单内容'), children: [_jsx(SkuFillDetailContent, { detail: entry, editable: auditMode, reviewPrefix: auditMode ? 'audit' : 'detail' }), auditMode && _jsx(SkuFillAuditActions, { onDone: handleAuditDone })] }), _jsx(SkuFillOperationTimeline, { entries: entry.timeline ?? [], reviewPrefix: auditMode ? 'audit' : 'detail' })] })] }), toastMessage && _jsx(Toast, { message: toastMessage })] }));
}
