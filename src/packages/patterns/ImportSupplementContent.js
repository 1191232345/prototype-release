import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Card } from '@prototype/ui';
import { Toast } from '../../app/Toast';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
const DEFAULT_THRESHOLD = 1000;
export function ImportSupplementContent({ tableSpec, asyncThreshold = DEFAULT_THRESHOLD, filePresets, onCancel, onComplete, }) {
    const [step, setStep] = useState('upload');
    const [fileName, setFileName] = useState('');
    const [detectedRows, setDetectedRows] = useState(0);
    const [priceCards, setPriceCards] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const presets = filePresets ??
        [{ fileName: tableSpec.fileName ?? 'carrier_bill.xlsx', totalRows: tableSpec.totalRows }];
    const initPriceCards = () => {
        const initial = {};
        tableSpec.rows.forEach((row) => {
            initial[row.customerCode] = row.defaultPriceCard;
        });
        return initial;
    };
    const handleFileSelect = (preset) => {
        setFileName(preset.fileName);
        setDetectedRows(preset.totalRows);
    };
    const handleConfirmImport = () => {
        if (!fileName.trim()) {
            setToastMessage('请先选择承运商账单文件');
            setTimeout(() => setToastMessage(null), 2500);
            return;
        }
        if (detectedRows > asyncThreshold) {
            setToastMessage(`文件共 ${detectedRows} 条，已超过 ${asyncThreshold} 条，已添加到异步任务`);
            setTimeout(() => {
                setToastMessage(null);
                onComplete('async');
            }, 2000);
            return;
        }
        setPriceCards(initPriceCards());
        setStep('configure');
    };
    const handleConfirmCalc = () => {
        const missing = tableSpec.rows.find((r) => !priceCards[r.customerCode]);
        if (missing) {
            setToastMessage(`请为客户 ${missing.customerCode} 选择价卡`);
            setTimeout(() => setToastMessage(null), 2500);
            return;
        }
        setToastMessage('差价计算完成，已生成补收记录');
        setTimeout(() => {
            setToastMessage(null);
            onComplete('sync');
        }, 1500);
    };
    const handleReupload = () => {
        setStep('upload');
        setFileName('');
        setDetectedRows(0);
        setPriceCards({});
    };
    return (_jsxs(_Fragment, { children: [_jsx(StepIndicator, { step: step }), _jsxs("div", { className: "space-y-6 mt-4", children: [step === 'upload' && (_jsxs(Card, { title: "\u6B65\u9AA4 1 \u00B7 \u4E0A\u4F20\u6587\u4EF6", icon: "fas fa-file-excel", children: [_jsx(UploadZone, { fileName: fileName, rowCount: detectedRows, asyncThreshold: asyncThreshold }), _jsx("p", { className: "text-xs text-text-muted mt-3", children: "\u6A21\u677F\u5B57\u6BB5\uFF1A\u8FD0\u5355\u53F7\u3001\u5BA2\u6237\u4EE3\u7801\u3001\u957F(cm)\u3001\u5BBD(cm)\u3001\u9AD8(cm)\u3001\u91CD\u91CF(kg)\u3001\u627F\u8FD0\u5546\u91D1\u989D" }), _jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u9009\u62E9\u6587\u4EF6\u540E\u8BC6\u522B\u6761\u6570\uFF0C\u70B9\u51FB\u300C\u786E\u8BA4\u5BFC\u5165\u300D\u8FDB\u5165\u4E0B\u4E00\u6B65\uFF1B\u8D85\u8FC7 ", asyncThreshold, " \u6761\u5C06\u63D0\u4EA4\u5F02\u6B65\u4EFB\u52A1"] }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: presets.map((preset) => (_jsxs("button", { type: "button", className: "px-3 py-1.5 text-sm rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-colors", onClick: () => handleFileSelect(preset), ...reviewTarget(`list.import.file-preset.${preset.totalRows}`), children: [_jsx(FaIcon, { className: "fas fa-file-excel mr-1 text-green-600" }), preset.fileName, _jsxs("span", { className: "text-text-muted ml-1", children: ["(", preset.totalRows, " \u6761)"] })] }, preset.fileName))) })] })), step === 'configure' && (_jsxs(_Fragment, { children: [_jsx(FileSummary, { fileName: fileName, totalRows: detectedRows, customerCount: tableSpec.rows.length, onReupload: handleReupload }), _jsx(CustomerPriceCardTable, { table: tableSpec, priceCards: priceCards, onChange: (code, value) => setPriceCards((prev) => ({ ...prev, [code]: value })) })] })), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "secondary", icon: "fas fa-times", onClick: onCancel, ...reviewTarget('list.import.btn.cancel'), children: "\u53D6\u6D88" }), step === 'upload' && (_jsx(Button, { variant: "primary", icon: "fas fa-check", onClick: handleConfirmImport, disabled: !fileName, ...reviewTarget('list.import.btn.confirm-import'), children: "\u786E\u8BA4\u5BFC\u5165" })), step === 'configure' && (_jsx(Button, { variant: "primary", icon: "fas fa-calculator", onClick: handleConfirmCalc, ...reviewTarget('list.import.btn.confirm-calc'), children: "\u786E\u8BA4\u5E76\u8BA1\u7B97\u5DEE\u4EF7" }))] })] }), toastMessage && _jsx(Toast, { message: toastMessage })] }));
}
function StepIndicator({ step }) {
    const steps = [
        { key: 'upload', label: '上传文件' },
        { key: 'configure', label: '配置价卡' },
        { key: 'done', label: '计算差价' },
    ];
    const activeIdx = step === 'upload' ? 0 : 1;
    return (_jsx("div", { className: "flex items-center gap-2 text-sm flex-wrap", ...reviewTarget('list.import.steps'), children: steps.map((s, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [i > 0 && _jsx("span", { className: "text-text-muted", children: "\u2192" }), _jsxs("span", { className: `px-3 py-1 rounded-full ${i <= activeIdx ? 'bg-primary/10 text-primary font-medium' : 'bg-light-bg text-text-muted'}`, children: [i + 1, ". ", s.label] })] }, s.key))) }));
}
function UploadZone({ fileName, rowCount, asyncThreshold, }) {
    const isAsync = rowCount > asyncThreshold;
    return (_jsxs("div", { className: "border-2 border-dashed border-border rounded-lg p-8 text-center", ...reviewTarget('list.import.file'), children: [_jsx(FaIcon, { className: "fas fa-cloud-upload-alt text-4xl text-text-muted mb-2" }), fileName ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-sm text-primary font-medium", children: [_jsx(FaIcon, { className: "fas fa-file-excel mr-1" }), fileName] }), _jsxs("p", { className: "text-xs text-text-muted mt-1", children: ["\u5DF2\u8BC6\u522B ", rowCount, " \u6761\u6570\u636E"] }), isAsync && (_jsxs("p", { className: "text-xs text-amber-600 mt-2", children: [_jsx(FaIcon, { className: "fas fa-info-circle mr-1" }), "\u8D85\u8FC7 ", asyncThreshold, " \u6761\uFF0C\u786E\u8BA4\u540E\u5C06\u63D0\u4EA4\u5F02\u6B65\u4EFB\u52A1"] }))] })) : (_jsx("p", { className: "text-sm text-text-secondary", children: "\u70B9\u51FB\u4E0B\u65B9\u6A21\u62DF\u6587\u4EF6\uFF0C\u786E\u8BA4\u540E\u8FDB\u5165\u4E0B\u4E00\u6B65" }))] }));
}
function FileSummary({ fileName, totalRows, customerCount, onReupload, }) {
    return (_jsxs(Card, { title: "\u6B65\u9AA4 2 \u00B7 \u6587\u4EF6\u6982\u89C8", icon: "fas fa-list-check", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 text-sm", ...reviewTarget('list.import.summary'), children: [_jsx(SummaryItem, { label: "\u6587\u4EF6\u540D", value: fileName }), _jsx(SummaryItem, { label: "\u603B\u884C\u6570", value: `${totalRows} 行` }), _jsx(SummaryItem, { label: "\u5BA2\u6237\u4EE3\u7801\u6570", value: `${customerCount} 个` })] }), _jsx("p", { className: "text-xs text-text-muted mt-3", children: "\u8BF7\u786E\u8BA4\u5404\u5BA2\u6237\u4EF7\u5361\u65E0\u8BEF\u540E\u518D\u8BA1\u7B97\u5DEE\u4EF7\u3002" }), _jsx("button", { type: "button", className: "text-xs text-accent mt-2 hover:underline", onClick: onReupload, children: "\u91CD\u65B0\u9009\u62E9\u6587\u4EF6" })] }));
}
function SummaryItem({ label, value }) {
    return (_jsxs("div", { children: [_jsx("div", { className: "text-text-muted text-xs", children: label }), _jsx("div", { className: "font-medium text-dark mt-0.5", children: value })] }));
}
function CustomerPriceCardTable({ table, priceCards, onChange, }) {
    return (_jsx(Card, { title: "\u5BA2\u6237\u4EF7\u5361\u914D\u7F6E", icon: "fas fa-file-invoice-dollar", children: _jsx("div", { className: "overflow-x-auto", ...reviewTarget('list.import.price-card-table'), children: _jsxs("table", { className: "w-full min-w-[560px]", children: [_jsx("thead", { className: "bg-light-bg", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-text-secondary", children: "\u5BA2\u6237\u4EE3\u7801" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-text-secondary", children: "\u5BA2\u6237\u540D\u79F0" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-text-secondary", children: "\u6D89\u53CA\u884C\u6570" }), _jsx("th", { className: "px-4 py-2 text-left text-xs font-semibold text-text-secondary", children: "\u4EF7\u5361" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: table.rows.map((row) => (_jsxs("tr", { className: "hover:bg-hover", children: [_jsx("td", { className: "px-4 py-3 text-sm font-medium", children: row.customerCode }), _jsx("td", { className: "px-4 py-3 text-sm", children: row.customerName }), _jsxs("td", { className: "px-4 py-3 text-sm text-text-secondary", children: [row.rowCount, " \u884C"] }), _jsx("td", { className: "px-4 py-3", children: _jsx("select", { className: "form-input text-sm min-w-[200px]", value: priceCards[row.customerCode] ?? row.defaultPriceCard, onChange: (e) => onChange(row.customerCode, e.target.value), ...reviewTarget(`list.import.priceCard.${row.customerCode}`), children: table.priceCardOptions.map((o) => (_jsxs("option", { value: o.value, children: [o.label, o.value === row.defaultPriceCard ? '（系统推荐）' : ''] }, o.value))) }) })] }, row.customerCode))) })] }) }) }));
}
