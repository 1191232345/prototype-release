import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlowRenderer } from '@prototype/renderer/FlowRenderer';
import { locateInPrdText, reviewHintLabel } from '@prototype/review';
import { clearReviewInspectHover, reviewHitAtPoint, setReviewInspectHover, } from '@prototype/review';
import { INTERACTION_MODE_OPTIONS, loadInteractionMode, saveInteractionMode, } from '../lib/prototypeInteractionMode';
import { SchemaErrorStrip } from './SchemaErrorStrip';
import { SplitReviewPrdDrawer } from './SplitReviewPrdDrawer';
import { PrdSectionEditModal } from '../components/RequirementsDocView';
import { DocToc } from './DocToc';
import { SegmentedControl } from './SegmentedControl';
import { useSplitDocPanel } from '../lib/useSplitDocPanel';
import { useSectionEditor } from '../lib/useSectionEditor';
import { parseRequirementsDoc } from '@prototype/runtime/parseRequirementsDoc';
import { findPrdSectionElement, scrollPrdSectionIntoView } from '@prototype/review';
import { PrototypeChromeProvider } from '@prototype/runtime/contexts/PrototypeChromeContext';
import { PrototypeStageProvider } from '@prototype/runtime/contexts/PrototypeStageContext';
import { FaIcon } from '@prototype/ui/Icon';
export function SplitReviewPanel({ project, chrome = 'archive', onPrdSaved }) {
    const containerRef = useRef(null);
    const stageRef = useRef(null);
    const prototypeScrollRef = useRef(null);
    const prdScrollRef = useRef(null);
    const [modalHost, setModalHost] = useState(null);
    const { docWidth, docOpen, setDocOpen, startResize } = useSplitDocPanel(containerRef, 'right');
    const [interactionMode, setInteractionModeState] = useState(loadInteractionMode);
    const [currentPage, setCurrentPage] = useState(project.flow.entry);
    const [hoverReviewId, setHoverReviewId] = useState(null);
    const [hoverRowHint, setHoverRowHint] = useState(undefined);
    const [activeLocate, setActiveLocate] = useState(null);
    const [locateNotice, setLocateNotice] = useState(null);
    const [locateToken, setLocateToken] = useState(0);
    const prdText = project.prdText?.trim() ?? '';
    const [tocOpen, setTocOpen] = useState(false);
    const [tocNavKey, setTocNavKey] = useState(null);
    const [tocNavToken, setTocNavToken] = useState(0);
    const sectionEditor = useSectionEditor(onPrdSaved);
    const pageLabel = project.flow.pages[currentPage]?.title ?? currentPage;
    const isReviewMode = interactionMode === 'review';
    const showPrdPanel = isReviewMode && docOpen && prdText;
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
        const stage = stageRef.current;
        return () => clearReviewInspectHover(stage);
    }, []);
    const highlightKey = activeLocate?.anchorId ?? activeLocate?.sectionTitle ?? null;
    useEffect(() => {
        setTocOpen(false);
        setTocNavKey(null);
    }, [project.key]);
    useEffect(() => {
        if (highlightKey)
            setTocNavKey(null);
    }, [highlightKey, locateToken]);
    useEffect(() => {
        setTocNavKey(null);
    }, [currentPage]);
    const tocSections = useMemo(() => {
        if (!showPrdPanel)
            return [];
        if (!prdText)
            return [];
        return parseRequirementsDoc(prdText).sections;
    }, [prdText, showPrdPanel]);
    const editingOriginalSection = useMemo(() => {
        if (!sectionEditor.editingKey || !prdText)
            return null;
        const sections = parseRequirementsDoc(prdText).sections;
        return (sections.find((s) => s.anchorId === sectionEditor.editingKey ||
            s.title === sectionEditor.editingKey) ?? null);
    }, [sectionEditor.editingKey, prdText]);
    const showTocButton = showPrdPanel && tocSections.length > 0;
    const handleTocNavigate = useCallback((key) => {
        setTocNavKey(key);
        setTocNavToken((t) => t + 1);
        const container = prdScrollRef.current;
        if (container) {
            requestAnimationFrame(() => {
                const el = findPrdSectionElement(container, key);
                if (el)
                    scrollPrdSectionIntoView(container, el);
            });
        }
        setTocOpen(false);
    }, []);
    const effHighlightKey = tocNavKey ?? highlightKey;
    const effLocateToken = tocNavKey ? tocNavToken : locateToken;
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
    const showPrdFab = isReviewMode && !docOpen && prdText;
    const isPublishChrome = chrome === 'publish';
    const projectTitle = project.meta.title?.trim() || project.meta.project?.trim() || project.key;
    return (_jsxs("div", { ref: containerRef, className: "split-review flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-surface relative", children: [isPublishChrome ? (_jsxs("header", { className: "split-review-top-header shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[44px] border-b-2 border-accent bg-primary text-white shadow-header", children: [_jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [_jsx("span", { className: "text-xs sm:text-sm font-display font-semibold tracking-wide shrink-0", children: "ELSA" }), _jsx("span", { className: "text-white/35 shrink-0", "aria-hidden": true, children: "|" }), _jsx("h1", { className: "text-sm sm:text-base font-semibold truncate", title: projectTitle, children: projectTitle }), _jsx("span", { className: "text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/15 shrink-0", children: project.meta.version })] }), _jsx("span", { className: "text-[10px] sm:text-xs text-accent-light font-medium shrink-0", children: "\u539F\u578B\u9884\u89C8" })] })) : null, _jsxs("div", { className: "split-review-top-bar shrink-0 mx-2 sm:mx-3 mt-2 sm:mt-3 relative", children: [_jsx("div", { className: "rounded-lg border border-border-light bg-white shadow-card overflow-hidden", children: _jsxs("div", { className: "flex items-center gap-2 px-3 sm:px-4 py-2", children: [_jsx(SegmentedControl, { size: "sm", value: interactionMode, options: INTERACTION_MODE_OPTIONS, onChange: setInteractionMode }), isReviewMode ? (_jsxs("span", { className: "split-review-page-filter is-on is-locked", title: `仅显示「${pageLabel}」章节`, children: [_jsx(FaIcon, { className: "fas fa-filter text-[10px] opacity-60" }), pageLabel] })) : null, _jsxs("div", { className: "ml-auto flex items-center gap-1.5 min-w-0", children: [!sectionEditor.editingKey && (_jsx("span", { className: "text-[11px] truncate text-text-muted hidden sm:inline min-w-0", children: locateNotice ? (_jsxs("span", { className: "text-amber-700", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle mr-1" }), locateNotice] })) : hoverHint && isReviewMode && docOpen ? (_jsx("span", { className: "text-primary", children: hoverHint })) : null })), showPrdPanel ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "w-px h-4 bg-border-light shrink-0" }), _jsx("div", { className: "flex items-center gap-0.5 shrink-0", children: showTocButton && !sectionEditor.editingKey && (_jsx("button", { type: "button", className: `split-drawer-icon-btn ${tocOpen ? 'is-on' : ''}`, title: "\u7AE0\u8282\u5BFC\u822A", "aria-label": "\u7AE0\u8282\u5BFC\u822A", "aria-expanded": tocOpen, onClick: () => setTocOpen(!tocOpen), children: _jsx(FaIcon, { className: "fas fa-list-ul text-xs" }) })) }), _jsx("span", { className: "w-px h-4 bg-border-light shrink-0" }), _jsx("button", { type: "button", className: "split-drawer-icon-btn", title: "\u9690\u85CF\u6587\u6863\u9762\u677F", "aria-label": "\u9690\u85CF\u6587\u6863\u9762\u677F", onClick: () => setDocOpen(false), children: _jsx(FaIcon, { className: "fas fa-chevron-right text-xs" }) })] })) : null] })] }) }), showPrdPanel && sectionEditor.error ? (_jsx("div", { className: "mt-1.5 mx-1 px-3 py-1.5 text-xs text-red-600 rounded-md border border-red-100 bg-red-50", children: sectionEditor.error })) : null, showPrdPanel && sectionEditor.message ? (_jsx("div", { className: "mt-1.5 mx-1 px-3 py-1.5 text-xs text-emerald-700 rounded-md border border-emerald-100 bg-emerald-50", children: sectionEditor.message })) : null, tocOpen && showTocButton ? (_jsx("div", { className: "split-drawer-toc-dropdown absolute left-2 sm:left-3 right-2 sm:right-3 top-full z-30 shadow-lg rounded-lg border border-border-light bg-white max-h-[60vh] overflow-y-auto", children: _jsx(DocToc, { sections: tocSections, scrollContainerRef: prdScrollRef, highlightKey: effHighlightKey, onNavigate: handleTocNavigate }) })) : null] }), _jsxs("div", { className: "split-review-body flex-1 flex min-h-0 gap-1 sm:gap-1.5 px-1.5 sm:px-2 pb-1.5 sm:pb-2 pt-1", children: [_jsxs("section", { className: "split-review-main flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden", children: [_jsx(SchemaErrorStrip, { item: project }), _jsx("div", { className: "split-review-prototype-card flex-1 min-h-0 rounded-lg border border-border-light bg-white overflow-hidden relative", children: _jsx(PrototypeChromeProvider, { hidePageHeader: true, children: _jsx(PrototypeStageProvider, { host: modalHost, children: _jsxs("div", { ref: stageRef, className: `prototype-stage h-full relative${isReviewMode ? ' review-inspect-active' : ''}`, onPointerMove: handlePrototypePointerMove, onPointerLeave: handlePrototypePointerLeave, onClick: handlePrototypeClick, children: [_jsx("div", { ref: prototypeScrollRef, className: "prototype-scroll absolute inset-0 overflow-auto", children: _jsx(FlowRenderer, { flow: project.flow, requirementsText: project.requirementsText, onPageChange: setCurrentPage }, project.key) }), isReviewMode ? _jsx("div", { className: "review-inspect-overlay", "aria-hidden": true }) : null, _jsx("div", { ref: setModalHost, className: "prototype-modal-host" })] }) }) }) })] }), showPrdPanel ? (_jsx(SplitReviewPrdDrawer, { project: project, docWidth: docWidth, pageScope: currentPage, docRef: prdScrollRef, activeTab: "prd", sectionEditor: sectionEditor, originalPrdText: prdText, highlightKey: effHighlightKey, highlightTableRow: activeLocate?.tableRowHint ?? null, locateToken: effLocateToken, onClose: () => setDocOpen(false), onStartResize: startResize })) : null] }), showPrdFab ? (_jsxs("button", { type: "button", className: "split-review-doc-fab", title: "\u5C55\u5F00 PRD \u9762\u677F", "aria-label": "\u5C55\u5F00 PRD \u9762\u677F", onClick: () => setDocOpen(true), children: [_jsx(FaIcon, { className: "fas fa-file-contract text-sm" }), _jsx("span", { className: "split-review-doc-fab-label", children: "PRD" })] })) : null, _jsx(PrdSectionEditModal, { section: editingOriginalSection, sectionEditor: sectionEditor, project: project, originalPrdText: prdText, onClose: sectionEditor.cancelEdit })] }));
}
