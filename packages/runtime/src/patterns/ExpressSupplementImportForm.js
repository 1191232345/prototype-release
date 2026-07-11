import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, PageShell } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { reviewTarget } from '@prototype/review';
import { ImportSupplementContent } from './ImportSupplementContent';
export function ExpressSupplementImportFormPattern({ spec }) {
    const flow = useFlowNav();
    const tableSpec = spec.customerPriceCardTable;
    const goList = () => flow?.navigate('list');
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [_jsx("div", { className: "mb-4", children: _jsx(Button, { variant: "secondary", icon: "fas fa-arrow-left", onClick: goList, ...reviewTarget('form.back'), children: "\u8FD4\u56DE\u5217\u8868" }) }), _jsx("h2", { className: "text-lg font-semibold text-primary mb-2", children: spec.title ?? '导入承运商数据' }), _jsx(ImportSupplementContent, { tableSpec: tableSpec, onCancel: goList, onComplete: () => goList() })] }));
}
