import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, PageShell, PrototypeModal, Toast, useToast } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { resolveStatusLabels } from '@prototype/renderer/resolveStatusLabels';
import { ImportSupplementContent } from './ImportSupplementContent';
import { ListFilters } from './ListFilters';
import { ListTable } from './ListTable';
import { TreeListTable } from './TreeListTable';
import { CustomerRuleMasterDetail } from './CustomerRuleMasterDetail';
import { reviewTarget } from '@prototype/review';
import { RulePublishPreviewModal, resolvePublishPreview, } from './RulePublishPreview';
import { cellPrimary, periodStart, getBatchScope, getConfirmableRows } from './ruleConfigListUtils';
import { findTableRowById, flattenTableRows } from '@prototype/runtime/utils/tableRowUtils';
import { RuleConfigListBatchModals } from './RuleConfigListBatchModals';
export function RuleConfigListPattern({ spec }) {
    const flow = useFlowNav();
    const [showImportModal, setShowImportModal] = useState(false);
    const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
    const [showBatchConfirmConfirm, setShowBatchConfirmConfirm] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const { toastMessage, showToast } = useToast(3000);
    const [publishRowId, setPublishRowId] = useState(null);
    const { table } = spec;
    const feeTypeTabs = table.feeTypeTabs ?? [];
    const [activeFeeType, setActiveFeeType] = useState(() => feeTypeTabs[0]?.value ?? '');
    const selectable = table.selectable ?? false;
    const statusLabels = resolveStatusLabels(spec.filters, spec.statusLabels);
    const goForm = (editId, extra) => {
        if (flow)
            flow.navigate('form', editId ? { editId, ...extra } : extra);
    };
    const goDetail = (rowId) => {
        if (flow)
            flow.navigate('detail', { rowId });
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
    const rows = table.rows;
    const leafRows = flattenTableRows(rows);
    const isTree = table.tree ?? false;
    const isMasterDetail = table.masterDetail ?? false;
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
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [isMasterDetail && feeTypeTabs.length > 0 && (_jsxs("div", { className: "mb-4 bg-white rounded-lg shadow-card border border-border overflow-hidden", ...reviewTarget('list.fee-type.tabs', '费用类型 Tab'), children: [_jsx("div", { className: "flex flex-wrap gap-1 px-4 pt-3 border-b border-border-light", children: feeTypeTabs.map((tab) => {
                            const active = tab.value === activeFeeType;
                            return (_jsx("button", { type: "button", className: `px-3 py-2 text-sm rounded-t-md border-b-2 transition-colors ${active
                                    ? 'border-accent text-primary font-medium bg-accent/5'
                                    : 'border-transparent text-text-muted hover:text-primary hover:bg-hover'}`, onClick: () => setActiveFeeType(tab.value), ...reviewTarget(`list.fee-type.tab.${tab.value}`, tab.label), children: tab.label }, tab.value));
                        }) }), spec.filters && _jsx(ListFilters, { filters: spec.filters, variant: "embedded" })] })), spec.filters && !isMasterDetail && _jsx(ListFilters, { filters: spec.filters }), !isMasterDetail && renderToolbar(), isMasterDetail && isTree ? (_jsx(CustomerRuleMasterDetail, { activeFeeType: activeFeeType, feeTypeTabs: feeTypeTabs, columns: table.columns, rows: table.rows, onAdd: ({ feeType, customerCode }) => goForm(undefined, { feeType, ...(customerCode ? { customer: customerCode } : {}) }), statusLabels: statusLabels, selectable: selectable, selectedIds: selectedIds, onSelectionChange: (ids) => setSelectedIds(new Set(ids)), onView: (id) => goDetail(id), onEdit: (id) => goForm(id), onDelete: handleDelete, onCopy: handleCopy, onPublish: handlePublishClick, onVoid: handleVoid })) : isTree ? (_jsx(TreeListTable, { columns: table.columns, rows: table.rows, defaultExpand: table.defaultExpand, statusLabels: statusLabels, selectable: selectable, selectedIds: selectedIds, onSelectionChange: (ids) => setSelectedIds(new Set(ids)), onView: (id) => goDetail(id), onEdit: (id) => goForm(id), onDelete: handleDelete, onCopy: handleCopy, onPublish: handlePublishClick, onVoid: handleVoid })) : (_jsx(ListTable, { columns: table.columns, rows: table.rows, statusLabels: statusLabels, selectable: selectable, selectedIds: selectedIds, onSelectionChange: (ids) => setSelectedIds(new Set(ids)), onView: (id) => goDetail(id), onEdit: (id) => goForm(id), onDelete: handleDelete, onCopy: handleCopy, onPublish: handlePublishClick, onVoid: handleVoid })), showImportModal && spec.importModal?.customerPriceCardTable && (_jsx(PrototypeModal, { title: spec.importModal.title, onClose: () => setShowImportModal(false), size: "xl", children: _jsx(ImportSupplementContent, { tableSpec: spec.importModal.customerPriceCardTable, asyncThreshold: spec.importModal.asyncThreshold, filePresets: spec.importModal.filePresets, onCancel: () => setShowImportModal(false), onComplete: (mode) => {
                        setShowImportModal(false);
                        showToast(mode === 'async'
                            ? '已添加到异步任务，请稍后在任务中心查看'
                            : '差价计算完成，已生成补收记录');
                    } }) })), _jsx(RuleConfigListBatchModals, { showBatchConfirm: showBatchConfirmConfirm, showBatchDelete: showBatchDeleteConfirm, batchScope: batchScope, confirmableCount: confirmableInScope.length, onCloseConfirm: () => setShowBatchConfirmConfirm(false), onCloseDelete: () => setShowBatchDeleteConfirm(false), onBatchConfirm: handleBatchConfirm, onBatchDelete: handleBatchDelete }), toastMessage && _jsx(Toast, { message: toastMessage }), publishRowId && (_jsx(RulePublishPreviewModal, { open: true, context: publishContext, preview: publishPreview, onClose: () => setPublishRowId(null), onConfirm: handlePublishConfirm }))] }));
}
