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
export function RuleConfigDetailView({ spec }) {
    const flow = useFlowNav();
    const rowId = flow?.params.rowId ?? 'pc-001';
    const editValues = spec.editData?.[rowId] ?? spec.editData?.['pc-001'];
    const basicSections = getBasicSections(spec);
    const fieldValues = useMemo(() => {
        const defaults = collectFieldDefaults(spec);
        return { ...defaults, ...editValues };
    }, [spec, editValues]);
    const customerId = fieldValues.customer ?? '';
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
    const feeRows = useMemo(() => {
        if (spec.feeRowSamples)
            return cloneSectionRows(spec.feeRowSamples);
        return cloneSectionRows(defaultSectionRows);
    }, [spec.feeRowSamples, defaultSectionRows]);
    const warehouseConfigs = useMemo(() => {
        const map = {};
        warehouseIds.forEach((id) => {
            map[id] = cloneSectionRows(feeRows);
        });
        return map;
    }, [warehouseIds, feeRows]);
    const [activeWarehouseId, setActiveWarehouseId] = useState(() => warehouseIds[0] ?? null);
    const extraSections = spec.detail?.sections ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [basicSections.map((section) => (_jsx(Card, { title: section.title, icon: section.icon, children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: section.fields?.map((f) => (_jsx(FormFieldInput, { field: f, defaultValue: fieldValues[f.id] ?? '', isEdit: false, onChange: () => undefined, readOnly: true }, f.id))) }) }, section.title))), useWarehouseSplit && (_jsx(RuleConfigWarehouseSplit, { spec: spec, customerId: customerId, activeWarehouseId: activeWarehouseId, onActiveWarehouseChange: setActiveWarehouseId, warehouseIds: warehouseIds, warehouseConfigs: warehouseConfigs, onWarehouseConfigChange: () => undefined, warehouseMeta: {}, onImportTemplate: () => undefined, onReuseFromWarehouse: () => undefined, readOnly: true })), useFeeCategoryNav && (_jsx(FeeCategoryConfig, { spec: spec, title: "\u8D39\u7528\u9879\u914D\u7F6E", icon: "fas fa-coins", description: "\u6309\u8D39\u7528\u5927\u7C7B\u5207\u6362\u67E5\u770B\uFF08\u540C\u4E00\u65F6\u523B\u4EC5\u5C55\u793A\u4E00\u7C7B\u8D39\u7528\uFF09\u3002", rows: feeRows, readOnly: true })), extraSections.length > 0 && (_jsx(DetailContent, { detail: { sections: extraSections } }))] }));
}
