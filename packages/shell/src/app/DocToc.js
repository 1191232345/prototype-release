import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { findPrdSectionElement, sectionDomId } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
export function DocToc({ sections, scrollContainerRef, highlightKey, onNavigate }) {
    const [activeId, setActiveId] = useState(null);
    const observerRef = useRef(null);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || sections.length === 0)
            return;
        const collectEls = () => {
            const els = [];
            sections.forEach((s) => {
                const el = findPrdSectionElement(container, s.anchorId ?? s.title);
                if (el)
                    els.push(el);
            });
            return els;
        };
        const rafId = requestAnimationFrame(() => {
            const els = collectEls();
            if (els.length === 0)
                return;
            observerRef.current?.disconnect();
            const observer = new IntersectionObserver((entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            }, {
                root: container,
                rootMargin: '0px 0px -75% 0px',
                threshold: 0,
            });
            els.forEach((el) => observer.observe(el));
            observerRef.current = observer;
        });
        return () => {
            cancelAnimationFrame(rafId);
            observerRef.current?.disconnect();
        };
    }, [sections, scrollContainerRef]);
    const handleClick = (section) => {
        const key = section.anchorId ?? section.title;
        onNavigate?.(key);
    };
    if (sections.length === 0) {
        return (_jsxs("div", { className: "doc-toc-empty", children: [_jsx(FaIcon, { className: "fas fa-list-ul text-text-muted/40 text-lg mb-2" }), _jsx("p", { className: "text-xs text-text-muted", children: "\u6682\u65E0\u7AE0\u8282" })] }));
    }
    return (_jsxs("div", { className: "doc-toc", children: [_jsxs("div", { className: "doc-toc-header", children: [_jsx(FaIcon, { className: "fas fa-list-ul text-primary text-xs" }), _jsx("span", { className: "text-xs font-semibold text-dark", children: "\u7AE0\u8282\u5BFC\u822A" }), _jsxs("span", { className: "text-[10px] text-text-muted ml-auto", children: [sections.length, " \u8282"] })] }), _jsx("nav", { className: "doc-toc-list", children: sections.map((section) => {
                    const domId = sectionDomId(section);
                    const isActive = activeId === domId;
                    const key = section.anchorId ?? section.title;
                    const isHighlighted = highlightKey === key;
                    return (_jsxs("button", { type: "button", className: `doc-toc-item ${isActive ? 'is-active' : ''} ${isHighlighted ? 'is-highlighted' : ''}`, onClick: () => handleClick(section), title: section.title, children: [_jsx(FaIcon, { className: `fas ${section.icon} text-[10px] shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}` }), _jsx("span", { className: "doc-toc-label", children: section.title }), section.pageScope && (_jsx("span", { className: "doc-toc-badge", children: section.pageScope }))] }, key));
                }) })] }));
}
