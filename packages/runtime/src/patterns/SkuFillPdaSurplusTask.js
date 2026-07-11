import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { MobileDeviceFrame, Toast, useToast } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { reviewTarget } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
import { SurplusReadonlySections } from './SkuFillPdaSurplusReadonly';
import { extractSurplusTaskContext, isReadonlySurplusStatus } from './skuFillPdaSurplusUtils';
export function SkuFillPdaSurplusTask({ spec, status, rowDetail, listPageId, reviewPrefix, }) {
    const flow = useFlowNav();
    const readonly = isReadonlySurplusStatus(status);
    const ctx = useMemo(() => extractSurplusTaskContext(spec, rowDetail), [spec, rowDetail]);
    const { toastMessage, showToast } = useToast(1800);
    const [rfidMode, setRfidMode] = useState('scan');
    const [scanInput, setScanInput] = useState('');
    const [rfidInStock, setRfidInStock] = useState(() => new Set());
    const [rfidNotInStock, setRfidNotInStock] = useState(() => new Set());
    const goBack = () => {
        if (listPageId)
            flow?.navigate(listPageId);
    };
    const pendingRfid = ctx.catalog.filter((rfid) => !rfidInStock.has(rfid) && !rfidNotInStock.has(rfid));
    const completedRfid = ctx.catalog.filter((rfid) => rfidInStock.has(rfid) || rfidNotInStock.has(rfid));
    const toggleRfid = (rfid, target) => {
        if (target === 'in') {
            setRfidInStock((prev) => {
                const next = new Set(prev);
                if (next.has(rfid))
                    next.delete(rfid);
                else
                    next.add(rfid);
                return next;
            });
            setRfidNotInStock((prev) => {
                const next = new Set(prev);
                next.delete(rfid);
                return next;
            });
            return;
        }
        setRfidNotInStock((prev) => {
            const next = new Set(prev);
            if (next.has(rfid))
                next.delete(rfid);
            else
                next.add(rfid);
            return next;
        });
        setRfidInStock((prev) => {
            const next = new Set(prev);
            next.delete(rfid);
            return next;
        });
    };
    const applyScanInput = () => {
        const scanned = scanInput
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
        if (!scanned.length)
            return;
        setRfidInStock((prev) => {
            const next = new Set(prev);
            scanned.forEach((code) => {
                if (ctx.catalog.includes(code))
                    next.add(code);
            });
            return next;
        });
        setRfidNotInStock((prev) => {
            const next = new Set(prev);
            scanned.forEach((code) => next.delete(code));
            return next;
        });
        showToast('已按扫描结果更新在库 RFID');
    };
    const formActions = readonly
        ? spec.formActions?.filter((a) => a.label === '返回') ?? [{ label: '返回', variant: 'secondary' }]
        : spec.formActions ?? [];
    return (_jsx(MobileDeviceFrame, { children: _jsxs("div", { className: "relative flex flex-col flex-1 min-h-0 bg-surface", children: [_jsxs("header", { className: "shrink-0 bg-primary text-white px-3 py-2.5 border-b-2 border-accent", children: [listPageId ? (_jsxs("button", { type: "button", className: "flex items-center gap-1 text-[11px] text-white/80 mb-1 -ml-0.5", onClick: goBack, ...reviewTarget(`${reviewPrefix}.back`, '返回列表'), children: [_jsx(FaIcon, { className: "fas fa-chevron-left text-[10px]" }), "\u8FD4\u56DE\u5217\u8868"] })) : null, _jsx("h1", { className: "text-[15px] font-semibold leading-tight truncate", ...reviewTarget(`${reviewPrefix}.title`, ctx.sku), children: rowDetail?.title ?? spec.title }), _jsxs("p", { className: "text-[11px] text-white/75 mt-0.5 truncate", children: [ctx.sku, " \u00B7 \u5E93\u4F4D ", ctx.location, " \u00B7 \u6258\u76D8 ", ctx.pallet] })] }), _jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3", children: [ctx.rejectReason && !readonly ? (_jsxs("div", { className: "rounded-lg border border-red-200 bg-red-50 px-3 py-2.5", ...reviewTarget(`${reviewPrefix}.info.驳回原因`, '驳回原因'), children: [_jsx("p", { className: "text-[11px] font-bold text-red-800 mb-0.5", children: "\u9A73\u56DE\u539F\u56E0" }), _jsx("p", { className: "text-xs text-red-900/90 leading-relaxed", children: ctx.rejectReason })] })) : null, readonly ? (_jsx(SurplusReadonlySections, { sections: rowDetail?.sections ?? [], reviewPrefix: reviewPrefix })) : (_jsxs(_Fragment, { children: [ctx.logicGuide ? (_jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "\u5904\u7406\u903B\u8F91" }), _jsx("p", { className: "text-xs text-text-secondary whitespace-pre-wrap leading-relaxed", children: ctx.logicGuide })] })) : null, ctx.interactionGuide ? (_jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "\u5BF9\u7167\u4EA4\u4E92" }), _jsx("p", { className: "text-xs text-text-secondary whitespace-pre-wrap leading-relaxed", children: ctx.interactionGuide })] })) : null, _jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", ...reviewTarget(`${reviewPrefix}.field.rfidSelectMode`, 'RFID 选择模式'), children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "RFID \u64CD\u4F5C\u6A21\u5F0F" }), _jsx("div", { className: "flex gap-2", children: ['scan', 'select'].map((mode) => (_jsx("button", { type: "button", className: `px-2 py-1 rounded text-xs font-semibold border ${rfidMode === mode
                                                    ? 'bg-accent/10 text-accent border-accent/30'
                                                    : 'bg-light-bg text-text-secondary border-border'}`, onClick: () => setRfidMode(mode), children: mode === 'scan' ? '扫描模式' : '点选模式' }, mode))) }), rfidMode === 'scan' ? (_jsxs("div", { className: "mt-2 space-y-2", children: [_jsx("textarea", { className: "w-full min-h-16 text-xs border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/30", placeholder: "\u6BCF\u884C\u4E00\u4E2A RFID \u7F16\u7801\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u6A21\u62DF\u626B\u7801\u5165\u5E93", value: scanInput, onChange: (e) => setScanInput(e.target.value) }), _jsx("button", { type: "button", className: "w-full h-8 rounded-md bg-accent text-white text-xs font-semibold", onClick: applyScanInput, children: "\u5E94\u7528\u626B\u63CF\u7ED3\u679C" })] })) : null] }), _jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "\u5F85\u64CD\u4F5C RFID \u5217\u8868" }), _jsx("div", { className: "space-y-1.5", children: pendingRfid.map((rfid) => (_jsxs("div", { className: "flex items-center justify-between rounded border border-border px-2 py-1.5 text-xs", children: [_jsx("span", { className: "font-mono text-text-secondary", children: rfid }), rfidMode === 'select' ? (_jsxs("div", { className: "flex gap-1", children: [_jsx("button", { type: "button", className: "px-1.5 py-0.5 rounded border border-green-300 text-green-700", onClick: () => toggleRfid(rfid, 'in'), children: "\u5728\u5E93" }), _jsx("button", { type: "button", className: "px-1.5 py-0.5 rounded border border-amber-300 text-amber-700", onClick: () => toggleRfid(rfid, 'out'), children: "\u4E0D\u5728\u5E93" })] })) : (_jsx("span", { className: "text-amber-700 font-medium", children: "\u5F85\u786E\u8BA4" }))] }, rfid))) })] }), _jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "\u5DF2\u5B8C\u6210 RFID \u5217\u8868" }), _jsx("div", { className: "space-y-1.5", children: completedRfid.map((rfid) => (_jsxs("div", { className: "flex items-center justify-between rounded border border-green-200 bg-green-50 px-2 py-1.5 text-xs", children: [_jsx("span", { className: `font-mono ${rfidNotInStock.has(rfid) ? 'text-amber-900' : 'text-green-900'}`, children: rfid }), _jsx("span", { className: `font-medium ${rfidNotInStock.has(rfid) ? 'text-amber-700' : 'text-green-700'}`, children: rfidNotInStock.has(rfid) ? '已标记不在库' : '已确认在库' })] }, rfid))) })] })] }))] }), formActions.length ? (_jsx("div", { className: "shrink-0 border-t border-border-light bg-white px-3 py-3 flex gap-2 safe-area-pb", ...reviewTarget(`${reviewPrefix}.actions`, '底部操作'), children: formActions.map((action) => {
                        const isPrimary = action.variant === 'primary';
                        return (_jsx("button", { type: "button", className: `flex-1 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${isPrimary
                                ? 'bg-accent text-white hover:bg-accent/90'
                                : 'bg-white text-primary border border-border hover:bg-light-bg'}`, onClick: () => {
                                if (action.label === '返回')
                                    goBack();
                                else
                                    showToast('提交成功，盘点结果已记录');
                            }, ...reviewTarget(`${reviewPrefix}.btn.${action.label}`, action.label), children: action.label }, action.label));
                    }) })) : null, toastMessage ? _jsx(Toast, { message: toastMessage }) : null] }) }));
}
