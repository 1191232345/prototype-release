import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { changelogRowsFromBlocks } from '@prototype/runtime/changelog';
import { filterDocSections, parseRequirementsDoc, subsectionIcon, } from '@prototype/runtime/parseRequirementsDoc';
import { findPrdSectionElement, scrollPrdSectionIntoView, sectionDomId } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
import { ChangelogTable } from './ChangelogTable';
export function RequirementsDocView({ text, compact = false, dense = false, pageScope = null, highlightKey = null, highlightTableRow = null, locateToken = 0, scrollContainerRef = null, interactive = false, onPrdPick, editable = false, sectionEditor, }) {
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
    return (_jsxs("div", { ref: contentRef, className: `logic-doc ${dense ? 'logic-doc--dense' : ''}`, children: [!compact && (_jsxs("div", { className: "mb-6 flex items-center gap-3 pb-4 border-b border-border-light", children: [_jsx(FaIcon, { className: "fas fa-book text-primary text-lg" }), _jsx("h1", { className: "font-semibold text-primary text-lg", children: doc.title })] })), sections.length === 0 && pageScope ? (_jsxs("p", { className: `text-text-muted ${dense ? 'text-xs' : 'text-sm'}`, children: ["\u5F53\u524D\u9875\u9762\uFF08", pageScope, "\uFF09\u6682\u65E0 PRD \u4EA4\u4E92\u89C4\u683C\u7AE0\u8282"] })) : null, sections.map((section) => {
                const sectionKey = section.anchorId ?? section.title;
                const isEditing = !!sectionEditor && editable && sectionEditor.editingKey === sectionKey;
                return (_jsx(LogicDocCard, { id: sectionDomId(section), title: section.title, icon: section.icon, dense: dense, highlighted: isHighlighted(section) && !isEditing, interactive: interactive && !!section.anchorId && !isEditing, onHeaderClick: section.anchorId && onPrdPick && !isEditing
                        ? () => onPrdPick({
                            anchorId: section.anchorId,
                            rowLabel: null,
                            sectionTitle: section.title,
                        })
                        : undefined, actions: editable && sectionEditor && !isEditing ? (_jsx("button", { type: "button", className: "ml-auto inline-flex items-center justify-center w-7 h-7 rounded text-text-muted hover:text-primary hover:bg-primary/8 transition-colors", title: "\u7F16\u8F91\u8BE5\u7AE0\u8282", "aria-label": "\u7F16\u8F91\u8BE5\u7AE0\u8282", onClick: () => sectionEditor.startEdit(section), children: _jsx(FaIcon, { className: "fas fa-pen text-[11px]" }) })) : null, children: _jsx(SectionBody, { section: section, dense: dense, highlightTableRow: isHighlighted(section) ? highlightTableRow : null, interactive: interactive, sectionAnchorId: section.anchorId, onPrdPick: onPrdPick }) }, sectionKey));
            })] }));
}
function SectionBody({ section, dense = false, highlightTableRow = null, interactive = false, sectionAnchorId, onPrdPick, }) {
    if (!section.blocks.length) {
        return _jsx("p", { className: `text-text-muted ${dense ? 'text-xs' : 'text-sm'}`, children: "\u6682\u65E0\u5185\u5BB9" });
    }
    if (section.title === '变更记录') {
        return _jsx(ChangelogTable, { rows: changelogRowsFromBlocks(section.blocks), dense: dense });
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
export function LogicDocCard({ id, title, icon, children, dense = false, highlighted = false, interactive = false, onHeaderClick, actions, }) {
    const headerCls = `bg-stone-50 border-b border-border-light ${dense ? 'px-3 py-2' : 'px-4 py-3'}`;
    const actionsNode = actions ? _jsx("div", { className: "ml-auto flex items-center gap-1", children: actions }) : null;
    return (_jsxs("div", { id: id, className: `border rounded-lg overflow-hidden bg-white transition-shadow duration-300 ${dense ? 'mb-2' : 'mb-4'} ${highlighted ? 'border-primary ring-2 ring-primary/25 shadow-soft' : 'border-border'}`, children: [interactive && onHeaderClick ? (_jsx("button", { type: "button", className: `${headerCls} w-full text-left hover:bg-primary/5 transition-colors cursor-pointer`, onClick: onHeaderClick, children: _jsxs("h4", { className: `font-semibold text-dark flex items-center ${dense ? 'text-xs' : 'text-sm'}`, children: [_jsx(FaIcon, { className: `${icon} text-primary mr-2` }), title, _jsx(FaIcon, { className: "fas fa-crosshairs ml-auto text-[10px] text-primary/40", "aria-hidden": true })] }) })) : (_jsxs("div", { className: `${headerCls} flex items-center`, children: [_jsxs("h4", { className: `font-semibold text-dark flex items-center ${dense ? 'text-xs' : 'text-sm'}`, children: [_jsx(FaIcon, { className: `${icon} text-primary mr-2` }), title] }), actionsNode] })), _jsx("div", { className: dense ? 'p-2.5' : 'p-4', children: children })] }));
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
export function PrdSectionEditModal({ section, sectionEditor, project, originalPrdText, onClose, }) {
    const draft = sectionEditor.draft;
    if (!draft)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-label": "\u7F16\u8F91 PRD \u7AE0\u8282", onClick: (e) => {
            if (e.target === e.currentTarget && !sectionEditor.saving)
                onClose();
        }, children: _jsxs("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden", children: [_jsxs("div", { className: "px-5 py-3.5 border-b border-border-light flex items-center gap-2.5 bg-stone-50/60", children: [_jsx(FaIcon, { className: "fas fa-pen text-primary text-sm shrink-0" }), _jsx("h3", { className: "font-semibold text-dark text-base truncate flex-1 min-w-0", children: draft.title }), draft.anchorId && (_jsx("span", { className: "text-[10px] font-mono text-text-muted bg-stone-100 px-1.5 py-0.5 rounded shrink-0", children: draft.anchorId })), _jsx("button", { type: "button", className: "inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-dark hover:bg-stone-200 transition-colors shrink-0", title: "\u5173\u95ED", "aria-label": "\u5173\u95ED", onClick: onClose, disabled: sectionEditor.saving, children: _jsx(FaIcon, { className: "fas fa-times" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: draft.blocks.length === 0 ? (_jsx("p", { className: "text-text-muted text-sm text-center py-8", children: "\u6682\u65E0\u5185\u5BB9" })) : (draft.blocks.map((block, i) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[10px] font-medium text-text-muted uppercase tracking-wide", children: block.type === 'table' ? '表格' : block.type === 'paragraph' ? '段落' : block.type === 'list' ? '列表' : block.type === 'checklist' ? '检查项' : block.type === 'subsection' ? '子章节' : block.type }), _jsx("span", { className: "flex-1 h-px bg-border-light" })] }), _jsx(EditableBlockRenderer, { block: block, blockIndex: i, dense: false, sectionEditor: sectionEditor })] }, `${draft.title}-${i}`)))) }), _jsxs("div", { className: "px-5 py-3 border-t border-border-light flex items-center gap-2 bg-stone-50/60", children: [_jsxs("button", { type: "button", className: "btn btn-primary py-2 px-5 text-sm", disabled: sectionEditor.saving, onClick: () => {
                                if (section) {
                                    void sectionEditor.save(project, originalPrdText, section);
                                }
                            }, children: [_jsx(FaIcon, { className: `fas ${sectionEditor.saving ? 'fa-spinner fa-spin' : 'fa-check'} mr-1.5` }), "\u4FDD\u5B58"] }), _jsx("button", { type: "button", className: "btn btn-secondary py-2 px-5 text-sm", disabled: sectionEditor.saving, onClick: sectionEditor.cancelEdit, children: "\u53D6\u6D88" }), sectionEditor.error ? (_jsxs("span", { className: "text-xs text-red-600 ml-2 flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle" }), sectionEditor.error] })) : null, sectionEditor.message ? (_jsxs("span", { className: "text-xs text-emerald-700 ml-2 flex items-center gap-1", children: [_jsx(FaIcon, { className: "fas fa-check-circle" }), sectionEditor.message] })) : null] })] }) }));
}
function EditableBlockRenderer({ block, blockIndex, dense = false, sectionEditor, }) {
    switch (block.type) {
        case 'paragraph':
            return (_jsx("textarea", { className: "w-full resize-y rounded-lg border border-border bg-white p-3 text-sm text-dark leading-relaxed outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-shadow", rows: Math.max(3, block.text.split('\n').length + 1), value: block.text, onChange: (e) => sectionEditor.updateDraft((draft) => {
                    const target = draft.blocks[blockIndex];
                    if (target && target.type === 'paragraph') {
                        target.text = e.target.value;
                    }
                }) }));
        case 'table':
            return (_jsx(EditableTable, { headers: block.headers, rows: block.rows, dense: dense, onHeadersChange: (headers) => sectionEditor.updateDraft((draft) => {
                    const target = draft.blocks[blockIndex];
                    if (target && target.type === 'table') {
                        target.headers = headers;
                    }
                }), onChange: (rows) => sectionEditor.updateDraft((draft) => {
                    const target = draft.blocks[blockIndex];
                    if (target && target.type === 'table') {
                        target.rows = rows;
                    }
                }) }));
        case 'list':
        case 'checklist':
        case 'subsection':
        case 'changelog-entry':
        default:
            return (_jsx(BlockRenderer, { block: block, sectionTitle: "", dense: dense, highlightTableRow: null, interactive: false }));
    }
}
export function EditableTable({ headers, rows, onChange, onHeadersChange, dense = false, }) {
    const colCount = headers.length;
    const inputCls = dense
        ? 'px-1.5 py-1 text-xs'
        : 'px-2.5 py-2 text-sm';
    const updateHeader = (ci, value) => {
        if (!onHeadersChange)
            return;
        const next = headers.map((h, i) => (i === ci ? value : h));
        onHeadersChange(next);
    };
    const updateCell = (ri, ci, value) => {
        const next = rows.map((row, i) => {
            if (i !== ri)
                return row;
            const newRow = [...row];
            newRow[ci] = value;
            return newRow;
        });
        onChange(next);
    };
    const addRow = () => {
        const newRow = Array.from({ length: colCount }, () => '');
        onChange([...rows, newRow]);
    };
    const removeRow = (ri) => {
        onChange(rows.filter((_, i) => i !== ri));
    };
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: _jsxs("table", { className: "min-w-full border-collapse", children: [_jsx("thead", { className: "bg-stone-50", children: _jsxs("tr", { children: [headers.map((h, ci) => (_jsx("th", { className: "text-left border-b border-border-light border-r border-r-border-light last:border-r-0 whitespace-nowrap", children: _jsx("input", { type: "text", className: `w-full bg-transparent font-semibold text-dark outline-none focus:bg-primary/5 ${inputCls}`, value: h, onChange: (e) => updateHeader(ci, e.target.value), "aria-label": `表头 ${ci + 1}` }) }, ci))), _jsx("th", { className: "border-b border-border-light w-10", "aria-label": "\u884C\u64CD\u4F5C" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: rows.map((row, ri) => (_jsxs("tr", { className: "hover:bg-stone-50/50 transition-colors", children: [headers.map((_, ci) => (_jsx("td", { className: "border-r border-r-border-light last:border-r-0", children: _jsx("input", { type: "text", className: `w-full bg-transparent text-dark outline-none focus:bg-primary/8 ${inputCls}`, value: row[ci] ?? '', onChange: (e) => updateCell(ri, ci, e.target.value), "aria-label": `单元格 ${ri + 1}-${ci + 1}` }) }, ci))), _jsx("td", { className: "text-center", children: _jsx("button", { type: "button", className: "inline-flex items-center justify-center w-7 h-7 rounded text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors", title: "\u5220\u9664\u8BE5\u884C", "aria-label": "\u5220\u9664\u8BE5\u884C", onClick: () => removeRow(ri), children: _jsx(FaIcon, { className: "fas fa-trash text-[10px]" }) }) })] }, ri))) })] }) }), _jsxs("button", { type: "button", className: "inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark font-medium", onClick: addRow, children: [_jsx(FaIcon, { className: "fas fa-plus text-[10px]" }), "\u6DFB\u52A0\u884C"] })] }));
}
