import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '@prototype/ui';
import { reviewTarget } from '@prototype/review';
import { SurchargeTableEditor } from './SurchargeTableEditor';
import { ZonePriceTableEditor } from './ZonePriceTableEditor';
import { getVisibleConfigSections, sectionKey, } from './ruleConfigFormUtils';
export function VisibleWhenConfigPanel({ spec, fieldValues, rows, onRowsChange }) {
    const visibleSections = getVisibleConfigSections(spec, fieldValues);
    const feeType = fieldValues.feeType?.trim();
    if (!feeType) {
        return (_jsx(Card, { title: "\u914D\u7F6E\u533A\u57DF", icon: "fas fa-sliders-h", children: _jsx("div", { className: "flex items-center justify-center min-h-[200px] rounded-lg border border-dashed border-border text-text-muted text-sm", ...reviewTarget('form.config.placeholder', '配置区域占位'), children: "\u8BF7\u5148\u9009\u62E9\u8D39\u7528\u7C7B\u578B\uFF0C\u518D\u7EF4\u62A4\u5BF9\u5E94\u914D\u7F6E" }) }));
    }
    if (visibleSections.length === 0) {
        return (_jsx(Card, { title: "\u914D\u7F6E\u533A\u57DF", icon: "fas fa-sliders-h", children: _jsx("div", { className: "text-sm text-text-muted py-8 text-center", children: "\u5F53\u524D\u8D39\u7528\u7C7B\u578B\u6682\u65E0\u914D\u7F6E\u533A\u57DF" }) }));
    }
    return (_jsx(_Fragment, { children: visibleSections.map((section) => (_jsx(ConfigSectionCard, { section: section, rows: rows, onRowsChange: onRowsChange }, section.title))) }));
}
function ConfigSectionCard({ section, rows, onRowsChange, }) {
    const key = sectionKey(section.title);
    return (_jsxs(Card, { title: section.title, icon: section.icon, children: [section.zonePriceTable && (_jsx("div", { ...reviewTarget('form.zone.table'), children: _jsx(ZonePriceTableEditor, { table: section.zonePriceTable, feeItemField: section.feeItemField, feeItemReviewId: section.feeItemField
                        ? section.title.includes('其他')
                            ? 'form.other.field.feeItem'
                            : 'form.surcharge.field.feeItem'
                        : undefined }) })), section.surchargeTable && (_jsx("div", { ...reviewTarget(section.title.includes('其他') ? 'form.other.table' : 'form.surcharge.table'), children: _jsx(SurchargeTableEditor, { table: section.surchargeTable, rows: rows?.[key], onRowsChange: onRowsChange ? (next) => onRowsChange(key, next) : undefined }) }))] }));
}
