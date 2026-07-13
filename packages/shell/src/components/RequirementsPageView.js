import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { parseRequirementsDoc } from '@prototype/runtime/parseRequirementsDoc';
import { extractKpis, extractSummary, formatStatus, renderBlocksHtml, reqIcon, resolveDocHeading, sectionDisplayNumber, sectionDomSlug, sectionNavIcon, } from '@prototype/runtime/requirementsPage';
import '../../../runtime/src/renderer/styles/requirements-doc.css';
function ReqIconEl({ name, className = 'req-icon' }) {
    return _jsx("span", { dangerouslySetInnerHTML: { __html: reqIcon(name, className) } });
}
export function RequirementsPageView({ markdown, meta = {} }) {
    const doc = parseRequirementsDoc(markdown);
    const summary = extractSummary(markdown);
    const kpis = extractKpis(markdown);
    const status = formatStatus(meta.status);
    const title = meta.title?.trim() || doc.title.replace(/^需求文档\s*[-–—]\s*/, '') || '需求文档';
    const heading = resolveDocHeading(meta, doc.title);
    const version = meta.version?.trim() || 'v1';
    const author = meta.author?.trim() || '—';
    const updatedAt = meta.createdAt?.trim() || '—';
    const sidebarRef = useRef(null);
    const overlayRef = useRef(null);
    const progressRef = useRef(null);
    const backTopRef = useRef(null);
    const sectionsRef = useRef([]);
    useEffect(() => {
        const sidebar = sidebarRef.current;
        const overlay = overlayRef.current;
        const progressBar = progressRef.current;
        const backTop = backTopRef.current;
        const menuBtn = document.getElementById('req-menu-btn');
        const navLinks = document.querySelectorAll('#req-nav-list a');
        const sections = sectionsRef.current;
        const openNav = () => {
            sidebar?.classList.add('open');
            overlay?.classList.add('open');
            document.body.style.overflow = 'hidden';
        };
        const closeNav = () => {
            sidebar?.classList.remove('open');
            overlay?.classList.remove('open');
            document.body.style.overflow = '';
        };
        menuBtn?.addEventListener('click', openNav);
        overlay?.addEventListener('click', closeNav);
        navLinks.forEach((link) => link.addEventListener('click', closeNav));
        const onScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            if (progressBar)
                progressBar.style.width = `${progress}%`;
            backTop?.classList.toggle('visible', scrollTop > 400);
            let current = '';
            sections.forEach((sec) => {
                if (scrollTop >= sec.offsetTop - 120)
                    current = sec.id;
            });
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        return () => {
            menuBtn?.removeEventListener('click', openNav);
            overlay?.removeEventListener('click', closeNav);
            navLinks.forEach((link) => link.removeEventListener('click', closeNav));
            window.removeEventListener('scroll', onScroll);
            document.body.style.overflow = '';
        };
    }, [markdown]);
    const statusColor = status.tone === 'warn' ? 'var(--warning)' : status.tone === 'ok' ? 'var(--success)' : 'var(--muted)';
    return (_jsxs("div", { className: "requirements-page-root", children: [_jsx("div", { className: "progress-bar", ref: progressRef, id: "progressBar" }), _jsxs("header", { className: "mobile-header", children: [_jsxs("span", { className: "doc-title", children: [title, " PRD"] }), _jsx("button", { className: "menu-btn", id: "req-menu-btn", type: "button", "aria-label": "\u6253\u5F00\u76EE\u5F55", children: _jsx(ReqIconEl, { name: "bars", className: "req-icon req-icon--menu" }) })] }), _jsx("div", { className: "nav-overlay", ref: overlayRef, id: "navOverlay" }), _jsxs("div", { className: "layout", children: [_jsxs("nav", { id: "sidebar", ref: sidebarRef, children: [_jsxs("div", { className: "nav-brand", children: [_jsx("div", { className: "label", children: "Product Doc" }), _jsx("div", { className: "title", children: title }), _jsxs("div", { className: "version", children: [version, " \u00B7 ", updatedAt] })] }), _jsx("h2", { children: "\u76EE\u5F55" }), _jsx("ul", { id: "req-nav-list", children: doc.sections.map((section, index) => {
                                    const id = sectionDomSlug(section.title, index);
                                    const label = section.title.replace(/^[一二三四五六七八九十\d]+[.、\s]+/, '').trim() || section.title;
                                    return (_jsx("li", { children: _jsxs("a", { href: `#${id}`, children: [_jsx(ReqIconEl, { name: sectionNavIcon(section.title), className: "req-icon req-icon--nav" }), label] }) }, id));
                                }) })] }), _jsxs("main", { children: [_jsxs("div", { className: "hero", children: [_jsxs("div", { className: "hero-top", children: [_jsx("h1", { children: heading }), _jsxs("div", { className: "hero-badges", children: [_jsx("span", { className: "badge badge-version", children: version }), _jsxs("span", { className: "badge badge-warn", children: [_jsx(ReqIconEl, { name: "clock", className: "req-icon req-icon--badge" }), " ", status.label] })] })] }), _jsxs("div", { className: "meta-grid", children: [_jsxs("div", { className: "meta-item", children: [_jsx("div", { className: "key", children: "\u7248\u672C" }), _jsx("div", { className: "val", children: version })] }), _jsxs("div", { className: "meta-item", children: [_jsx("div", { className: "key", children: "\u8D1F\u8D23\u4EBA" }), _jsx("div", { className: "val", children: author })] }), _jsxs("div", { className: "meta-item", children: [_jsx("div", { className: "key", children: "\u66F4\u65B0\u65E5\u671F" }), _jsx("div", { className: "val", children: updatedAt })] }), _jsxs("div", { className: "meta-item", children: [_jsx("div", { className: "key", children: "\u72B6\u6001" }), _jsx("div", { className: "val", style: { color: statusColor }, children: status.label })] })] }), summary ? (_jsxs("div", { className: "summary", children: [_jsx(ReqIconEl, { name: "lightbulb", className: "req-icon req-icon--summary" }), _jsxs("div", { children: [_jsx("strong", { children: "\u4E00\u53E5\u8BDD\uFF1A" }), summary] })] })) : meta.changeSummary ? (_jsxs("div", { className: "summary", children: [_jsx(ReqIconEl, { name: "lightbulb", className: "req-icon req-icon--summary" }), _jsx("div", { children: meta.changeSummary })] })) : null, kpis.length > 0 ? (_jsx("div", { className: "kpi-strip", children: kpis.map((kpi) => (_jsxs("div", { className: "kpi-card", children: [_jsx("div", { className: "kpi-icon", children: _jsx(ReqIconEl, { name: kpi.icon, className: "req-icon req-icon--kpi" }) }), _jsx("div", { className: "kpi-val", children: kpi.value }), _jsx("div", { className: "kpi-label", children: kpi.label })] }, kpi.label))) })) : null] }), doc.sections.map((section, index) => {
                                const id = sectionDomSlug(section.title, index);
                                const num = sectionDisplayNumber(section.title, index);
                                const label = section.title.replace(/^[一二三四五六七八九十\d]+[.、\s]+/, '').trim() || section.title;
                                const showConfirm = /待确认/.test(section.title);
                                return (_jsxs("div", { children: [index > 0 ? _jsx("hr", {}) : null, _jsxs("section", { className: "section", id: id, ref: (el) => {
                                                if (el)
                                                    sectionsRef.current[index] = el;
                                            }, children: [_jsxs("h2", { children: [_jsx("span", { className: "sec-num", children: num }), label] }), showConfirm ? (_jsxs("div", { className: "confirm-box", children: [_jsx(ReqIconEl, { name: "triangle-exclamation" }), _jsx("span", { children: "\u4EE5\u4E0B\u4E8B\u9879\u9700\u8981\u4E1A\u52A1\u65B9\u786E\u8BA4\u3002\u5982\u65E0\u5F02\u8BAE\u6309\u300C\u5EFA\u8BAE\u65B9\u6848\u300D\u6267\u884C\uFF1B\u6709\u4FEE\u6539\u8BF7\u6807\u6CE8\u6761\u76EE\u7F16\u53F7\u3002" })] })) : null, section.blocks.length > 0 ? (_jsx("div", { className: "requirements-section-body", dangerouslySetInnerHTML: { __html: renderBlocksHtml(section.blocks, section.title) } })) : (_jsx("p", { children: "\u6682\u65E0\u5185\u5BB9" }))] })] }, id));
                            }), _jsxs("div", { className: "status-bar", children: [_jsx(ReqIconEl, { name: "hourglass-half", className: "req-icon req-icon--status" }), _jsxs("span", { children: ["\u6587\u6863\u72B6\u6001\uFF1A", _jsx("strong", { children: status.label })] })] })] })] }), _jsx("button", { className: "back-top", ref: backTopRef, type: "button", "aria-label": "\u56DE\u5230\u9876\u90E8", children: _jsx(ReqIconEl, { name: "arrow-up", className: "req-icon req-icon--back-top" }) })] }));
}
