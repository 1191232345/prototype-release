import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Button, Card, PageShell, Toast, useToast } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { reviewTarget } from '@prototype/review';
import { RulePublishPreviewModal, resolvePublishPreview, } from './RulePublishPreview';
import { RuleConfigWarehouseSplit, FormFieldInput } from './RuleConfigWarehouseSplit';
import { FeeCategoryConfig } from './FeeCategoryConfig';
import { VisibleWhenConfigPanel } from './VisibleWhenConfigPanel';
import { buildDefaultSectionRows, buildSplitRuleName, cloneSectionRows, feeTypeTabLabel, getBasicSections, getConfiguredFeeTypes, getCustomerWarehouseIds, getWarehouseOptions, usesFeeCategoryNav, usesTabbedFeeCategoryLayout, usesVisibleWhenConfig, } from './ruleConfigFormUtils';
function parseSelectedWarehouses(raw, fallback) {
    if (!raw)
        return fallback;
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return ids.length ? ids : fallback;
}
export function RuleConfigFormPattern({ spec }) {
    const flow = useFlowNav();
    const isEdit = Boolean(flow?.params.editId);
    const editId = flow?.params.editId;
    const customerParam = !isEdit ? flow?.params.customer : undefined;
    const editValues = editId ? spec.editData?.[editId] : undefined;
    const defaultSectionRows = useMemo(() => buildDefaultSectionRows(spec), [spec]);
    const [feeRows, setFeeRows] = useState(() => cloneSectionRows(defaultSectionRows));
    const goList = () => flow?.navigate('list');
    const [showPublishPreview, setShowPublishPreview] = useState(false);
    const { toastMessage, showToast } = useToast(4000);
    const [fieldValues, setFieldValues] = useState(() => {
        const init = {};
        for (const section of spec.sections ?? []) {
            for (const field of section.fields ?? []) {
                if (field.id === 'warehouse' || field.id === 'priceCard')
                    continue;
                init[field.id] =
                    editValues?.[field.id] ??
                        (field.id === 'customer' ? customerParam : undefined) ??
                        field.defaultValue ??
                        '';
            }
        }
        return init;
    });
    const customerLabel = useMemo(() => {
        for (const section of spec.sections ?? []) {
            const f = section.fields?.find((field) => field.id === 'customer');
            const opt = f?.options?.find((o) => o.value === fieldValues.customer);
            if (opt)
                return opt.label.split(' ')[0] ?? opt.label;
        }
        return fieldValues.customer ?? '客户';
    }, [spec, fieldValues.customer]);
    const initialAuthIds = useMemo(() => {
        const customer = editValues?.customer ?? customerParam ?? '';
        return customer ? getCustomerWarehouseIds(spec, customer) : [];
    }, [spec, editValues, customerParam]);
    const [warehouseIds, setWarehouseIds] = useState(initialAuthIds);
    const [selectedWarehouseIds, setSelectedWarehouseIds] = useState(() => {
        const raw = editValues?.selectedWarehouses ?? editValues?.warehouse;
        return new Set(parseSelectedWarehouses(raw, initialAuthIds));
    });
    const [unifiedConfig, setUnifiedConfig] = useState(() => cloneSectionRows(defaultSectionRows));
    const [importedFrom, setImportedFrom] = useState(editValues?.importedFrom);
    const warehouseOptions = getWarehouseOptions(spec);
    const useWarehouseSplit = warehouseOptions.length > 0;
    const useFeeCategoryNav = !useWarehouseSplit && usesFeeCategoryNav(spec);
    const useVisibleWhenConfig = !useWarehouseSplit && !useFeeCategoryNav && usesVisibleWhenConfig(spec);
    const warehouseLabel = (id) => warehouseOptions.find((o) => o.value === id)?.label ?? id;
    const pageTitle = isEdit
        ? `编辑 · ${spec.title ?? '规则配置'}`
        : (spec.title ?? '创建规则配置');
    const handleUnifiedConfigChange = (key, rows) => {
        setUnifiedConfig((prev) => ({ ...prev, [key]: rows }));
    };
    const handleImportTemplate = (templateLabel) => {
        setUnifiedConfig(cloneSectionRows(defaultSectionRows));
        setImportedFrom(templateLabel);
    };
    useEffect(() => {
        if (!useWarehouseSplit || isEdit)
            return;
        const customerId = fieldValues.customer;
        if (!customerId) {
            setWarehouseIds([]);
            setSelectedWarehouseIds(new Set());
            return;
        }
        const ids = getCustomerWarehouseIds(spec, customerId);
        setWarehouseIds(ids);
        setSelectedWarehouseIds(new Set(ids));
    }, [fieldValues.customer, useWarehouseSplit, isEdit, spec]);
    const selectedLabels = [...selectedWarehouseIds].map(warehouseLabel).join('、');
    const publishContext = {
        customer: fieldValues.customer,
        warehouse: selectedLabels || '—',
        startTime: fieldValues.startTime,
        endTime: fieldValues.endTime,
        rowName: fieldValues.name,
    };
    const publishPreview = resolvePublishPreview(publishContext, spec.publishMeta);
    const handleFieldChange = (fieldId, value) => {
        setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
    };
    const handleFeeRowsChange = (key, rows) => {
        setFeeRows((prev) => ({ ...prev, [key]: rows }));
    };
    const handlePublishConfirm = () => {
        setShowPublishPreview(false);
        finishSubmit('publish');
    };
    const finishSubmit = (action) => {
        const splitOnCreate = !isEdit && useWarehouseSplit && usesTabbedFeeCategoryLayout(spec);
        if (splitOnCreate) {
            const types = getConfiguredFeeTypes(spec, unifiedConfig);
            if (types.length === 0) {
                showToast('请至少配置一个费用类型后再提交');
                return;
            }
            const names = types.map((t) => buildSplitRuleName(customerLabel, t));
            const typeLabels = types.map((t) => feeTypeTabLabel(t)).join('、');
            const verb = action === 'publish' ? '已发布' : '已暂存';
            showToast(`${verb} ${types.length} 条规则（${typeLabels}）：${names.join('；')}`);
        }
        else {
            showToast(action === 'publish' ? '已发布规则' : '已暂存草稿');
        }
        goList();
    };
    const handleFormAction = (label) => {
        if (label === '取消')
            goList();
        else if (label === '发布')
            setShowPublishPreview(true);
        else if (label === '暂存')
            finishSubmit('draft');
        else
            goList();
    };
    const lockedFeeType = isEdit ? editValues?.feeType : undefined;
    const initialFeeType = !isEdit ? flow?.params.feeType : undefined;
    const basicSections = getBasicSections(spec);
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx(Button, { variant: "secondary", icon: "fas fa-arrow-left", onClick: goList, ...reviewTarget('form.back'), children: "\u8FD4\u56DE\u5217\u8868" }), isEdit && _jsxs("span", { className: "text-xs text-text-muted", children: ["\u7F16\u8F91 ID: ", editId] })] }), _jsx("h2", { className: "text-lg font-semibold text-primary mb-4", children: pageTitle }), _jsxs("form", { className: "space-y-6", onSubmit: (e) => e.preventDefault(), children: [basicSections.map((section) => (_jsx(Card, { title: section.title, icon: section.icon, children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: section.fields?.map((f) => (_jsx(FormFieldInput, { field: f, defaultValue: fieldValues[f.id] ?? '', isEdit: isEdit, onChange: handleFieldChange }, f.id))) }) }, section.title))), useWarehouseSplit ? (_jsx(RuleConfigWarehouseSplit, { spec: spec, customerId: fieldValues.customer, warehouseIds: warehouseIds, selectedWarehouseIds: selectedWarehouseIds, onSelectedWarehouseChange: setSelectedWarehouseIds, unifiedConfig: unifiedConfig, onUnifiedConfigChange: handleUnifiedConfigChange, importedFrom: importedFrom, onImportTemplate: handleImportTemplate, lockedFeeType: lockedFeeType, initialFeeType: initialFeeType })) : useFeeCategoryNav ? (_jsx(FeeCategoryConfig, { spec: spec, title: "\u8D39\u7528\u9879\u914D\u7F6E", icon: "fas fa-coins", rows: feeRows, onRowsChange: handleFeeRowsChange, lockedFeeType: lockedFeeType, initialFeeType: initialFeeType })) : useVisibleWhenConfig ? (_jsx(VisibleWhenConfigPanel, { spec: spec, fieldValues: fieldValues, rows: feeRows, onRowsChange: handleFeeRowsChange })) : null, _jsx("div", { className: "flex justify-end gap-3", children: (spec.formActions ?? []).map((a) => {
                            const reviewId = a.label === '取消'
                                ? 'form.btn.cancel'
                                : a.label === '暂存'
                                    ? 'form.btn.draft'
                                    : a.label === '发布'
                                        ? 'form.btn.publish'
                                        : `form.btn.${a.label}`;
                            return (_jsx(Button, { variant: a.variant, icon: a.icon, onClick: () => handleFormAction(a.label), ...reviewTarget(reviewId, a.label), children: a.label }, a.label));
                        }) })] }), _jsx(RulePublishPreviewModal, { open: showPublishPreview, context: publishContext, preview: publishPreview, onClose: () => setShowPublishPreview(false), onConfirm: handlePublishConfirm }), toastMessage && _jsx(Toast, { message: toastMessage })] }));
}
