import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, PrototypeModal } from '@prototype/ui';
import { reviewTarget } from '../../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function ZonePriceTableEditor({ table }) {
    const { zones, weightSegments, prices, currency = 'USD', priceUnit = 'lb' } = table;
    const [segments, setSegments] = useState(weightSegments);
    const [priceData, setPriceData] = useState(prices);
    const [showImportModal, setShowImportModal] = useState(false);
    const handleAddSegment = () => {
        const lastSegment = segments[segments.length - 1];
        const newStart = lastSegment ? lastSegment.end : 0;
        const newEnd = newStart + 1;
        const newSegment = { start: newStart, end: newEnd, unit: priceUnit };
        setSegments([...segments, newSegment]);
        const newPriceData = { ...priceData };
        zones.forEach((zone) => {
            newPriceData[zone] = [...(newPriceData[zone] || []), 0];
        });
        setPriceData(newPriceData);
    };
    const handleDeleteSegment = (index) => {
        const newSegments = segments.filter((_, i) => i !== index);
        for (let i = index; i < newSegments.length; i++) {
            if (i === 0) {
                newSegments[i].start = 0;
            }
            else {
                newSegments[i].start = newSegments[i - 1].end;
            }
        }
        setSegments(newSegments);
        const newPriceData = { ...priceData };
        zones.forEach((zone) => {
            newPriceData[zone] = (newPriceData[zone] || []).filter((_, i) => i !== index);
        });
        setPriceData(newPriceData);
    };
    const handleEndWeightChange = (index, newEnd) => {
        const newSegments = [...segments];
        newSegments[index].end = newEnd;
        if (index < newSegments.length - 1) {
            newSegments[index + 1].start = newEnd;
        }
        setSegments(newSegments);
    };
    const handlePriceChange = (zone, rowIndex, value) => {
        const newPriceData = { ...priceData };
        if (!newPriceData[zone]) {
            newPriceData[zone] = [];
        }
        newPriceData[zone][rowIndex] = value;
        setPriceData(newPriceData);
    };
    return (_jsxs("div", { className: "overflow-x-auto mt-4", children: [_jsxs("div", { className: "mb-4 flex gap-2", children: [_jsxs("button", { className: "px-3 py-1.5 bg-accent text-white rounded-lg text-sm font-medium", onClick: handleAddSegment, ...reviewTarget('form.zone.btn.add', '添加重量段'), children: [_jsx(FaIcon, { className: "fas fa-plus mr-1" }), " \u6DFB\u52A0\u91CD\u91CF\u6BB5"] }), _jsxs("button", { className: "px-3 py-1.5 bg-light-bg text-text-secondary rounded-lg text-sm font-medium border border-border", onClick: () => setShowImportModal(true), ...reviewTarget('form.zone.btn.import', '导入分区报价'), children: [_jsx(FaIcon, { className: "fas fa-upload mr-1" }), " \u5BFC\u5165\u5206\u533A\u62A5\u4EF7"] }), _jsxs("button", { className: "px-3 py-1.5 bg-light-bg text-text-secondary rounded-lg text-sm font-medium border border-border", ...reviewTarget('form.zone.btn.export', '导出表格'), children: [_jsx(FaIcon, { className: "fas fa-download mr-1" }), " \u5BFC\u51FA\u8868\u683C"] })] }), _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-light-bg", children: [_jsxs("th", { className: "border border-border px-3 py-2 text-center text-sm font-semibold text-primary w-20", children: ["\u8D77 (", priceUnit, ")"] }), _jsxs("th", { className: "border border-border px-3 py-2 text-center text-sm font-semibold text-primary w-20", children: ["\u6B62 (", priceUnit, ")"] }), zones.map((zone) => (_jsx("th", { className: "border border-border px-3 py-2 text-center text-sm font-semibold text-primary", children: zone }, zone))), _jsx("th", { className: "border border-border px-3 py-2 text-center text-sm font-semibold text-primary w-12", children: "\u64CD\u4F5C" })] }) }), _jsx("tbody", { children: segments.map((segment, rowIndex) => (_jsxs("tr", { className: "bg-white hover:bg-light-bg transition-colors", children: [_jsx("td", { className: "border border-border px-3 py-2 text-center text-sm text-dark", children: _jsx("span", { className: "text-text-muted", children: segment.start }) }), _jsx("td", { className: "border border-border px-3 py-2 text-center", children: _jsx("input", { type: "number", value: segment.end, step: "0.01", onChange: (e) => handleEndWeightChange(rowIndex, parseFloat(e.target.value) || 0), className: "w-16 text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent" }) }), zones.map((zone) => (_jsx("td", { className: "border border-border px-3 py-2 text-center", children: _jsx("input", { type: "number", value: priceData[zone]?.[rowIndex] ?? 0, step: "0.01", onChange: (e) => handlePriceChange(zone, rowIndex, parseFloat(e.target.value) || 0), className: "w-20 text-center border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-accent" }) }, zone))), _jsx("td", { className: "border border-border px-3 py-2 text-center", children: _jsx("button", { className: "text-red-500 hover:text-red-700 text-sm", onClick: () => handleDeleteSegment(rowIndex), children: _jsx(FaIcon, { className: "fas fa-trash" }) }) })] }, rowIndex))) })] }), _jsxs("div", { className: "mt-2 text-xs text-text-muted", children: ["\u5355\u4EF7\u5355\u4F4D\uFF1A", currency, "/", priceUnit, " \u00B7 \u300C\u8D77\u300D\u81EA\u52A8\u7EE7\u627F\u4E0A\u4E00\u884C\u300C\u6B62\u300D\uFF0C\u53EA\u5141\u8BB8\u7F16\u8F91\u300C\u6B62\u300D"] }), showImportModal && (_jsxs(PrototypeModal, { onClose: () => setShowImportModal(false), title: "\u5BFC\u5165\u5206\u533A\u62A5\u4EF7", children: [_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm text-text-secondary mb-2", children: "\u8BF7\u4E0A\u4F20\u5305\u542B\u5206\u533A\u62A5\u4EF7\u6570\u636E\u7684 Excel \u6216 CSV \u6587\u4EF6" }), _jsxs("div", { className: "border-2 border-dashed border-border rounded-lg p-8 text-center", ...reviewTarget('form.zone.import.file', '文件上传区'), children: [_jsx(FaIcon, { className: "fas fa-cloud-upload-alt text-4xl text-text-muted mb-2" }), _jsx("p", { className: "text-sm text-text-secondary", children: "\u70B9\u51FB\u6216\u62D6\u62FD\u6587\u4EF6\u5230\u6B64\u5904\u4E0A\u4F20" }), _jsx("p", { className: "text-xs text-text-muted mt-1", children: "\u652F\u6301 .xlsx, .csv \u683C\u5F0F" })] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowImportModal(false), ...reviewTarget('form.zone.import.btn.cancel', '取消'), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", ...reviewTarget('form.zone.import.btn.confirm', '开始导入'), children: "\u5F00\u59CB\u5BFC\u5165" })] })] }))] }));
}
