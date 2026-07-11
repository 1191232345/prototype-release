import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { MobileDeviceFrame, Toast, useToast } from '@prototype/ui';
import { useFlowNav } from '@prototype/renderer/FlowContext';
import { reviewTarget } from '@prototype/review';
import { SkuFillPdaSurplusTask } from './SkuFillPdaSurplusTask';
import { FaIcon } from '@prototype/ui/Icon';
export function SkuFillPdaTaskPattern({ spec }) {
    const flow = useFlowNav();
    const reviewPrefix = flow?.currentPage === 'task' ? 'form' : 'pda';
    const rowId = flow?.params?.rowId ?? '';
    const detail = (rowId ? spec.details?.[rowId] : undefined) ?? spec.detail;
    const hasSkuFormDetail = detail?.sections?.some((s) => s.layout === 'pda-sku-form');
    const isSurplusInventoryTask = Boolean(spec.sections?.length) && !hasSkuFormDetail;
    const listPageId = flow?.pageLabels?.list !== undefined
        ? 'list'
        : flow?.pageLabels?.['pda-list'] !== undefined
            ? 'pda-list'
            : null;
    const { toastMessage, showToast } = useToast(1800);
    const [instructionSheet, setInstructionSheet] = useState(null);
    const [rfidMode, setRfidMode] = useState('scan');
    const [scanInput, setScanInput] = useState('');
    const [rfidInStock, setRfidInStock] = useState(() => new Set());
    const [rfidNotInStock, setRfidNotInStock] = useState(() => new Set());
    const goBack = () => {
        if (listPageId)
            flow?.navigate(listPageId);
    };
    const handleAction = (action, label) => {
        if (action === 'saveDraft') {
            showToast('已暂存，SKU 信息已保存');
            return;
        }
        if (action === 'submit') {
            showToast('提交成功，工单已进入待客服审核');
            return;
        }
        showToast(label ? `${label}（原型演示）` : '操作成功');
    };
    if (isSurplusInventoryTask) {
        return (_jsx(SkuFillPdaSurplusTask, { spec: spec, rowId: rowId, status: flow?.params?.status ?? '', rowDetail: rowId ? spec.details?.[rowId] : undefined, listPageId: listPageId, reviewPrefix: reviewPrefix }));
    }
    if (!detail) {
        const preview = extractRfidPreview(spec);
        const pendingRfid = preview.catalog.filter((rfid) => !rfidInStock.has(rfid) && !rfidNotInStock.has(rfid));
        const completedRfid = preview.catalog.filter((rfid) => rfidInStock.has(rfid) || rfidNotInStock.has(rfid));
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
                    if (preview.catalog.includes(code))
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
        return (_jsx(MobileDeviceFrame, { children: _jsxs("div", { className: "relative flex flex-col flex-1 min-h-0 bg-surface", children: [_jsxs("header", { className: "shrink-0 bg-primary text-white px-3 py-2.5 border-b-2 border-accent", children: [listPageId ? (_jsxs("button", { type: "button", className: "flex items-center gap-1 text-[11px] text-white/80 mb-1 -ml-0.5", onClick: goBack, children: [_jsx(FaIcon, { className: "fas fa-chevron-left text-[10px]" }), "\u8FD4\u56DE\u5217\u8868"] })) : null, _jsx("h1", { className: "text-[15px] font-semibold leading-tight truncate", children: preview.sku }), _jsx("p", { className: "text-[11px] text-white/75 mt-0.5 truncate", children: preview.meta })] }), _jsxs("div", { className: "flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 space-y-3", children: [_jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "RFID \u64CD\u4F5C\u6A21\u5F0F" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", className: `px-2 py-1 rounded text-xs font-semibold border ${rfidMode === 'scan'
                                                    ? 'bg-accent/10 text-accent border-accent/30'
                                                    : 'bg-light-bg text-text-secondary border-border'}`, onClick: () => setRfidMode('scan'), children: "\u626B\u63CF\u6A21\u5F0F" }), _jsx("button", { type: "button", className: `px-2 py-1 rounded text-xs font-semibold border ${rfidMode === 'select'
                                                    ? 'bg-accent/10 text-accent border-accent/30'
                                                    : 'bg-light-bg text-text-secondary border-border'}`, onClick: () => setRfidMode('select'), children: "\u70B9\u9009\u6A21\u5F0F" })] }), rfidMode === 'scan' ? (_jsxs("div", { className: "mt-2 space-y-2", children: [_jsx("textarea", { className: "w-full min-h-16 text-xs border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/30", placeholder: "\u6BCF\u884C\u4E00\u4E2A RFID \u7F16\u7801\uFF0C\u70B9\u51FB\u4E0B\u65B9\u6309\u94AE\u6A21\u62DF\u626B\u7801\u5165\u5E93", value: scanInput, onChange: (e) => setScanInput(e.target.value) }), _jsx("button", { type: "button", className: "w-full h-8 rounded-md bg-accent text-white text-xs font-semibold", onClick: applyScanInput, children: "\u5E94\u7528\u626B\u63CF\u7ED3\u679C" })] })) : null] }), _jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "\u5F85\u64CD\u4F5C RFID \u5217\u8868" }), _jsx("div", { className: "space-y-1.5", children: pendingRfid.map((rfid) => (_jsxs("div", { className: "flex items-center justify-between rounded border border-border px-2 py-1.5 text-xs", children: [_jsx("span", { className: "font-mono text-text-secondary", children: rfid }), rfidMode === 'select' ? (_jsxs("div", { className: "flex gap-1", children: [_jsx("button", { type: "button", className: "px-1.5 py-0.5 rounded border border-green-300 text-green-700", onClick: () => toggleRfid(rfid, 'in'), children: "\u5728\u5E93" }), _jsx("button", { type: "button", className: "px-1.5 py-0.5 rounded border border-amber-300 text-amber-700", onClick: () => toggleRfid(rfid, 'out'), children: "\u4E0D\u5728\u5E93" })] })) : (_jsx("span", { className: "text-amber-700 font-medium", children: "\u5F85\u786E\u8BA4" }))] }, rfid))) })] }), _jsxs("section", { className: "rounded-lg border border-border-light bg-white p-3", children: [_jsx("h2", { className: "text-sm font-semibold text-primary mb-2", children: "\u5DF2\u5B8C\u6210 RFID \u5217\u8868" }), _jsx("div", { className: "space-y-1.5", children: completedRfid.map((rfid) => (_jsxs("div", { className: "flex items-center justify-between rounded border border-green-200 bg-green-50 px-2 py-1.5 text-xs", children: [_jsx("span", { className: `font-mono ${rfidNotInStock.has(rfid) ? 'text-amber-900' : 'text-green-900'}`, children: rfid }), _jsx("span", { className: `font-medium ${rfidNotInStock.has(rfid) ? 'text-amber-700' : 'text-green-700'}`, children: rfidNotInStock.has(rfid) ? '已标记不在库' : '已确认在库' })] }, rfid))) })] })] })] }) }));
    }
    const infoSection = detail.sections.find((s) => s.layout === 'grid' && s.items);
    const formSections = detail.sections.filter((s) => s.layout === 'pda-sku-form');
    const primarySku = formSections[0]?.skuRows?.[0];
    const orderMeta = infoSection?.items ? extractOrderMeta(infoSection.items) : null;
    const returnReason = infoSection?.items?.find((i) => i.label === '退回原因')?.value;
    const showFormActions = (spec.formActions?.length ?? 0) > 0 &&
        formSections.some((section) => section.editable !== false);
    const headerTitle = primarySku?.skuName ?? orderMeta?.orderNo ?? detail.title ?? spec.title;
    const headerSubtitle = [
        primarySku?.skuCode,
        orderMeta?.orderNo ? `工单 ${orderMeta.orderNo}` : '',
    ].filter(Boolean).join(' · ');
    return (_jsx(MobileDeviceFrame, { children: _jsxs("div", { className: "relative flex flex-col flex-1 min-h-0", children: [_jsxs("div", { className: "flex flex-col flex-1 min-h-0 bg-surface", children: [_jsxs("header", { className: "shrink-0 bg-primary text-white px-3 py-2.5 border-b-2 border-accent", ...reviewTarget(`${reviewPrefix}.title`, headerTitle), children: [listPageId ? (_jsxs("button", { type: "button", className: "flex items-center gap-1 text-[11px] text-white/80 mb-1 -ml-0.5", onClick: goBack, ...reviewTarget(`${reviewPrefix}.back`, '返回列表'), children: [_jsx(FaIcon, { className: "fas fa-chevron-left text-[10px]" }), "\u8FD4\u56DE\u5217\u8868"] })) : (_jsx("p", { className: "text-[10px] text-white/65 font-medium tracking-wide mb-0.5", children: spec.header?.brand ?? 'ELSA PDA' })), _jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [_jsx("h1", { className: "text-[15px] font-semibold leading-tight truncate flex-1", children: headerTitle }), orderMeta?.priority ? (_jsx("span", { className: `shrink-0 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${orderMeta.priorityClass}`, children: orderMeta.priority })) : null] }), headerSubtitle ? (_jsx("p", { className: "text-[11px] text-white/75 mt-0.5 truncate", children: headerSubtitle })) : null] }), _jsx("div", { className: "flex-1 min-h-0 overflow-y-auto overscroll-contain", children: _jsxs("div", { className: "p-3 space-y-3", children: [returnReason ? (_jsxs("div", { className: "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5", ...reviewTarget(`${reviewPrefix}.info.退回原因`, '退回原因'), children: [_jsx("p", { className: "text-[11px] font-semibold text-amber-900 mb-0.5", children: "\u9000\u56DE\u539F\u56E0" }), _jsx("p", { className: "text-xs text-amber-900/90 leading-relaxed", children: returnReason })] })) : null, formSections.map((section) => (_jsx(PdaSkuSectionBlock, { section: section, reviewPrefix: reviewPrefix, directEntry: (section.skuRows?.length ?? 0) === 1, onShowInstruction: (row) => setInstructionSheet({
                                            skuCode: row.skuCode,
                                            skuName: row.skuName,
                                            text: row.fillInstruction ?? '',
                                        }) }, section.title)))] }) }), showFormActions ? (_jsx("div", { className: "shrink-0 border-t border-border-light bg-white px-3 py-3 flex gap-2 safe-area-pb", ...reviewTarget(`${reviewPrefix}.actions`, '底部操作'), children: spec.formActions.map((action) => {
                                const actionKey = action.action ?? action.label;
                                const isPrimary = action.variant === 'primary';
                                return (_jsxs("button", { type: "button", className: `flex-1 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${isPrimary
                                        ? 'bg-accent text-white hover:bg-accent/90'
                                        : 'bg-white text-primary border border-border hover:bg-light-bg'}`, onClick: () => handleAction(action.action, action.label), ...reviewTarget(`${reviewPrefix}.btn.${actionKey}`, action.label), children: [action.icon ? _jsx(FaIcon, { className: `${action.icon} mr-1.5` }) : null, action.label] }, actionKey));
                            }) })) : null] }), instructionSheet ? (_jsx(FillInstructionSheet, { skuCode: instructionSheet.skuCode, skuName: instructionSheet.skuName, text: instructionSheet.text, reviewPrefix: reviewPrefix, onClose: () => setInstructionSheet(null) })) : null, toastMessage ? _jsx(Toast, { message: toastMessage }) : null] }) }));
}
function extractOrderMeta(items) {
    const find = (label) => items.find((i) => i.label === label);
    const orderNo = find('工单号')?.value;
    const customer = find('客户代码')?.value;
    const warehouse = find('仓库代码')?.value;
    const priorityItem = find('优先级');
    const priority = priorityItem?.value;
    const priorityTone = priority === '高'
        ? 'bg-red-500/25 text-red-50'
        : priority === '中'
            ? 'bg-amber-500/25 text-amber-50'
            : 'bg-white/15 text-white/90';
    const parts = [warehouse, customer].filter(Boolean);
    return {
        orderNo,
        subtitle: parts.join(' · '),
        priority,
        priorityClass: priorityTone,
    };
}
function extractRfidPreview(spec) {
    const sections = spec.sections ?? [];
    const infoFields = sections[0]?.fields ?? [];
    const allFields = sections.flatMap((section) => section.fields ?? []);
    const sku = infoFields.find((f) => f.id === 'sku')?.defaultValue || spec.title;
    const location = infoFields.find((f) => f.id === 'locationCode')?.defaultValue || '-';
    const pallet = infoFields.find((f) => f.id === 'palletNo')?.defaultValue || '-';
    const catalogField = allFields.find((f) => f.id === 'rfidCatalog');
    const catalog = catalogField?.options?.map((o) => o.value || o.label).filter(Boolean);
    return {
        sku,
        meta: `库位 ${location} · 托盘 ${pallet}`,
        catalog: catalog && catalog.length ? catalog : ['RFID-EPC-DEMO-0001'],
    };
}
function PdaSkuSectionBlock({ section, reviewPrefix, directEntry, onShowInstruction, }) {
    const skuCount = section.skuRows?.length ?? 0;
    return (_jsxs("section", { ...reviewTarget(`${reviewPrefix}.sku-form`, section.title), children: [!directEntry ? (_jsxs("div", { className: "flex items-center justify-between mb-2 px-0.5", children: [_jsxs("h2", { className: "text-sm font-semibold text-primary flex items-center gap-1.5", children: [_jsx(FaIcon, { className: `fas ${section.icon} text-accent text-xs` }), section.title] }), skuCount > 0 ? (_jsxs("span", { className: "text-[10px] text-text-muted font-medium", children: [skuCount, " \u4E2A SKU"] })) : null] })) : null, section.skuRows ? (_jsx(PdaSkuFormList, { rows: section.skuRows, editable: section.editable ?? true, reviewPrefix: reviewPrefix, directEntry: directEntry, onShowInstruction: onShowInstruction })) : null] }));
}
function PdaSkuFormList({ rows, editable, reviewPrefix, directEntry, onShowInstruction, }) {
    const [expanded, setExpanded] = useState(() => rows[0]?.skuCode ?? '');
    if (!rows.length) {
        return _jsx("p", { className: "text-sm text-text-muted", children: "\u6682\u65E0\u5F85\u8865\u5145 SKU" });
    }
    return (_jsx("div", { className: "space-y-2", children: rows.map((row, index) => (_jsx(PdaSkuCard, { row: row, index: index, total: rows.length, editable: editable, directEntry: directEntry, expanded: directEntry || expanded === row.skuCode, onToggle: () => setExpanded((prev) => (prev === row.skuCode ? '' : row.skuCode)), reviewPrefix: reviewPrefix, onShowInstruction: onShowInstruction }, row.skuCode))) }));
}
function PdaSkuCard({ row, index, total, editable, directEntry, expanded, onToggle, reviewPrefix, onShowInstruction, }) {
    const statusLabel = useMemo(() => {
        if (row.submitted)
            return '已提交';
        if (row.length || row.width || row.height || row.weight || (row.images?.length ?? 0) > 0) {
            return '填写中';
        }
        return '待填写';
    }, [row]);
    const statusClass = row.submitted
        ? 'bg-green-100 text-green-800'
        : statusLabel === '填写中'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-gray-100 text-gray-600';
    return (_jsxs("div", { className: "rounded-lg border border-border-light overflow-hidden bg-white", ...reviewTarget(`${reviewPrefix}.sku.${row.skuCode}`, row.skuName), children: [directEntry ? (_jsxs("div", { className: "flex items-center justify-between gap-2 px-3 pt-3 pb-1", children: [_jsx("p", { className: "text-[11px] text-text-muted", children: "\u5C3A\u5BF8 / \u91CD\u91CF / \u56FE\u7247" }), row.fillInstruction ? (_jsx("button", { type: "button", className: "shrink-0 px-2 py-1 text-[11px] font-medium text-accent border border-accent/40 rounded-md hover:bg-accent/5 transition-colors", onClick: () => onShowInstruction(row), ...reviewTarget(`${reviewPrefix}.sku.${row.skuCode}.instruction`, '填写说明'), children: "\u586B\u5199\u8BF4\u660E" })) : null] })) : (_jsxs("div", { className: "flex items-center gap-1 bg-white", children: [_jsxs("button", { type: "button", className: "flex-1 min-w-0 flex items-center gap-2 px-3 py-2.5 text-left hover:bg-light-bg/50 transition-colors", onClick: onToggle, children: [_jsx("span", { className: "w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: index + 1 }), _jsxs("span", { className: "flex-1 min-w-0", children: [_jsx("span", { className: "block text-sm font-semibold text-dark truncate", children: row.skuName }), _jsx("span", { className: "block text-[11px] text-text-muted truncate", children: row.skuCode })] }), _jsx("span", { className: `shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusClass}`, children: statusLabel }), _jsx(FaIcon, { className: `fas fa-chevron-${expanded ? 'up' : 'down'} text-text-muted text-xs shrink-0` })] }), row.fillInstruction ? (_jsx("button", { type: "button", className: "shrink-0 mr-2 px-2 py-1 text-[11px] font-medium text-accent border border-accent/40 rounded-md hover:bg-accent/5 transition-colors", onClick: (e) => {
                            e.stopPropagation();
                            onShowInstruction(row);
                        }, ...reviewTarget(`${reviewPrefix}.sku.${row.skuCode}.instruction`, '填写说明'), children: "\u586B\u5199\u8BF4\u660E" })) : null] })), expanded ? (_jsxs("div", { className: `px-3 pb-3 space-y-3 ${directEntry ? 'pt-1' : 'pt-1 border-t border-border-light bg-light-bg/30'}`, children: [_jsxs("div", { ...reviewTarget(`${reviewPrefix}.sku.${row.skuCode}.dimensions`, '尺寸（长宽高）'), children: [_jsxs("p", { className: "text-[11px] text-text-muted mb-1.5", children: ["\u5C3A\u5BF8 (cm) ", _jsx("span", { className: "text-danger", children: "*" })] }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['长', '宽', '高'].map((label, dimIndex) => {
                                    const field = ['length', 'width', 'height'][dimIndex];
                                    return (_jsxs("label", { className: "block", children: [_jsx("span", { className: "text-[10px] text-text-muted mb-0.5 block", children: label }), editable ? (_jsx("input", { type: "number", min: 0, step: "0.1", defaultValue: String(row[field] ?? ''), placeholder: "0", className: "w-full h-10 px-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" })) : (_jsx("span", { className: "block h-10 px-2 text-sm leading-10 bg-white border border-border rounded-lg", children: row[field] || '—' }))] }, label));
                                }) })] }), _jsxs("div", { ...reviewTarget(`${reviewPrefix}.sku.${row.skuCode}.weight`, '重量'), children: [_jsxs("p", { className: "text-[11px] text-text-muted mb-1.5", children: ["\u91CD\u91CF (kg) ", _jsx("span", { className: "text-danger", children: "*" })] }), editable ? (_jsx("input", { type: "number", min: 0, step: "0.01", defaultValue: row.weight ?? '', placeholder: "0.00", className: "w-full h-10 px-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent/30" })) : (_jsx("span", { className: "block h-10 px-3 text-sm leading-10 bg-white border border-border rounded-lg", children: row.weight || '—' }))] }), _jsx(PdaImageUpload, { images: row.images ?? [], editable: editable, reviewPrefix: reviewPrefix, skuCode: row.skuCode }), total > 1 ? (_jsxs("p", { className: "text-[10px] text-text-muted text-center pt-1", children: ["SKU ", index + 1, " / ", total] })) : null] })) : null] }));
}
function PdaImageUpload({ images, editable, reviewPrefix, skuCode, }) {
    const list = images ?? [];
    return (_jsxs("div", { ...reviewTarget(`${reviewPrefix}.sku.${skuCode}.images`, '图片'), children: [_jsxs("p", { className: "text-[11px] text-text-muted mb-1.5", children: ["\u56FE\u7247 ", _jsx("span", { className: "text-danger", children: "*" }), _jsx("span", { className: "text-text-muted/80 ml-1", children: "\uFF08\u6700\u591A 5 \u5F20\uFF09" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [list.map((img, idx) => (_jsxs("div", { className: "relative w-16 h-16 rounded-lg border border-border bg-light-bg flex items-center justify-center", children: [_jsx(FaIcon, { className: "fas fa-image text-text-muted" }), editable ? (_jsx("button", { type: "button", title: "\u5220\u9664\u56FE\u7247", className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-danger text-white rounded-full text-xs leading-none", ...reviewTarget(`${reviewPrefix}.sku.${skuCode}.image.remove`, '删除图片'), children: "\u00D7" })) : null] }, `${img}-${idx}`))), editable && list.length < 5 ? (_jsxs("button", { type: "button", className: "w-16 h-16 rounded-lg border-2 border-dashed border-accent/50 text-accent flex flex-col items-center justify-center gap-0.5 hover:bg-accent/5 transition-colors", title: "\u4E0A\u4F20\u56FE\u7247", ...reviewTarget(`${reviewPrefix}.sku.${skuCode}.image.upload`, '上传图片'), children: [_jsx(FaIcon, { className: "fas fa-camera text-sm" }), _jsx("span", { className: "text-[9px] font-medium", children: "\u4E0A\u4F20" })] })) : null, !editable && !list.length ? (_jsx("span", { className: "text-sm text-text-muted", children: "\u6682\u65E0\u56FE\u7247" })) : null] })] }));
}
function FillInstructionSheet({ skuCode, skuName, text, reviewPrefix, onClose, }) {
    return (_jsxs("div", { className: "absolute inset-0 z-50 flex flex-col justify-end overflow-hidden", role: "dialog", "aria-modal": "true", children: [_jsx("button", { type: "button", className: "absolute inset-0 bg-black/40", "aria-label": "\u5173\u95ED", onClick: onClose }), _jsxs("div", { className: "relative bg-white rounded-t-2xl shadow-xl max-h-[72%] min-h-0 flex flex-col", ...reviewTarget(`${reviewPrefix}.instruction.sheet`, '填写说明'), children: [_jsxs("div", { className: "shrink-0 flex items-center justify-between px-4 py-3 border-b border-border-light", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "text-sm font-semibold text-dark", children: "\u586B\u5199\u8BF4\u660E" }), _jsxs("p", { className: "text-[11px] text-text-muted truncate mt-0.5", children: [skuName, " \u00B7 ", skuCode] })] }), _jsx("button", { type: "button", className: "shrink-0 w-8 h-8 flex items-center justify-center text-text-muted hover:text-dark", onClick: onClose, "aria-label": "\u5173\u95ED", children: _jsx(FaIcon, { className: "fas fa-times" }) })] }), _jsx("div", { className: "flex-1 min-h-0 overflow-y-auto px-4 py-3", children: _jsx("p", { className: "text-sm text-text-secondary leading-relaxed whitespace-pre-wrap", children: text }) }), _jsx("div", { className: "shrink-0 px-4 py-3 border-t border-border-light", children: _jsx("button", { type: "button", className: "w-full h-11 rounded-lg bg-accent text-white text-sm font-semibold", onClick: onClose, ...reviewTarget(`${reviewPrefix}.instruction.confirm`, '知道了'), children: "\u77E5\u9053\u4E86" }) })] })] }));
}
