import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, PageShell, PrototypeModal, Toast, useToast } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { ListFilters } from './ListFilters';
import { SkuFillImportContent } from './SkuFillImportContent';
import { SkuFillListTable } from './SkuFillListTable';
import { SkuFillWorkOrderForm } from './SkuFillWorkOrderForm';
import { reviewTarget } from '@prototype/review';
function modalSize(width) {
    if (width === 'large')
        return 'xl';
    if (width === 'small')
        return 'md';
    return 'lg';
}
export function SkuFillListPattern({ spec }) {
    const flow = useFlowNav();
    const { table } = spec;
    const rows = table.rows;
    const formModalSpec = spec.modals?.find((m) => m.id === 'formModal');
    const [formEditId, setFormEditId] = useState();
    const [showFormModal, setShowFormModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const { toastMessage, showToast } = useToast(2200);
    const goDetail = (rowId) => {
        flow?.navigate('detail', { rowId });
    };
    const goAudit = (rowId) => {
        flow?.navigate('audit', { rowId });
    };
    const openFormModal = (editId) => {
        setFormEditId(editId);
        setShowFormModal(true);
    };
    const closeFormModal = () => {
        setShowFormModal(false);
        setFormEditId(undefined);
    };
    const handleExport = () => {
        showToast(`已导出 ${rows.length} 条工单（含 SKU 尺寸/重量/图片），文件已开始下载`);
    };
    const handleMainButton = (btn) => {
        if (btn.action === 'openImportModal')
            setShowImportModal(true);
        if (btn.action === 'exportList')
            handleExport();
        if (btn.action === 'openModal' || btn.action === 'navigateForm') {
            openFormModal();
        }
    };
    const renderToolbar = () => {
        if (spec.mainButtons?.length) {
            return (_jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: spec.mainButtons.map((btn) => (_jsx(Button, { variant: btn.variant ?? 'primary', icon: btn.icon, onClick: () => handleMainButton(btn), ...reviewTarget(`list.btn.${btn.id}`, btn.label), children: btn.label }, btn.id))) }));
        }
        return (_jsx("div", { className: "mb-4", children: _jsx(Button, { variant: "primary", icon: "fas fa-plus", onClick: () => openFormModal(), ...reviewTarget('list.btn.add', '新建工单'), children: "\u65B0\u5EFA\u5DE5\u5355" }) }));
    };
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [_jsxs("div", { className: "space-y-4", children: [_jsx(ListFilters, { filters: spec.filters ?? [] }), renderToolbar(), _jsx(SkuFillListTable, { columns: table.columns, rows: rows, onView: goDetail, onEdit: openFormModal, onReview: goAudit })] }), showFormModal && formModalSpec && (_jsx(PrototypeModal, { title: formEditId ? '编辑工单' : formModalSpec.title, onClose: closeFormModal, size: modalSize(formModalSpec.width), children: _jsx(SkuFillWorkOrderForm, { sections: formModalSpec.sections, skuOptions: formModalSpec.skuOptions, editData: formModalSpec.editData, formActions: formModalSpec.formActions, editId: formEditId, skuMaxRows: 1, onCancel: closeFormModal, onSubmit: closeFormModal }) })), showImportModal && spec.importModal?.workOrderImportPreview && (_jsx(PrototypeModal, { title: spec.importModal.title, onClose: () => setShowImportModal(false), size: "xl", children: _jsx(SkuFillImportContent, { preview: spec.importModal.workOrderImportPreview, asyncThreshold: spec.importModal.asyncThreshold, filePresets: spec.importModal.filePresets, onCancel: () => setShowImportModal(false), onComplete: () => setShowImportModal(false) }) })), toastMessage && _jsx(Toast, { message: toastMessage })] }));
}
