import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, PrototypeModal } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
const feeRuleData = {
    'sf-001': { name: 'UPS 美西基础价', unit: '每公斤' },
    'sf-002': { name: 'FedEx 美东基础价', unit: '每公斤' },
    'sf-003': { name: 'DHL 中部基础价', unit: '每公斤' },
    'sf-004': { name: '燃油附加费', unit: '每单' },
    'sf-005': { name: '偏远附加费', unit: '每单' },
    'sf-006': { name: '超大件附加费', unit: '每件' },
    'sf-007': { name: '住宅派送附加费', unit: '每单' },
    'sf-008': { name: '地址修正费', unit: '每单' },
    'sf-009': { name: '签名服务', unit: '每单' },
    'sf-010': { name: '保险服务', unit: '每单' },
    'if-001': { name: '整柜入库-卸货费', unit: '每柜' },
    'if-002': { name: '快递散货入库-收货费', unit: '每件' },
    'if-003': { name: '托盘入库-上架费', unit: '每托盘' },
    'if-004': { name: '仓储费-月租', unit: '每平方米/月' },
    'if-005': { name: '拣货费', unit: '每件' },
    'if-006': { name: '打包费', unit: '每件' },
    'if-007': { name: '出库费', unit: '每托盘' },
    'if-008': { name: '出库费（一件代发）', unit: '每件' },
    'if-008b': { name: '出库费（一件代发）-打包费', unit: '每件' },
    'if-009': { name: '出库费（中转）', unit: '每托盘' },
    'if-009b': { name: '出库费（中转）-打托费', unit: '每托盘' },
    'va-001': { name: '拍照服务', unit: '每件' },
    'va-002': { name: '标签服务', unit: '每件' },
    'va-003': { name: '质检服务', unit: '每件' },
    'va-004': { name: '换标服务', unit: '每件' },
    'va-005': { name: '退货处理', unit: '每件' },
    'va-006': { name: '库存盘点', unit: '每小时' },
    'va-007': { name: '紧急处理', unit: '每单' },
};
const READONLY_SKIP_KEYS = new Set(['feeRuleId', 'actions']);
function normalizeTableRows(table) {
    const { columns, rows: initialRows } = table;
    return initialRows.map((row) => {
        const processedRow = {};
        columns.forEach((col) => {
            processedRow[col.key] = row[col.key] || (col.type === 'number' ? '0' : '');
        });
        return processedRow;
    });
}
export function SurchargeTableEditor({ table, rows: controlledRows, onRowsChange, readOnly = false, }) {
    const { columns } = table;
    const processedInitial = normalizeTableRows(table);
    const [internalRows, setInternalRows] = useState(processedInitial);
    const isControlled = controlledRows !== undefined;
    const rows = isControlled ? controlledRows : internalRows;
    const updateRows = (next) => {
        if (onRowsChange)
            onRowsChange(next);
        else
            setInternalRows(next);
    };
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [, setCurrentRowIndex] = useState(0);
    const [currentFeeName, setCurrentFeeName] = useState('');
    const handleAddRow = () => {
        const newRow = {};
        columns.forEach((col) => {
            newRow[col.key] = col.type === 'number' ? '0' : '';
        });
        updateRows([...rows, newRow]);
    };
    const handleDeleteRow = (index) => {
        updateRows(rows.filter((_, i) => i !== index));
    };
    const handleCellChange = (rowIndex, colKey, value) => {
        const newRows = [...rows];
        newRows[rowIndex] = { ...newRows[rowIndex], [colKey]: value };
        if (colKey === 'feeRuleId' && feeRuleData[value]) {
            newRows[rowIndex]['feeRuleName'] = feeRuleData[value].name;
            newRows[rowIndex]['unit'] = feeRuleData[value].unit;
        }
        updateRows(newRows);
    };
    const handleMultiSelectChange = (rowIndex, colKey, value, checked) => {
        const newRows = [...rows];
        const current = newRows[rowIndex][colKey] || '';
        const selected = current ? current.split(',') : [];
        const updated = checked
            ? [...selected, value]
            : selected.filter((v) => v !== value);
        newRows[rowIndex] = { ...newRows[rowIndex], [colKey]: updated.join(',') };
        updateRows(newRows);
    };
    const handleOpenDiscountModal = (rowIndex) => {
        const feeName = rows[rowIndex]['feeRuleName'] || '未选择费用规则';
        setCurrentRowIndex(rowIndex);
        setCurrentFeeName(feeName);
        setShowDiscountModal(true);
    };
    const handleSaveDiscount = () => {
        setShowDiscountModal(false);
    };
    const handleActionClick = (rowIndex, action) => {
        switch (action) {
            case 'openDiscountModal':
                handleOpenDiscountModal(rowIndex);
                break;
            case 'deleteRow':
                handleDeleteRow(rowIndex);
                break;
            default:
                console.warn(`Unknown action: ${action}`);
        }
    };
    const renderCell = (col, row, rowIndex) => {
        if (col.type === 'actions' && col.actions) {
            return (_jsx("div", { className: "flex gap-1 justify-center", children: col.actions.map((actionBtn, actionIndex) => (_jsxs("button", { className: `px-2 py-1 text-xs rounded ${actionBtn.variant === 'primary'
                        ? 'bg-accent text-white'
                        : actionBtn.variant === 'danger'
                            ? 'bg-red-500 text-white'
                            : 'bg-light-bg text-text-secondary border border-border'}`, onClick: () => handleActionClick(rowIndex, actionBtn.action), title: actionBtn.label, children: [actionBtn.icon && _jsx(FaIcon, { className: `fas ${actionBtn.icon} mr-1` }), actionBtn.label] }, actionIndex))) }));
        }
        if (col.type === 'select') {
            return (_jsxs("select", { className: "form-input text-sm", value: row[col.key] || '', onChange: (e) => handleCellChange(rowIndex, col.key, e.target.value), children: [_jsx("option", { value: "", children: col.placeholder || '请选择' }), col.options?.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] }));
        }
        if (col.type === 'multiSelect') {
            return (_jsx("div", { className: "flex flex-wrap gap-1 justify-center", children: col.options?.map((o) => {
                    const selected = (row[col.key] || '').split(',').filter(Boolean);
                    const isChecked = selected.includes(o.value);
                    return (_jsxs("label", { className: "inline-flex items-center gap-1 text-xs cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: isChecked, onChange: (e) => handleMultiSelectChange(rowIndex, col.key, o.value, e.target.checked), className: "accent-accent" }), o.label] }, o.value));
                }) }));
        }
        if (col.type === 'number') {
            return (_jsx("input", { type: "number", value: row[col.key] || '0', step: "0.01", onChange: (e) => handleCellChange(rowIndex, col.key, e.target.value), className: "w-20 text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent" }));
        }
        return (_jsx("input", { type: "text", value: row[col.key] || '', placeholder: col.placeholder || '', onChange: (e) => handleCellChange(rowIndex, col.key, e.target.value), className: "w-full text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent", disabled: col.key === 'feeRuleName' || col.key === 'unit' || col.key === 'discountType' || col.key === 'discountValue' }));
    };
    const displayColumns = readOnly
        ? columns.filter((col) => !READONLY_SKIP_KEYS.has(col.key))
        : columns;
    const displayRows = readOnly
        ? rows.filter((row) => row.feeRuleId?.trim())
        : rows;
    const renderReadOnlyCell = (col, row) => {
        const value = row[col.key]?.trim();
        return (_jsx("span", { className: "text-sm text-dark", children: value || '—' }));
    };
    return (_jsxs("div", { className: "overflow-x-auto mt-4", children: [!readOnly && (_jsxs("div", { className: "mb-4 flex gap-2", children: [_jsxs("button", { className: "px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium", onClick: handleAddRow, ...reviewTarget('form.surcharge.btn.add', '添加行'), children: [_jsx(FaIcon, { className: "fas fa-plus mr-1" }), " \u6DFB\u52A0\u884C"] }), _jsxs("button", { className: "px-3 py-1.5 bg-light-bg text-text-secondary rounded-lg text-sm font-medium border border-border", onClick: () => setShowImportModal(true), ...reviewTarget('form.surcharge.btn.import', '导入'), children: [_jsx(FaIcon, { className: "fas fa-upload mr-1" }), " \u5BFC\u5165"] })] })), readOnly && displayRows.length === 0 ? (_jsx("p", { className: "text-sm text-text-muted py-4 text-center", children: "\u6682\u65E0\u914D\u7F6E\u9879" })) : (_jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-light-bg", children: displayColumns.map((col) => (_jsx("th", { className: "border border-border px-3 py-2 text-center text-sm font-semibold text-primary whitespace-nowrap", children: col.label }, col.key))) }) }), _jsx("tbody", { children: (readOnly ? displayRows : rows).map((row, rowIndex) => (_jsx("tr", { className: "bg-white hover:bg-light-bg transition-colors", children: displayColumns.map((col) => (_jsx("td", { className: "border border-border px-2 py-2 text-center", children: readOnly ? renderReadOnlyCell(col, row) : renderCell(col, row, rowIndex) }, col.key))) }, rowIndex))) })] })), showImportModal && (_jsxs(PrototypeModal, { onClose: () => setShowImportModal(false), title: "\u5BFC\u5165\u9644\u52A0\u8D39\u914D\u7F6E", children: [_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-text-secondary mb-2", children: "\u8BF7\u4E0A\u4F20\u5305\u542B\u9644\u52A0\u8D39\u914D\u7F6E\u6570\u636E\u7684 Excel \u6216 CSV \u6587\u4EF6" }), _jsxs("div", { className: "border-2 border-dashed border-border rounded-lg p-8 text-center", ...reviewTarget('form.surcharge.import.file', '文件上传区'), children: [_jsx(FaIcon, { className: "fas fa-cloud-upload-alt text-4xl text-text-muted mb-2" }), _jsx("p", { className: "text-sm text-text-secondary", children: "\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20" }), _jsx("p", { className: "text-xs text-text-muted mt-1", children: "\u652F\u6301 .xlsx, .csv \u683C\u5F0F" })] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowImportModal(false), ...reviewTarget('form.surcharge.import.btn.cancel', '取消'), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", ...reviewTarget('form.surcharge.import.btn.confirm', '开始导入'), children: "\u5F00\u59CB\u5BFC\u5165" })] })] })), showDiscountModal && (_jsxs(PrototypeModal, { onClose: () => setShowDiscountModal(false), title: `折扣配置 - ${currentFeeName}`, children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-sm font-medium text-primary mb-1", children: "\u6298\u6263\u65B9\u5F0F" }), _jsxs("select", { className: "form-input w-full", children: [_jsx("option", { value: "", children: "\u8BF7\u9009\u62E9\u6298\u6263\u65B9\u5F0F" }), _jsx("option", { value: "none", children: "\u65E0\u6298\u6263" }), _jsx("option", { value: "percentage", children: "\u6298\u6263\u7387" }), _jsx("option", { value: "fixed", children: "\u589E\u51CF" }), _jsx("option", { value: "fixed_price", children: "\u4E00\u53E3\u4EF7" })] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-sm font-medium text-primary mb-1", children: "\u6298\u6263\u503C" }), _jsx("input", { type: "number", className: "form-input w-full", placeholder: "\u8BF7\u8F93\u5165\u6298\u6263\u503C", step: "0.01" })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-sm font-medium text-primary mb-1", children: "\u9636\u68AF\u4EF7\u683C\u9884\u89C8" }), _jsx("p", { className: "text-sm text-text-secondary", children: "\u5982\u679C\u8D39\u7528\u89C4\u5219\u5305\u542B\u9636\u68AF\u4EF7\u683C\uFF0C\u5C06\u5728\u6B64\u5904\u663E\u793A\u9884\u89C8\u8868" })] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowDiscountModal(false), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", onClick: handleSaveDiscount, children: "\u786E\u5B9A" })] })] }))] }));
}
