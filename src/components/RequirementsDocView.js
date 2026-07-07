import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { filterDocSections, parseRequirementsDoc, subsectionIcon, } from '../lib/parseRequirementsDoc';
import { findPrdSectionElement, scrollPrdSectionIntoView, sectionDomId } from '../lib/reviewLink';
import { FaIcon } from '@prototype/ui/Icon';
export function RequirementsDocView({ text, compact = false, dense = false, pageScope = null, highlightKey = null, highlightTableRow = null, locateToken = 0, scrollContainerRef = null, interactive = false, onPrdPick, }) {
    const doc = parseRequirementsDoc(text);
    const scoped = filterDocSections(doc.sections, pageScope);
    const sections = highlightKey && pageScope
        ? (() => {
            const target = doc.sections.find((s) => s.anchorId === highlightKey || s.title === highlightKey);
            if (target && !scoped.some((s) => s.anchorId === target.anchorId && s.title === target.title)) {
                const merged = [...scoped, target];
                merged.sort((a, b) => doc.sections.indexOf(a) - doc.sections.indexOf(b));
                return merged;
            }
            return scoped;
        })()
        : scoped;
    const contentRef = useRef(null);
    useEffect(() => {
        if (!highlightKey)
            return;
        const sectionEl = findPrdSectionElement(contentRef.current, highlightKey);
        if (!sectionEl)
            return;
        const scrollContainer = scrollContainerRef?.current;
        if (scrollContainer) {
            scrollPrdSectionIntoView(scrollContainer, sectionEl);
        }
        else {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlightKey, highlightTableRow, locateToken, pageScope, scrollContainerRef]);
    const isHighlighted = (section) => highlightKey != null &&
        (highlightKey === section.anchorId || highlightKey === section.title);
    return (_jsxs("div", { ref: contentRef, className: `logic-doc ${dense ? 'logic-doc--dense' : ''}`, children: [!compact && (_jsxs("div", { className: "mb-6 flex items-center gap-3 pb-4 border-b border-border-light", children: [_jsx(FaIcon, { className: "fas fa-book text-primary text-lg" }), _jsx("h1", { className: "font-semibold text-primary text-lg", children: doc.title })] })), sections.length === 0 && pageScope ? (_jsxs("p", { className: `text-text-muted ${dense ? 'text-xs' : 'text-sm'}`, children: ["\u5F53\u524D\u9875\u9762\uFF08", pageScope, "\uFF09\u6682\u65E0 PRD \u4EA4\u4E92\u89C4\u683C\u7AE0\u8282"] })) : null, sections.map((section) => (_jsx(LogicDocCard, { id: sectionDomId(section), title: section.title, icon: section.icon, dense: dense, highlighted: isHighlighted(section), interactive: interactive && !!section.anchorId, onHeaderClick: section.anchorId && onPrdPick
                    ? () => onPrdPick({
                        anchorId: section.anchorId,
                        rowLabel: null,
                        sectionTitle: section.title,
                    })
                    : undefined, children: _jsx(SectionBody, { section: section, dense: dense, highlightTableRow: isHighlighted(section) ? highlightTableRow : null, interactive: interactive, sectionAnchorId: section.anchorId, onPrdPick: onPrdPick }) }, section.anchorId ?? section.title)))] }));
}
function SectionBody({ section, dense = false, highlightTableRow = null, interactive = false, sectionAnchorId, onPrdPick, }) {
    if (!section.blocks.length) {
        return _jsx("p", { className: `text-text-muted ${dense ? 'text-xs' : 'text-sm'}`, children: "\u6682\u65E0\u5185\u5BB9" });
    }
    return (_jsx("div", { className: dense ? 'space-y-2' : 'space-y-4', children: section.blocks.map((block, i) => (_jsx(BlockRenderer, { block: block, sectionTitle: section.title, dense: dense, highlightTableRow: highlightTableRow, interactive: interactive, sectionAnchorId: sectionAnchorId, onPrdPick: onPrdPick }, `${section.title}-${i}`))) }));
}
function BlockRenderer({ block, sectionTitle, dense = false, highlightTableRow = null, interactive = false, sectionAnchorId, onPrdPick, }) {
    switch (block.type) {
        case 'paragraph':
            return _jsx("p", { className: "text-sm text-text-secondary leading-relaxed", children: block.text });
        case 'list':
            return _jsx(ListTable, { items: block.items, columns: listColumnsFor(sectionTitle) });
        case 'checklist':
            return _jsx(ChecklistTable, { items: block.items, dense: dense });
        case 'subsection':
            return (_jsxs("div", { children: [_jsxs("h5", { className: "font-semibold text-dark mb-2 flex items-center text-sm", children: [_jsx(FaIcon, { className: `${subsectionIcon(block.title)} mr-2 text-primary text-xs` }), block.title] }), _jsx("div", { className: dense ? 'space-y-2' : 'space-y-3', children: block.blocks.map((inner, j) => (_jsx(BlockRenderer, { block: inner, sectionTitle: sectionTitle, dense: dense, highlightTableRow: highlightTableRow, interactive: interactive, sectionAnchorId: sectionAnchorId, onPrdPick: onPrdPick }, `${block.title}-${j}`))) })] }));
        case 'changelog-entry':
            return (_jsxs("div", { className: "border border-border rounded-lg p-4 bg-stone-50/50", children: [_jsxs("div", { className: "font-semibold text-primary text-sm", children: [block.entry.date, " \u00B7 ", block.entry.summary] }), block.entry.body.length > 0 && (_jsx("p", { className: "mt-2 text-sm text-text-secondary leading-relaxed", children: block.entry.body.join(' ') }))] }));
        case 'table':
            return (_jsx(LogicTable, { headers: block.headers, rows: block.rows, dense: dense, highlightFirstColumn: highlightTableRow, interactive: interactive && !!sectionAnchorId, onRowClick: sectionAnchorId && onPrdPick
                    ? (rowLabel) => onPrdPick({
                        anchorId: sectionAnchorId,
                        rowLabel,
                        sectionTitle,
                    })
                    : undefined }));
        default:
            return null;
    }
}
function listColumnsFor(sectionTitle) {
    if (sectionTitle === '痛点')
        return ['序号', '痛点', '说明'];
    if (sectionTitle === '诉求与目标')
        return ['序号', '目标项'];
    return ['序号', '项目', '说明'];
}
export function LogicDocCard({ id, title, icon, children, dense = false, highlighted = false, interactive = false, onHeaderClick, }) {
    const headerCls = `bg-stone-50 border-b border-border-light ${dense ? 'px-3 py-2' : 'px-4 py-3'}`;
    return (_jsxs("div", { id: id, className: `border rounded-lg overflow-hidden bg-white transition-shadow duration-300 ${dense ? 'mb-2' : 'mb-4'} ${highlighted ? 'border-primary ring-2 ring-primary/25 shadow-soft' : 'border-border'}`, children: [interactive && onHeaderClick ? (_jsx("button", { type: "button", className: `${headerCls} w-full text-left hover:bg-primary/5 transition-colors cursor-pointer`, onClick: onHeaderClick, children: _jsxs("h4", { className: `font-semibold text-dark flex items-center ${dense ? 'text-xs' : 'text-sm'}`, children: [_jsx(FaIcon, { className: `${icon} text-primary mr-2` }), title, _jsx(FaIcon, { className: "fas fa-crosshairs ml-auto text-[10px] text-primary/40", "aria-hidden": true })] }) })) : (_jsx("div", { className: headerCls, children: _jsxs("h4", { className: `font-semibold text-dark flex items-center ${dense ? 'text-xs' : 'text-sm'}`, children: [_jsx(FaIcon, { className: `${icon} text-primary mr-2` }), title] }) })), _jsx("div", { className: dense ? 'p-2.5' : 'p-4', children: children })] }));
}
function ListTable({ items, columns }) {
    const hasLabel = columns.length >= 3;
    return (_jsx(LogicTable, { headers: columns, rows: items.map((item, i) => {
            if (hasLabel) {
                return [
                    String(i + 1),
                    item.label ?? item.text,
                    item.label ? item.text : '—',
                ];
            }
            return [String(i + 1), item.label ? `${item.label}：${item.text}` : item.text];
        }) }));
}
function ChecklistTable({ items, dense = false }) {
    return (_jsx(LogicTable, { dense: dense, headers: ['序号', '验收项', '状态'], rows: items.map((item, i) => [
            String(i + 1),
            item.text,
            item.checked ? (_jsxs("span", { className: "inline-flex items-center gap-1 text-success text-xs font-medium", children: [_jsx(FaIcon, { className: "fas fa-check" }), "\u5DF2\u901A\u8FC7"] }, "ok")) : (_jsxs("span", { className: "inline-flex items-center gap-1 text-text-muted text-xs", children: [_jsx(FaIcon, { className: "fas fa-minus" }), "\u5F85\u9A8C\u6536"] }, "pending")),
        ]) }));
}
function cellText(cell) {
    if (typeof cell === 'string')
        return cell;
    return '';
}
export function LogicTable({ headers, rows, dense = false, highlightFirstColumn = null, interactive = false, onRowClick, }) {
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: `logic-table min-w-full border border-border rounded ${dense ? 'text-xs' : 'text-sm'}`, children: [_jsx("thead", { className: "bg-stone-50", children: _jsx("tr", { children: headers.map((h) => (_jsx("th", { className: `text-left font-medium text-dark border-b border-border-light whitespace-nowrap ${dense ? 'px-2 py-1.5' : 'px-3 py-2'}`, children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: rows.map((row, ri) => {
                        const labelCol = headers.findIndex((h) => /按钮|检索项|列名|字段|逻辑项|触发条件|步骤|规则项|区块|展示内容/.test(h));
                        const matchCol = labelCol >= 0 ? labelCol : 0;
                        const label = cellText(row[matchCol]);
                        const rowHit = highlightFirstColumn &&
                            (label.includes(highlightFirstColumn) || highlightFirstColumn.includes(label));
                        const clickable = interactive && onRowClick && label;
                        return (_jsx("tr", { className: `${rowHit ? 'bg-primary/10 ring-1 ring-inset ring-primary/30' : 'hover:bg-stone-50/80'} ${clickable ? 'cursor-pointer hover:bg-primary/5' : ''}`, onClick: clickable ? () => onRowClick(label) : undefined, role: clickable ? 'button' : undefined, tabIndex: clickable ? 0 : undefined, onKeyDown: clickable
                                ? (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onRowClick(label);
                                    }
                                }
                                : undefined, children: row.map((cell, ci) => (_jsx("td", { className: `${ci === 0 ? 'text-dark w-10' : 'text-text-secondary'} ${dense ? 'px-2 py-1.5' : 'px-3 py-2'} ${rowHit && ci === matchCol ? 'font-semibold text-primary' : ''}`, children: cell }, ci))) }, ri));
                    }) })] }) }));
}
export { parseRequirementsDoc };
