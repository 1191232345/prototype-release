export function sectionKey(sectionTitle, tabLabel) {
    return tabLabel ? `${sectionTitle}::${tabLabel}` : `${sectionTitle}::default`;
}
function normalizeRows(table) {
    return table.rows.map((row) => {
        const next = {};
        table.columns.forEach((col) => {
            next[col.key] = row[col.key] || (col.type === 'number' ? '0' : '');
        });
        return next;
    });
}
export function buildDefaultSectionRows(spec) {
    const map = {};
    for (const section of spec.sections ?? []) {
        if (section.surchargeTable) {
            map[sectionKey(section.title)] = normalizeRows(section.surchargeTable);
        }
        if (section.tabs) {
            for (const tab of section.tabs) {
                if (tab.content.surchargeTable) {
                    map[sectionKey(section.title, tab.label)] = normalizeRows(tab.content.surchargeTable);
                }
            }
        }
    }
    return map;
}
export function cloneSectionRows(rows) {
    const next = {};
    for (const [k, v] of Object.entries(rows)) {
        next[k] = v.map((row) => ({ ...row }));
    }
    return next;
}
export function isSectionConfigured(rows) {
    return rows.some((row) => Boolean(row.feeRuleId?.trim()));
}
export function isWarehouseConfigured(rowsMap) {
    return Object.values(rowsMap).some(isSectionConfigured);
}
export function countConfiguredRows(rowsMap) {
    return Object.values(rowsMap).reduce((sum, rows) => sum + rows.filter((r) => Boolean(r.feeRuleId?.trim())).length, 0);
}
export function summarizeWarehouseConfig(rowsMap) {
    const parts = [];
    const express = Object.entries(rowsMap).filter(([k]) => k.includes('快递'));
    const warehouse = Object.entries(rowsMap).filter(([k]) => k.includes('库内'));
    const other = Object.entries(rowsMap).filter(([k]) => k.includes('其他费用'));
    const fuel = Object.entries(rowsMap).filter(([k]) => k.includes('燃油费'));
    const peak = Object.entries(rowsMap).filter(([k]) => k.includes('旺季附加费'));
    const count = (entries) => entries.reduce((n, [, rows]) => n + rows.filter((r) => r.feeRuleId?.trim()).length, 0);
    const ec = count(express);
    const wc = count(warehouse);
    const oc = count(other);
    const fc = count(fuel);
    const pc = count(peak);
    if (ec)
        parts.push(`快递${ec}项`);
    if (wc)
        parts.push(`库内${wc}项`);
    if (oc)
        parts.push(`其他${oc}项`);
    if (fc)
        parts.push(`燃油${fc}项`);
    if (pc)
        parts.push(`旺季${pc}项`);
    return parts.length ? parts.join(' · ') : '未配置';
}
export function getWarehouseOptions(spec) {
    for (const section of spec.sections ?? []) {
        const wh = section.fields?.find((f) => f.id === 'warehouse');
        if (wh?.options)
            return wh.options;
    }
    return spec.warehouseOptions ?? [];
}
export function getPriceCardTemplates(spec) {
    if (spec.priceCardTemplates?.length)
        return spec.priceCardTemplates;
    for (const section of spec.sections ?? []) {
        const pc = section.fields?.find((f) => f.id === 'priceCard');
        if (pc?.options)
            return pc.options;
    }
    return [];
}
export function getCustomerWarehouseIds(spec, customerId) {
    if (!customerId)
        return [];
    return spec.customerWarehouses?.[customerId] ?? [];
}
export function getBasicSections(spec) {
    return (spec.sections ?? []).filter((s) => (s.fields?.length ?? 0) > 0 &&
        !s.zonePriceTable &&
        !s.surchargeTable &&
        !s.tabs?.length &&
        !s.visibleWhen);
}
export function usesFeeCategoryNav(spec) {
    return getFeeSections(spec).length >= 2;
}
export function usesTabbedFeeCategoryLayout(spec) {
    return spec.feeCategoryLayout === 'tabbed' || spec.feeCategoryLayout === 'split-cards';
}
export function usesVisibleWhenConfig(spec) {
    return (spec.sections ?? []).some((s) => s.visibleWhen);
}
export function isSectionVisible(section, fieldValues) {
    if (!section.visibleWhen)
        return true;
    const current = fieldValues[section.visibleWhen.field]?.trim() ?? '';
    return section.visibleWhen.values.includes(current);
}
export function getVisibleConfigSections(spec, fieldValues) {
    return (spec.sections ?? []).filter((s) => s.visibleWhen && isSectionVisible(s, fieldValues));
}
export function getFeeSections(spec) {
    return (spec.sections ?? []).filter((s) => s.title.includes('快递') ||
        s.title.includes('库内') ||
        s.title.includes('其他费用') ||
        s.title.includes('燃油费') ||
        s.title.includes('旺季附加费'));
}
export function shortFeeSectionLabel(title) {
    if (title.includes('快递'))
        return '快递费';
    if (title.includes('库内'))
        return '库内费用';
    if (title.includes('燃油费'))
        return '燃油费';
    if (title.includes('旺季附加费'))
        return '旺季附加费';
    if (title.includes('其他'))
        return '其他费用';
    return title;
}
export const FEE_TYPE_TAB_KEYWORDS = {
    express: '快递',
    storage: '库内',
    other: '其他费用',
    fuel: '燃油费',
    peak: '旺季附加费',
};
export function feeTypeTabLabel(feeType) {
    const map = {
        express: '快递费',
        storage: '库内费用',
        other: '其他费用',
        fuel: '燃油费',
        peak: '旺季附加费',
    };
    return map[feeType] ?? feeType;
}
export function filterFeeSectionsByType(spec, feeType) {
    const all = getFeeSections(spec);
    if (!feeType)
        return all;
    const keyword = FEE_TYPE_TAB_KEYWORDS[feeType];
    if (!keyword)
        return all;
    return all.filter((s) => s.title.includes(keyword));
}
export function initialFeeCategoryIndex(spec, feeType) {
    if (!feeType)
        return 0;
    const keyword = FEE_TYPE_TAB_KEYWORDS[feeType];
    if (!keyword)
        return 0;
    const sections = getFeeSections(spec);
    const idx = sections.findIndex((s) => s.title.includes(keyword));
    return idx >= 0 ? idx : 0;
}
export function countFeeSectionConfigured(rowsMap, section) {
    let total = 0;
    const addRows = (rows) => {
        total += rows.filter((r) => Boolean(r.feeRuleId?.trim())).length;
    };
    if (section.tabs) {
        for (const tab of section.tabs) {
            addRows(rowsMap[sectionKey(section.title, tab.label)] ?? []);
        }
    }
    else {
        addRows(rowsMap[sectionKey(section.title)] ?? []);
    }
    return total;
}
export function countTabConfiguredRows(rowsMap, section, tabLabel) {
    const rows = rowsMap[sectionKey(section.title, tabLabel)] ?? [];
    return rows.filter((r) => Boolean(r.feeRuleId?.trim())).length;
}
export function countFeeSubTabs(section) {
    if (section.tabs?.length)
        return section.tabs.length;
    return section.surchargeTable || section.zonePriceTable ? 1 : 0;
}
export function countConfiguredSubTabs(rowsMap, section) {
    if (section.tabs?.length) {
        return section.tabs.filter((tab) => isSectionConfigured(rowsMap[sectionKey(section.title, tab.label)] ?? [])).length;
    }
    return isSectionConfigured(rowsMap[sectionKey(section.title)] ?? []) ? 1 : 0;
}
export function feeTypeFromSectionTitle(title) {
    if (title.includes('快递'))
        return 'express';
    if (title.includes('库内'))
        return 'storage';
    if (title.includes('燃油费'))
        return 'fuel';
    if (title.includes('旺季'))
        return 'peak';
    if (title.includes('其他费用'))
        return 'other';
    return 'other';
}
export function getConfiguredFeeTypes(spec, rowsMap) {
    return getFeeSections(spec)
        .filter((section) => countFeeSectionConfigured(rowsMap, section) > 0)
        .map((section) => feeTypeFromSectionTitle(section.title));
}
export function buildSplitRuleName(customerLabel, feeType) {
    const base = customerLabel.trim() || '客户';
    return `${base}-${feeTypeTabLabel(feeType)}规则`;
}
export function filterFeeSectionsByLockedType(spec, lockedFeeType) {
    const all = getFeeSections(spec);
    if (!lockedFeeType)
        return all;
    const keyword = FEE_TYPE_TAB_KEYWORDS[lockedFeeType];
    if (!keyword)
        return all;
    return all.filter((s) => s.title.includes(keyword));
}
