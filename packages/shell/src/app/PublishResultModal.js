import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Button, Modal } from '@prototype/ui';
import { copyText } from '../lib/utils';
import { FaIcon } from '@prototype/ui/Icon';
function splitUrl(url) {
    try {
        const parsed = new URL(url);
        return { host: parsed.host, path: `${parsed.pathname}${parsed.search}` };
    }
    catch {
        return { host: '', path: url };
    }
}
function formatPublishedAt(value) {
    if (!value)
        return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;
    return date.toLocaleString('zh-CN', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
function useCopyFeedback() {
    const [copiedKey, setCopiedKey] = useState(null);
    const copy = async (key, text) => {
        const ok = await copyText(text);
        if (!ok)
            return;
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };
    return { copiedKey, copy };
}
function StatusBanner({ status, result, }) {
    const publishedAt = formatPublishedAt(result?.publishedAt ?? status.record?.publishedAt);
    if (!status.hasPublished) {
        return (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-surface border border-border-light text-text-muted flex items-center justify-center shrink-0", children: _jsx(FaIcon, { className: "fas fa-cloud-upload-alt text-sm" }) }), _jsxs("div", { className: "min-w-0 pt-0.5", children: [_jsx("p", { className: "text-sm font-semibold text-dark", children: "\u5C1A\u672A\u53D1\u5E03" }), _jsx("p", { className: "text-xs text-text-muted mt-1 leading-relaxed", children: "\u9996\u6B21\u53D1\u5E03\u540E\u5C06\u751F\u6210\u53EF\u5206\u4EAB\u94FE\u63A5\uFF0C\u4E4B\u540E\u4EC5\u5728\u5185\u5BB9\u53D8\u66F4\u65F6\u9700\u8981\u66F4\u65B0\u3002" })] })] }));
    }
    if (status.isStale) {
        return (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0", children: _jsx(FaIcon, { className: "fas fa-sync-alt text-sm" }) }), _jsxs("div", { className: "min-w-0 pt-0.5", children: [_jsx("p", { className: "text-sm font-semibold text-dark", children: "\u5F85\u66F4\u65B0\u53D1\u5E03" }), _jsxs("p", { className: "text-xs text-text-muted mt-1 leading-relaxed", children: [status.staleReasons.filter((r) => r !== '尚未发布').join(' · '), publishedAt ? ` · 上次发布 ${publishedAt}` : ''] })] })] }));
    }
    return (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0", children: _jsx(FaIcon, { className: "fas fa-check text-sm" }) }), _jsxs("div", { className: "min-w-0 pt-0.5", children: [_jsx("p", { className: "text-sm font-semibold text-dark", children: result?.skipped ? '已是最新，无需重复发布' : '发布成功' }), _jsx("p", { className: "text-xs text-text-muted mt-1 leading-relaxed", children: result?.pagesDeployMessage ||
                            (publishedAt ? `上次发布 ${publishedAt}，内容与线上一致` : '链接可直接分享') })] })] }));
}
function PrimaryPreviewCard({ item, copiedKey, onCopy, }) {
    const { host, path } = splitUrl(item.url);
    const copied = copiedKey === item.key;
    return (_jsxs("div", { className: "rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.06] to-white p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0", children: _jsx(FaIcon, { className: `fas ${item.icon}` }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-sm font-semibold text-dark", children: item.label }), _jsx("span", { className: "text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary", children: "\u63A8\u8350\u5206\u4EAB" })] }), _jsx("p", { className: "text-xs text-text-muted mt-0.5", children: item.hint })] })] }), _jsx("div", { className: "rounded-lg border border-border-light bg-white/80 px-3 py-2.5 font-mono text-xs leading-relaxed break-all", title: item.url, children: host ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-text-muted", children: host }), _jsx("span", { className: "text-dark", children: path })] })) : (_jsx("span", { className: "text-dark", children: path })) }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { className: "flex-1 sm:flex-none py-2 px-4 text-sm", icon: "fas fa-external-link-alt", onClick: () => window.open(item.url, '_blank', 'noopener,noreferrer'), children: "\u6253\u5F00\u9884\u89C8" }), _jsx(Button, { variant: "secondary", className: "flex-1 sm:flex-none py-2 px-4 text-sm", icon: `fas ${copied ? 'fa-check' : 'fa-link'}`, onClick: () => void onCopy(item.key, item.url), children: copied ? '已复制链接' : '复制链接' })] })] }));
}
function SecondaryLinkRow({ item, copiedKey, onCopy, }) {
    const { host, path } = splitUrl(item.url);
    const copied = copiedKey === item.key;
    const shortPath = path.length > 36 ? `${path.slice(0, 33)}…` : path;
    return (_jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 hover:bg-hover/60 transition-colors", children: [_jsx("div", { className: "w-7 h-7 rounded-md bg-surface border border-border-light text-text-muted flex items-center justify-center shrink-0", children: _jsx(FaIcon, { className: `fas ${item.icon} text-[11px]` }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-sm font-medium text-dark", children: item.label }), _jsxs("p", { className: "text-[11px] text-text-muted truncate", title: item.url, children: [host, shortPath] })] }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx("button", { type: "button", className: "icon-btn w-8 h-8 text-text-muted hover:text-primary", title: copied ? '已复制' : '复制链接', "aria-label": `复制${item.label}链接`, onClick: () => void onCopy(item.key, item.url), children: _jsx(FaIcon, { className: `fas ${copied ? 'fa-check text-primary' : 'fa-copy'}` }) }), _jsx("button", { type: "button", className: "icon-btn w-8 h-8 text-text-muted hover:text-primary", title: "\u5728\u65B0\u7A97\u53E3\u6253\u5F00", "aria-label": `打开${item.label}`, onClick: () => window.open(item.url, '_blank', 'noopener,noreferrer'), children: _jsx(FaIcon, { className: "fas fa-external-link-alt" }) })] })] }));
}
function resultToLinks(result) {
    if (!result)
        return { primary: null, secondary: [] };
    const all = [
        result.previewUrl
            ? {
                key: 'preview',
                label: '原型预览',
                hint: '默认动态交互，可切换对照模式与 PRD',
                url: result.previewUrl,
                icon: 'fa-desktop',
            }
            : null,
        result.prdPreviewUrl
            ? {
                key: 'prd',
                label: 'PRD 独立页',
                hint: '仅文档，不含原型交互',
                url: result.prdPreviewUrl,
                icon: 'fa-file-contract',
            }
            : null,
        result.requirementsPreviewUrl
            ? {
                key: 'requirements',
                label: '需求文档',
                hint: '独立需求说明页',
                url: result.requirementsPreviewUrl,
                icon: 'fa-clipboard-list',
            }
            : null,
    ].filter(Boolean);
    const [first, ...rest] = all;
    return { primary: first ?? null, secondary: first ? rest : all };
}
export function PublishResultModal({ open, status, result, publishing, onClose, onPublish, }) {
    const { copiedKey, copy } = useCopyFeedback();
    const { primary, secondary } = useMemo(() => resultToLinks(result), [result]);
    if (!open || !status)
        return null;
    const showPublishAction = !status.hasPublished || status.isStale;
    const publishLabel = status.hasPublished ? '更新发布' : '首次发布';
    return (_jsx(Modal, { title: "\u9884\u89C8\u94FE\u63A5", onClose: onClose, size: "md", children: _jsxs("div", { className: "space-y-5", children: [_jsx(StatusBanner, { status: status, result: result }), primary ? (_jsx(PrimaryPreviewCard, { item: primary, copiedKey: copiedKey, onCopy: copy })) : null, secondary.length > 0 ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-xs font-semibold text-text-secondary px-0.5", children: ["\u6587\u6863\u94FE\u63A5", _jsxs("span", { className: "ml-1.5 font-normal text-text-muted", children: ["(", secondary.length, ")"] })] }), _jsx("div", { className: "rounded-xl border border-border-light overflow-hidden divide-y divide-border-light bg-surface/40", children: secondary.map((item) => (_jsx(SecondaryLinkRow, { item: item, copiedKey: copiedKey, onCopy: copy }, item.key))) })] })) : null, _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border-light", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [showPublishAction ? (_jsx(Button, { className: "py-2 px-4 text-sm", icon: `fas ${publishing ? 'fa-spinner fa-spin' : status.hasPublished ? 'fa-sync-alt' : 'fa-cloud-upload-alt'}`, disabled: publishing, onClick: () => onPublish(false), children: publishing ? '发布中…' : publishLabel })) : null, status.hasPublished ? (_jsx("button", { type: "button", className: "text-xs text-text-muted hover:text-primary transition-colors px-1 disabled:opacity-50", disabled: publishing, onClick: () => onPublish(true), children: "\u5F3A\u5236\u91CD\u65B0\u53D1\u5E03" })) : null] }), _jsx(Button, { variant: "secondary", className: "py-2 px-5 text-sm", onClick: onClose, children: "\u5B8C\u6210" })] })] }) }));
}
