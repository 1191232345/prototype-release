import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageShell } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { SkuFillWorkOrderForm } from './SkuFillWorkOrderForm';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function SkuFillFormPattern({ spec }) {
    const flow = useFlowNav();
    const editId = flow?.params?.editId;
    const goList = () => flow?.navigate('list');
    return (_jsx(PageShell, { brand: spec.header?.brand, children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("button", { type: "button", className: "text-sm text-accent hover:underline mb-2", onClick: goList, ...reviewTarget('form.back', '返回列表'), children: [_jsx(FaIcon, { className: "fas fa-arrow-left mr-1" }), " \u8FD4\u56DE\u5217\u8868"] }), _jsx("h2", { className: "text-xl font-semibold text-primary", children: editId ? '编辑工单' : '新建工单' }), _jsx("div", { className: "bg-white rounded-lg shadow-card p-6", children: _jsx(SkuFillWorkOrderForm, { sections: spec.sections, skuOptions: spec.skuOptions, editData: spec.editData, formActions: spec.formActions, editId: editId, onCancel: goList, onSubmit: goList }) })] }) }));
}
