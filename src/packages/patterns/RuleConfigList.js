import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, PageShell, PrototypeModal } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { resolveStatusLabels } from '@prototype/renderer/resolveStatusLabels';
import { DetailContent } from './DetailContent';
import { ImportSupplementContent } from './ImportSupplementContent';
import { ListFilters } from './ListFilters';
import { ListTable } from './ListTable';
import { TreeListTable } from './TreeListTable';
import { Toast } from '../../app/Toast';
import { reviewTarget } from '../../lib/reviewLink';
import { RulePublishPreviewModal, resolvePublishPreview, } from './RulePublishPreview';
import { cellPrimary, periodStart, getBatchScope, getConfirmableRows } from './ruleConfigListUtils';
import { findTableRowById, flattenTableRows } from '../../lib/tableRowUtils';
import { RuleConfigListBatchModals } from './RuleConfigListBatchModals';
export function RuleConfigListPattern({ spec }) {
    const flow = useFlowNav();
    const [showImportModal, setShowImportModal] = useState(false);
    const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
    const [showBatchConfirmConfirm, setShowBatchConfirmConfirm] = useState(false);
    const [viewRowId, setViewRowId] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [toastMessage, setToastMessage] = useState(null);
    const [publishRowId, setPublishRowId] = useState(null);
    const activeDetail = viewRowId && spec.details?.[viewRowId];
    const selectable = spec.table?.selectable ?? false;
    const statusLabels = resolveStatusLabels(spec.filters, spec.statusLabels);
    const goForm = (editId) => {
        if (flow)
            flow.navigate('form', editId ? { editId } : undefined);
    };
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };
    const handleDelete = (rowId) => {
        showToast(`已删除记录 ${rowId}`);
    };
    const handleCopy = (rowId) => {
        goForm();
        showToast(`正在基于 ${rowId} 创建新草稿`);
    };
    const handleVoid = (rowId) => {
        showToast(`已作废规则 ${rowId}`);
    };
    const rows = spec.table?.rows ?? [];
    const leafRows = flattenTableRows(rows);
    const isTree = spec.table?.tree ?? false;
    const handlePublishClick = (rowId) => {
        setPublishRowId(rowId);
    };
    const publishRow = publishRowId ? findTableRowById(rows, publishRowId) : undefined;
    const publishContext = publishRow
        ? {
            rowId: publishRow.id,
            rowName: cellPrimary(publishRow.cells.name),
            customer: cellPrimary(publishRow.cells.customer),
            startTime: periodStart(publishRow.cells.period),
        }
        : {};
    const publishPreview = resolvePublishPreview(publishContext, spec.publishMeta);
    const handlePublishConfirm = () => {
        if (publishRowId) {
            const tip = publishPreview.truncations.length
                ? `已发布规则 ${publishRowId}，已截断 ${publishPreview.truncations.length} 条重叠规则并冻结快照`
                : `已发布规则 ${publishRowId}，并已冻结规则快照`;
            showToast(tip);
        }
        setPublishRowId(null);
    };
    const batchScope = getBatchScope(leafRows.length ? leafRows : rows, selectedIds);
    const confirmableInScope = getConfirmableRows(leafRows.length ? leafRows : rows, selectedIds);
    const handleBatchDelete = () => {
        setShowBatchDeleteConfirm(false);
        setSelectedIds(new Set());
        showToast(batchScope.isFull
            ? `已全量删除 ${batchScope.count} 条记录`
            : `已批量删除 ${batchScope.count} 条记录`);
    };
    const handleBatchConfirm = () => {
        setShowBatchConfirmConfirm(false);
        setSelectedIds(new Set());
        showToast(`已批量确认 ${confirmableInScope.length} 条记录`);
    };
    const handleMainButton = (btn) => {
        if (btn.action === 'openImportModal')
            setShowImportModal(true);
        if (btn.action === 'batchDelete')
            setShowBatchDeleteConfirm(true);
        if (btn.action === 'batchConfirm')
            setShowBatchConfirmConfirm(true);
        if (btn.action === 'navigateForm')
            goForm();
    };
    const batchActionCountLabel = (action) => {
        if (action !== 'batchDelete' && action !== 'batchConfirm')
            return '';
        if (selectedIds.size > 0)
            return ` (${selectedIds.size})`;
        if (rows.length > 0)
            return ' ';
        return '';
    };
    const isBatchActionDisabled = (action) => (action === 'batchDelete' || action === 'batchConfirm') &&
        (leafRows.length || rows.length) === 0;
    const renderToolbar = () => {
        if (spec.mainButtons?.length) {
            return (_jsx("div", { className: "mb-6 flex flex-wrap gap-3", children: spec.mainButtons.map((btn) => (_jsxs(Button, { variant: btn.variant ?? 'primary', icon: btn.icon, disabled: isBatchActionDisabled(btn.action), onClick: () => handleMainButton(btn), ...reviewTarget(`list.btn.${btn.id}`, btn.label), children: [btn.label, batchActionCountLabel(btn.action)] }, btn.id))) }));
        }
        return (_jsx("div", { className: "mb-6", children: _jsx(Button, { icon: "fas fa-plus", onClick: () => goForm(), ...reviewTarget('list.btn.add'), children: "\u65B0\u589E" }) }));
    };
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [spec.filters && _jsx(ListFilters, { filters: spec.filters }), renderToolbar(), spec.table &&
                (isTree ? (_jsx(TreeListTable, { columns: spec.table.columns, rows: spec.table.rows, defaultExpand: spec.table.defaultExpand, statusLabels: statusLabels, selectable: selectable, selectedIds: selectedIds, onSelectionChange: (ids) => setSelectedIds(new Set(ids)), onView: (id) => setViewRowId(id), onEdit: (id) => goForm(id), onDelete: handleDelete, onCopy: handleCopy, onPublish: handlePublishClick, onVoid: handleVoid })) : (_jsx(ListTable, { columns: spec.table.columns, rows: spec.table.rows, statusLabels: statusLabels, selectable: selectable, selectedIds: selectedIds, onSelectionChange: (ids) => setSelectedIds(new Set(ids)), onView: (id) => setViewRowId(id), onEdit: (id) => goForm(id), onDelete: handleDelete, onCopy: handleCopy, onPublish: handlePublishClick, onVoid: handleVoid }))), showImportModal && spec.importModal?.customerPriceCardTable && (_jsx(PrototypeModal, { title: spec.importModal.title, onClose: () => setShowImportModal(false), size: "xl", children: _jsx(ImportSupplementContent, { tableSpec: spec.importModal.customerPriceCardTable, asyncThreshold: spec.importModal.asyncThreshold, filePresets: spec.importModal.filePresets, onCancel: () => setShowImportModal(false), onComplete: (mode) => {
                        setShowImportModal(false);
                        showToast(mode === 'async'
                            ? '已添加到异步任务，请稍后在任务中心查看'
                            : '差价计算完成，已生成补收记录');
                    } }) })), _jsx(RuleConfigListBatchModals, { showBatchConfirm: showBatchConfirmConfirm, showBatchDelete: showBatchDeleteConfirm, batchScope: batchScope, confirmableCount: confirmableInScope.length, onCloseConfirm: () => setShowBatchConfirmConfirm(false), onCloseDelete: () => setShowBatchDeleteConfirm(false), onBatchConfirm: handleBatchConfirm, onBatchDelete: handleBatchDelete }), activeDetail && (_jsx(PrototypeModal, { title: activeDetail.title ?? '规则配置详情', onClose: () => setViewRowId(null), size: "xl", children: _jsx(DetailContent, { detail: activeDetail, statusLabels: statusLabels }) })), toastMessage && _jsx(Toast, { message: toastMessage }), publishRowId && (_jsx(RulePublishPreviewModal, { open: true, context: publishContext, preview: publishPreview, onClose: () => setPublishRowId(null), onConfirm: handlePublishConfirm }))] }));
}
