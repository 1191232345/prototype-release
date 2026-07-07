import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlowRenderer } from '@prototype/renderer/FlowRenderer';
import { locateInPrdText, reviewHintLabel } from '../lib/reviewLink';
import { clearReviewInspectHover, reviewHitAtPoint, setReviewInspectHover, } from '../lib/reviewInspectHitTest';
import { INTERACTION_MODE_OPTIONS, loadInteractionMode, saveInteractionMode, } from '../lib/prototypeInteractionMode';
import { SchemaErrorStrip } from './SchemaErrorStrip';
import { ProjectDocPanel } from './ProjectDocPanel';
import { SegmentedControl } from './SegmentedControl';
import { useSplitDocPanel } from '../lib/useSplitDocPanel';
import { PrototypeChromeProvider } from '../lib/PrototypeChromeContext';
import { PrototypeStageProvider } from '../lib/PrototypeStageContext';
import { FaIcon } from '@prototype/ui/Icon';
export function SplitReviewPanel({ project, chrome = 'archive' }) {
    const containerRef = useRef(null);
    const stageRef = useRef(null);
    const prototypeScrollRef = useRef(null);
    const prdScrollRef = useRef(null);
    const [modalHost, setModalHost] = useState(null);
    const { docWidth, docOpen, setDocOpen, toggleDocOpen, startResize } = useSplitDocPanel(containerRef, 'right');
    const [interactionMode, setInteractionModeState] = useState(loadInteractionMode);
    const [currentPage, setCurrentPage] = useState(project.flow.entry);
    const [hoverReviewId, setHoverReviewId] = useState(null);
    const [hoverRowHint, setHoverRowHint] = useState(undefined);
    const [activeLocate, setActiveLocate] = useState(null);
    const [locateNotice, setLocateNotice] = useState(null);
    const [locateToken, setLocateToken] = useState(0);
    const prdText = project.prdText?.trim() ?? '';
    const pageLabel = project.flow.pages[currentPage]?.title ?? currentPage;
    const isReviewMode = interactionMode === 'review';
    const setInteractionMode = useCallback((mode) => {
        setInteractionModeState(mode);
        saveInteractionMode(mode);
        if (mode === 'dynamic') {
            setDocOpen(false);
            setActiveLocate(null);
            setLocateNotice(null);
            setHoverReviewId(null);
            setHoverRowHint(undefined);
        }
    }, [setDocOpen]);
    useEffect(() => {
        setCurrentPage(project.flow.entry);
        setActiveLocate(null);
        setLocateNotice(null);
        setHoverReviewId(null);
        setHoverRowHint(undefined);
    }, [project.key, project.flow.entry]);
    useEffect(() => {
        setActiveLocate(null);
        setHoverReviewId(null);
        setHoverRowHint(undefined);
    }, [currentPage]);
    useEffect(() => {
        if (!locateNotice)
            return;
        const timer = setTimeout(() => setLocateNotice(null), 3500);
        return () => clearTimeout(timer);
    }, [locateNotice]);
    useEffect(() => {
        if (!isReviewMode)
            return;
        setReviewInspectHover(stageRef.current, hoverReviewId);
    }, [hoverReviewId, isReviewMode]);
    useEffect(() => {
        return () => clearReviewInspectHover(stageRef.current);
    }, []);
    const resolveLocate = useCallback((reviewId, rowHintOverride) => locateInPrdText(prdText, reviewId, rowHintOverride), [prdText]);
    const hoverLocate = hoverReviewId ? resolveLocate(hoverReviewId, hoverRowHint) : null;
    const hoverHint = hoverReviewId ? reviewHintLabel(hoverReviewId, hoverLocate) : null;
    const applyLocate = useCallback((reviewId, rowHintOverride) => {
        if (!prdText) {
            setLocateNotice('暂无 PRD，无法定位');
            return;
        }
        const located = resolveLocate(reviewId, rowHintOverride);
        if (located) {
            if (!docOpen)
                setDocOpen(true);
            setActiveLocate(located);
            setLocateToken((t) => t + 1);
            setLocateNotice(null);
        }
        else {
            setActiveLocate(null);
            setLocateNotice(reviewHintLabel(reviewId, null));
        }
    }, [prdText, resolveLocate, docOpen, setDocOpen]);
    const pickReviewHit = (clientX, clientY) => reviewHitAtPoint(stageRef.current, clientX, clientY);
    const handlePrototypePointerMove = (e) => {
        if (!isReviewMode)
            return;
        const hit = pickReviewHit(e.clientX, e.clientY);
        setHoverReviewId(hit?.reviewId ?? null);
        setHoverRowHint(hit?.tableRowHint);
    };
    const handlePrototypePointerLeave = () => {
        if (!isReviewMode)
            return;
        setHoverReviewId(null);
        setHoverRowHint(undefined);
    };
    const handlePrototypeClick = (e) => {
        if (!isReviewMode)
            return;
        const hit = pickReviewHit(e.clientX, e.clientY);
        if (!hit)
            return;
        applyLocate(hit.reviewId, hit.tableRowHint);
    };
    const highlightKey = activeLocate?.anchorId ?? activeLocate?.sectionTitle ?? null;
    const showPrdPanel = isReviewMode && docOpen && prdText;
    const showPrdFab = isReviewMode && !docOpen && prdText;
    const isPublishChrome = chrome === 'publish';
    const projectTitle = project.meta.title?.trim() || project.meta.project?.trim() || project.key;
    const statusDescription = !isReviewMode
        ? '动态交互：可自由点击、填写、切换页面，完整体验原型流程。'
        : !prdText
            ? '对照交互：暂无 PRD 文档，仅可悬停高亮控件。'
            : !docOpen
                ? '对照交互：悬停预览控件说明，点击可定位 PRD；点击右侧展开 PRD 面板。'
                : locateNotice
                    ? locateNotice
                    : hoverHint
                        ? `${hoverHint} · 点击控件同步定位 PRD`
                        : '对照交互：悬停预览控件说明，点击同步定位右侧 PRD 章节。';
    const statusLineClass = locateNotice
        ? 'text-amber-700'
        : hoverHint && isReviewMode && docOpen
            ? 'text-primary'
            : 'text-text-muted';
    return (_jsxs("div", { ref: containerRef, className: "split-review flex-1 flex min-w-0 min-h-0 overflow-hidden bg-surface relative", children: [_jsxs("section", { className: "split-review-main flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden", children: [isPublishChrome ? (_jsxs("header", { className: "split-review-top-header shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] border-b-2 border-accent bg-primary text-white shadow-header", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [_jsx("span", { className: "text-xs sm:text-sm font-display font-semibold tracking-wide shrink-0", children: "ELSA" }), _jsx("span", { className: "text-white/35 shrink-0", "aria-hidden": true, children: "|" }), _jsx("h1", { className: "text-sm sm:text-base font-semibold truncate", title: projectTitle, children: projectTitle }), _jsx("span", { className: "text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/15 shrink-0", children: project.meta.version })] }), _jsx("span", { className: "text-[10px] sm:text-xs text-accent-light font-medium shrink-0", children: "\u539F\u578B\u9884\u89C8" })] })) : null, _jsxs("div", { className: "split-review-interaction-card shrink-0 mx-2 sm:mx-4 mt-2 sm:mt-3 mb-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:gap-3", children: [_jsx(SegmentedControl, { size: "sm", value: interactionMode, options: INTERACTION_MODE_OPTIONS, onChange: setInteractionMode }), isReviewMode ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "split-review-page-filter is-on is-locked", title: `仅显示「${pageLabel}」章节`, children: [_jsx(FaIcon, { className: "fas fa-filter text-[10px] opacity-60" }), "\u5F53\u524D\u9875 \u00B7 ", pageLabel] }), prdText ? (_jsxs("button", { type: "button", className: "split-review-inspect-toggle shrink-0 ml-auto", title: docOpen ? '隐藏 PRD 面板' : '显示 PRD 面板', "aria-expanded": docOpen, onClick: toggleDocOpen, children: [_jsx(FaIcon, { className: `fas ${docOpen ? 'fa-chevron-right' : 'fa-chevron-left'} text-[10px]` }), _jsx("span", { className: "hidden sm:inline", children: docOpen ? '隐藏 PRD' : '显示 PRD' })] })) : null] })) : null] }), _jsxs("p", { className: `split-review-interaction-hint text-xs leading-relaxed mt-2 ${statusLineClass}`, children: [locateNotice ? (_jsx(FaIcon, { className: "fas fa-exclamation-circle mr-1.5" })) : (_jsx(FaIcon, { className: "fas fa-info-circle mr-1.5 opacity-60" })), statusDescription] })] }), _jsx(SchemaErrorStrip, { item: project }), _jsx(PrototypeChromeProvider, { hidePageHeader: true, children: _jsx(PrototypeStageProvider, { host: modalHost, children: _jsxs("div", { ref: stageRef, className: `prototype-stage flex-1 min-w-0 min-h-0 relative overflow-hidden${isReviewMode ? ' review-inspect-active' : ''}`, onPointerMove: handlePrototypePointerMove, onPointerLeave: handlePrototypePointerLeave, onClick: handlePrototypeClick, children: [_jsx("div", { ref: prototypeScrollRef, className: "prototype-scroll absolute inset-0 overflow-auto", children: _jsx(FlowRenderer, { flow: project.flow, requirementsText: project.requirementsText, onPageChange: setCurrentPage }, project.key) }), isReviewMode ? _jsx("div", { className: "review-inspect-overlay", "aria-hidden": true }) : null, _jsx("div", { ref: setModalHost, className: "prototype-modal-host" })] }) }) })] }), showPrdPanel ? (_jsxs(_Fragment, { children: [_jsx("div", { role: "separator", "aria-orientation": "vertical", "aria-label": "\u8C03\u6574\u6587\u6863\u9762\u677F\u5BBD\u5EA6", className: "split-review-resizer hidden md:block", onPointerDown: (e) => {
                            e.preventDefault();
                            startResize(e.clientX);
                        } }), _jsxs("aside", { className: "split-review-drawer split-review-drawer--open flex flex-col min-h-0 bg-white shrink-0 max-md:!w-[min(100vw,420px)]", style: { width: docWidth }, children: [_jsxs("div", { className: "split-review-drawer-header shrink-0 flex items-center justify-between gap-2 px-3 py-2 border-b border-border-light bg-white", children: [_jsxs("span", { className: "text-xs font-semibold text-text-secondary truncate", children: [_jsx(FaIcon, { className: "fas fa-file-contract text-accent mr-1.5" }), "PRD"] }), _jsx("button", { type: "button", className: "split-review-drawer-close", title: "\u9690\u85CF PRD \u9762\u677F", "aria-label": "\u9690\u85CF PRD \u9762\u677F", onClick: () => setDocOpen(false), children: _jsx(FaIcon, { className: "fas fa-chevron-right text-xs" }) })] }), _jsx(ProjectDocPanel, { ref: prdScrollRef, project: project, tab: "prd", embedded: true, dense: true, pageScope: currentPage, highlightKey: highlightKey, highlightTableRow: activeLocate?.tableRowHint ?? null, locateToken: locateToken })] })] })) : null, showPrdFab ? (_jsxs("button", { type: "button", className: "split-review-doc-fab", title: "\u5C55\u5F00 PRD \u9762\u677F", "aria-label": "\u5C55\u5F00 PRD \u9762\u677F", onClick: () => setDocOpen(true), children: [_jsx(FaIcon, { className: "fas fa-file-contract text-sm" }), _jsx("span", { className: "split-review-doc-fab-label", children: "PRD" })] })) : null] }));
}
