import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Card } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { DetailContent } from './DetailContent';
import { FeeCategoryConfig } from './FeeCategoryConfig';
import { RuleConfigWarehouseSplit, FormFieldInput } from './RuleConfigWarehouseSplit';
import { buildDefaultSectionRows, cloneSectionRows, getBasicSections, getCustomerWarehouseIds, getWarehouseOptions, usesFeeCategoryNav, } from './ruleConfigFormUtils';
function collectFieldDefaults(spec) {
    const values = {};
    for (const section of spec.sections ?? []) {
        for (const field of section.fields ?? []) {
            values[field.id] = field.defaultValue ?? '';
        }
    }
    return values;
}
function parseSelectedWarehouses(raw, fallback) {
    if (!raw)
        return new Set(fallback);
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
    return new Set(ids.length ? ids : fallback);
}
export function RuleConfigDetailView({ spec }) {
    const flow = useFlowNav();
    const rowId = flow?.params.rowId ?? 'rc-001';
    const editValues = spec.editData?.[rowId] ?? spec.editData?.['rc-001'];
    const basicSections = getBasicSections(spec);
    const fieldValues = useMemo(() => {
        const defaults = collectFieldDefaults(spec);
        return { ...defaults, ...editValues };
    }, [spec, editValues]);
    const customerId = fieldValues.customer ?? '';
    const feeType = fieldValues.feeType;
    const warehouseOptions = getWarehouseOptions(spec);
    const useWarehouseSplit = warehouseOptions.length > 0;
    const useFeeCategoryNav = !useWarehouseSplit && usesFeeCategoryNav(spec);
    const warehouseIds = useMemo(() => {
        const fromCustomer = getCustomerWarehouseIds(spec, customerId);
        if (fromCustomer.length)
            return fromCustomer;
        const items = spec.sections?.find((s) => s.layout === 'warehouse-list')?.warehouseItems ?? [];
        return items.map((w) => w.id);
    }, [spec, customerId]);
    const defaultSectionRows = useMemo(() => buildDefaultSectionRows(spec), [spec]);
    const unifiedConfig = useMemo(() => {
        if (spec.feeRowSamples)
            return cloneSectionRows(spec.feeRowSamples);
        return cloneSectionRows(defaultSectionRows);
    }, [spec.feeRowSamples, defaultSectionRows]);
    const [selectedWarehouseIds] = useState(() => parseSelectedWarehouses(editValues?.selectedWarehouses ?? editValues?.warehouse, warehouseIds));
    const extraSections = spec.detail?.sections ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [basicSections.map((section) => (_jsx(Card, { title: section.title, icon: section.icon, children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: section.fields?.map((f) => (_jsx(FormFieldInput, { field: f, defaultValue: fieldValues[f.id] ?? '', isEdit: false, onChange: () => undefined, readOnly: true }, f.id))) }) }, section.title))), useWarehouseSplit && (_jsx(RuleConfigWarehouseSplit, { spec: spec, customerId: customerId, warehouseIds: warehouseIds, selectedWarehouseIds: selectedWarehouseIds, onSelectedWarehouseChange: () => undefined, unifiedConfig: unifiedConfig, onUnifiedConfigChange: () => undefined, importedFrom: editValues?.importedFrom, onImportTemplate: () => undefined, readOnly: true, lockedFeeType: feeType })), useFeeCategoryNav && (_jsx(FeeCategoryConfig, { spec: spec, title: "\u8D39\u7528\u9879\u914D\u7F6E", icon: "fas fa-coins", rows: unifiedConfig, readOnly: true, lockedFeeType: feeType })), extraSections.length > 0 && _jsx(DetailContent, { detail: { sections: extraSections } })] }));
}
