import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, PageShell } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { reviewTarget } from '../../lib/reviewLink';
import { RulePublishPreviewModal, resolvePublishPreview, } from './RulePublishPreview';
import { RuleConfigWarehouseSplit, FormFieldInput, } from './RuleConfigWarehouseSplit';
import { FeeCategoryConfig } from './FeeCategoryConfig';
import { VisibleWhenConfigPanel } from './VisibleWhenConfigPanel';
import { buildDefaultSectionRows, cloneSectionRows, getBasicSections, getCustomerWarehouseIds, getWarehouseOptions, usesFeeCategoryNav, usesVisibleWhenConfig, } from './ruleConfigFormUtils';
function initWarehouseIds(editWarehouse, isEdit) {
    if (!editWarehouse)
        return [];
    const ids = editWarehouse.split(',').filter(Boolean);
    return isEdit && ids.length ? [ids[0]] : ids;
}
export function RuleConfigFormPattern({ spec }) {
    const flow = useFlowNav();
    const isEdit = Boolean(flow?.params.editId);
    const editId = flow?.params.editId;
    const editValues = editId ? spec.editData?.[editId] : undefined;
    const defaultSectionRows = useMemo(() => buildDefaultSectionRows(spec), [spec]);
    const [feeRows, setFeeRows] = useState(() => cloneSectionRows(defaultSectionRows));
    const goList = () => flow?.navigate('list');
    const [showPublishPreview, setShowPublishPreview] = useState(false);
    const [fieldValues, setFieldValues] = useState(() => {
        const init = {};
        for (const section of spec.sections ?? []) {
            for (const field of section.fields ?? []) {
                if (field.id === 'warehouse' || field.id === 'priceCard')
                    continue;
                init[field.id] = editValues?.[field.id] ?? field.defaultValue ?? '';
            }
        }
        return init;
    });
    const [warehouseIds, setWarehouseIds] = useState(() => initWarehouseIds(editValues?.warehouse, isEdit));
    const [activeWarehouseId, setActiveWarehouseId] = useState(() => {
        const ids = initWarehouseIds(editValues?.warehouse, isEdit);
        return ids[0] ?? null;
    });
    const [warehouseConfigs, setWarehouseConfigs] = useState(() => {
        const ids = initWarehouseIds(editValues?.warehouse, isEdit);
        const map = {};
        ids.forEach((id) => {
            map[id] = cloneSectionRows(defaultSectionRows);
        });
        return map;
    });
    const [warehouseMeta, setWarehouseMeta] = useState({});
    const warehouseOptions = getWarehouseOptions(spec);
    const useWarehouseSplit = warehouseOptions.length > 0;
    const useFeeCategoryNav = !useWarehouseSplit && usesFeeCategoryNav(spec);
    const useVisibleWhenConfig = !useWarehouseSplit && !useFeeCategoryNav && usesVisibleWhenConfig(spec);
    const warehouseLabel = (id) => warehouseOptions.find((o) => o.value === id)?.label ?? id;
    const feeTypeTitles = {
        base: '基础价',
        surcharge: '附加费',
        other: '其他费用',
    };
    const resolvedTitle = isEdit
        ? `编辑${feeTypeTitles[fieldValues.feeType] ?? '配置'}`
        : fieldValues.feeType
            ? `新增${feeTypeTitles[fieldValues.feeType]}`
            : (spec.title ?? '创建配置');
    const displayTitle = useVisibleWhenConfig
        ? resolvedTitle
        : isEdit
            ? `编辑 · ${spec.title ?? '规则配置'}`
            : (spec.title ?? '创建规则配置');
    const pageTitle = displayTitle;
    const ensureWarehouseConfig = useCallback((ids) => {
        setWarehouseConfigs((prev) => {
            const next = { ...prev };
            ids.forEach((id) => {
                if (!next[id])
                    next[id] = cloneSectionRows(defaultSectionRows);
            });
            return next;
        });
    }, [defaultSectionRows]);
    const handleWarehouseConfigChange = (warehouseId, key, rows) => {
        setWarehouseConfigs((prev) => ({
            ...prev,
            [warehouseId]: { ...prev[warehouseId], [key]: rows },
        }));
    };
    const handleImportTemplate = (warehouseId, templateLabel) => {
        setWarehouseConfigs((prev) => ({
            ...prev,
            [warehouseId]: cloneSectionRows(defaultSectionRows),
        }));
        setWarehouseMeta((prev) => ({
            ...prev,
            [warehouseId]: { importedFrom: templateLabel },
        }));
    };
    const handleReuseFromWarehouse = (sourceId) => {
        if (!activeWarehouseId || sourceId === activeWarehouseId)
            return;
        const source = warehouseConfigs[sourceId];
        if (!source)
            return;
        setWarehouseConfigs((prev) => ({
            ...prev,
            [activeWarehouseId]: cloneSectionRows(source),
        }));
    };
    useEffect(() => {
        if (!useWarehouseSplit || isEdit)
            return;
        const customerId = fieldValues.customer;
        if (!customerId) {
            setWarehouseIds([]);
            setActiveWarehouseId(null);
            return;
        }
        const ids = getCustomerWarehouseIds(spec, customerId);
        setWarehouseIds(ids);
        ensureWarehouseConfig(ids);
        setActiveWarehouseId((prev) => (prev && ids.includes(prev) ? prev : ids[0] ?? null));
    }, [fieldValues.customer, useWarehouseSplit, isEdit, spec, ensureWarehouseConfig]);
    const activeWarehouseLabel = activeWarehouseId ? warehouseLabel(activeWarehouseId) : '';
    const publishContext = {
        customer: fieldValues.customer,
        warehouse: isEdit
            ? activeWarehouseLabel
            : warehouseIds.map(warehouseLabel).join('、'),
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
        goList();
    };
    const handleFormAction = (label) => {
        if (label === '取消')
            goList();
        else if (label === '发布')
            setShowPublishPreview(true);
        else
            goList();
    };
    const basicSections = getBasicSections(spec);
    return (_jsxs(PageShell, { brand: spec.header?.brand, children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx(Button, { variant: "secondary", icon: "fas fa-arrow-left", onClick: goList, ...reviewTarget('form.back'), children: "\u8FD4\u56DE\u5217\u8868" }), isEdit && (_jsxs("span", { className: "text-xs text-text-muted", children: ["\u7F16\u8F91 ID: ", editId] }))] }), _jsx("h2", { className: "text-lg font-semibold text-primary mb-4", children: pageTitle }), _jsxs("form", { className: "space-y-6", onSubmit: (e) => e.preventDefault(), children: [basicSections.map((section) => (_jsx(Card, { title: section.title, icon: section.icon, children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: section.fields?.map((f) => (_jsx(FormFieldInput, { field: f, defaultValue: fieldValues[f.id] ?? '', isEdit: isEdit, onChange: handleFieldChange }, f.id))) }) }, section.title))), useWarehouseSplit ? (_jsx(RuleConfigWarehouseSplit, { spec: spec, customerId: fieldValues.customer, activeWarehouseId: activeWarehouseId, onActiveWarehouseChange: setActiveWarehouseId, warehouseIds: warehouseIds, warehouseConfigs: warehouseConfigs, onWarehouseConfigChange: handleWarehouseConfigChange, warehouseMeta: warehouseMeta, onImportTemplate: handleImportTemplate, onReuseFromWarehouse: handleReuseFromWarehouse })) : useFeeCategoryNav ? (_jsx(FeeCategoryConfig, { spec: spec, title: "\u8D39\u7528\u9879\u914D\u7F6E", icon: "fas fa-coins", description: "\u901A\u8FC7\u4E0B\u62C9\u9009\u62E9\u8D39\u7528\u7C7B\u578B\u5207\u6362\u7F16\u8F91\uFF08\u540C\u4E00\u65F6\u523B\u4EC5\u5C55\u793A\u4E00\u7C7B\u8D39\u7528\u53CA\u5176\u5B50\u9879 Tab\uFF09\u3002", rows: feeRows, onRowsChange: handleFeeRowsChange })) : useVisibleWhenConfig ? (_jsx(VisibleWhenConfigPanel, { spec: spec, fieldValues: fieldValues, rows: feeRows, onRowsChange: handleFeeRowsChange })) : null, _jsx("div", { className: "flex justify-end gap-3", children: (spec.formActions ?? []).map((a) => {
                            const reviewId = a.label === '取消'
                                ? 'form.btn.cancel'
                                : a.label === '暂存'
                                    ? 'form.btn.draft'
                                    : a.label === '发布'
                                        ? 'form.btn.publish'
                                        : `form.btn.${a.label}`;
                            return (_jsx(Button, { variant: a.variant, icon: a.icon, onClick: () => handleFormAction(a.label), ...reviewTarget(reviewId, a.label), children: a.label }, a.label));
                        }) })] }), _jsx(RulePublishPreviewModal, { open: showPublishPreview, context: publishContext, preview: publishPreview, onClose: () => setShowPublishPreview(false), onConfirm: handlePublishConfirm })] }));
}
