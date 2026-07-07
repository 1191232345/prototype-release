import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Card } from '@prototype/ui';
import { Toast } from '../../app/Toast';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
const DEFAULT_THRESHOLD = 500;
export function SkuFillImportContent({ preview, asyncThreshold = DEFAULT_THRESHOLD, filePresets, onCancel, onComplete, }) {
    const [step, setStep] = useState('upload');
    const [fileName, setFileName] = useState('');
    const [detectedRows, setDetectedRows] = useState(0);
    const [toastMessage, setToastMessage] = useState(null);
    const presets = filePresets ?? [{ fileName: preview.fileName ?? 'sku_workorder_import.xlsx', totalRows: preview.totalRows }];
    const handleFileSelect = (preset) => {
        setFileName(preset.fileName);
        setDetectedRows(preset.totalRows);
    };
    const handleConfirmImport = () => {
        if (!fileName.trim()) {
            setToastMessage('请先选择工单导入文件');
            setTimeout(() => setToastMessage(null), 2500);
            return;
        }
        if (detectedRows > asyncThreshold) {
            setToastMessage(`文件共 ${detectedRows} 条，已超过 ${asyncThreshold} 条，已添加到异步任务`);
            setTimeout(() => {
                setToastMessage(null);
                onComplete();
            }, 2000);
            return;
        }
        setStep('preview');
    };
    const handleConfirmCreate = () => {
        setToastMessage(`导入成功，已批量创建 ${detectedRows} 条工单（工单号由系统生成）`);
        setTimeout(() => {
            setToastMessage(null);
            onComplete();
        }, 1500);
    };
    return (_jsxs("div", { className: "space-y-4", children: [step === 'upload' ? (_jsxs(_Fragment, { children: [_jsxs("div", { ...reviewTarget('list.import.steps', '步骤 1 · 上传文件'), children: [_jsx("p", { className: "text-sm text-text-secondary mb-3", children: "\u6A21\u677F\u5B57\u6BB5\uFF1A\u5BA2\u6237\u4EE3\u7801\u3001\u4ED3\u5E93\u4EE3\u7801\u3001SKU \u7F16\u7801\u3001\u4F18\u5148\u7EA7\u3001\u5907\u6CE8\uFF08\u5DE5\u5355\u53F7\u7531\u7CFB\u7EDF\u751F\u6210\uFF09" }), _jsxs("button", { type: "button", className: "text-sm text-accent hover:underline mb-4 inline-flex items-center gap-1", ...reviewTarget('list.import.btn.template', '下载模板'), children: [_jsx(FaIcon, { className: "fas fa-download" }), " \u4E0B\u8F7D\u5BFC\u5165\u6A21\u677F"] }), _jsxs(Card, { className: "p-4 border-dashed border-2 border-border", children: [_jsx("p", { className: "text-sm font-medium text-text-secondary mb-3", ...reviewTarget('list.import.file', '工单导入 Excel'), children: "\u4E0A\u4F20 Excel \u6587\u4EF6\uFF08.xlsx / .xls\uFF09" }), _jsx("div", { className: "flex flex-wrap gap-2", children: presets.map((preset) => (_jsxs("button", { type: "button", className: `px-3 py-2 text-sm border rounded-lg hover:bg-light-bg ${fileName === preset.fileName ? 'border-accent bg-accent/5' : 'border-border'}`, onClick: () => handleFileSelect(preset), ...reviewTarget(`list.import.file-preset.${preset.fileName}`, preset.fileName), children: [_jsx(FaIcon, { className: "fas fa-file-excel mr-1 text-green-600" }), preset.fileName, _jsxs("span", { className: "text-text-muted ml-1", children: ["\uFF08", preset.totalRows, " \u6761\uFF09"] })] }, preset.fileName))) }), fileName && (_jsxs("p", { className: "text-xs text-text-muted mt-3", children: ["\u5DF2\u8BC6\u522B ", detectedRows, " \u6761\u5F85\u5BFC\u5165\u5DE5\u5355\uFF0C\u6BCF\u884C\u5BF9\u5E94 1 \u4E2A SKU"] }))] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onCancel, ...reviewTarget('list.import.btn.cancel', '取消'), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", icon: "fas fa-file-import", onClick: handleConfirmImport, ...reviewTarget('list.import.btn.confirm-import', '确认导入'), children: "\u786E\u8BA4\u5BFC\u5165" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { ...reviewTarget('list.import.preview-table', '导入预览表'), children: [_jsxs("p", { className: "text-sm text-text-secondary mb-3", children: ["\u6B65\u9AA4 2 \u00B7 \u9884\u89C8\u5F85\u521B\u5EFA\u5DE5\u5355\uFF08\u5171 ", detectedRows, " \u6761\uFF0C\u4EC5\u6279\u91CF\u65B0\u5EFA\uFF09"] }), _jsx("div", { className: "overflow-x-auto border border-border rounded-lg", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-light-bg", children: ['客户代码', '仓库代码', 'SKU 编码', '优先级', '备注'].map((h) => (_jsx("th", { className: "px-3 py-2 text-left text-xs font-semibold text-text-secondary border-b border-border", children: h }, h))) }) }), _jsx("tbody", { children: preview.rows.map((row, i) => (_jsxs("tr", { className: "border-b border-border-light", children: [_jsx("td", { className: "px-3 py-2", children: row.customerCode }), _jsx("td", { className: "px-3 py-2", children: row.warehouseCode }), _jsx("td", { className: "px-3 py-2", children: row.skuCode }), _jsx("td", { className: "px-3 py-2", children: row.priority }), _jsx("td", { className: "px-3 py-2 text-text-muted", children: row.remark ?? '—' })] }, i))) })] }) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setStep('upload'), ...reviewTarget('list.import.btn.cancel', '取消'), children: "\u4E0A\u4E00\u6B65" }), _jsx(Button, { variant: "primary", icon: "fas fa-check", onClick: handleConfirmCreate, ...reviewTarget('list.import.btn.confirm-create', '确认创建'), children: "\u786E\u8BA4\u521B\u5EFA" })] })] })), toastMessage && _jsx(Toast, { message: toastMessage })] }));
}
