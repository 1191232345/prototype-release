import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { reviewTarget } from '@prototype/review';
export function FormFieldInput({ field, defaultValue, isEdit, onChange, readOnly = false, }) {
    const spanCls = field.span === 2 ? 'md:col-span-2' : '';
    const label = field.required ? `*${field.label}` : field.label;
    const isDisabled = isEdit && field.id === 'feeType';
    const disabledCls = isDisabled ? 'bg-light-bg cursor-not-allowed' : '';
    if (field.id === 'warehouse')
        return null;
    const displayValue = field.type === 'select'
        ? field.options?.find((o) => o.value === defaultValue)?.label ?? defaultValue
        : defaultValue;
    if (readOnly) {
        return (_jsxs("div", { className: spanCls, ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsx("div", { className: "text-xs text-text-muted mb-1", children: field.label }), _jsx("div", { className: "text-sm font-medium text-dark py-2", children: displayValue || '—' })] }));
    }
    return (_jsxs("div", { className: spanCls, ...reviewTarget(`form.field.${field.id}`, field.label), children: [_jsx("label", { className: "form-label", children: label }), field.type === 'select' ? (_jsxs("select", { className: `form-input ${disabledCls}`, value: defaultValue, disabled: isDisabled, onChange: (e) => onChange(field.id, e.target.value), children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9" }), field.options?.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] })) : field.type === 'datetime' ? (_jsx("input", { type: "datetime-local", className: `form-input ${disabledCls}`, value: defaultValue, disabled: isDisabled, onChange: (e) => onChange(field.id, e.target.value) })) : (_jsx("input", { type: "text", className: `form-input ${disabledCls}`, placeholder: field.placeholder, value: defaultValue, disabled: isDisabled, onChange: (e) => onChange(field.id, e.target.value) }))] }));
}
