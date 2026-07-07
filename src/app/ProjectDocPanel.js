import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { RequirementsDocView } from '../components/RequirementsDocView';
import { ChangelogDocView } from '../components/ChangelogDocView';
import { PrdDocView } from '../components/PrdDocView';
import { getDocTabConfig } from '../lib/docTabs';
import { FaIcon } from '@prototype/ui/Icon';
export const ProjectDocPanel = forwardRef(function ProjectDocPanel({ project, tab, embedded = false, dense = false, pageScope = null, highlightKey = null, highlightTableRow = null, locateToken = 0, interactive = false, onPrdPick, }, ref) {
    const config = getDocTabConfig(tab);
    const requirements = project.requirementsText?.trim();
    const prd = project.prdText?.trim();
    const changelog = project.changelogText?.trim();
    const scrollContainerRef = ref;
    return (_jsx("div", { ref: ref, className: `flex-1 overflow-auto min-w-0 bg-surface ${embedded ? 'min-h-0' : ''}`, children: _jsx("div", { className: dense
                ? 'px-2 py-2 logic-doc--dense'
                : embedded
                    ? 'px-3 sm:px-4 py-3'
                    : 'max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6', children: tab === 'requirements' ? (requirements ? (_jsx(RequirementsDocView, { text: requirements, compact: embedded || dense, dense: dense })) : (_jsx(EmptyDoc, { icon: "fa-file-alt", title: "\u6682\u65E0\u9700\u6C42\u6587\u6863", hint: `创建或迭代时 AI 将写入 ${config.file}` }))) : tab === 'prd' ? (prd ? (_jsx(PrdDocView, { text: prd, compact: embedded, dense: dense, pageScope: pageScope, highlightKey: highlightKey, highlightTableRow: highlightTableRow, locateToken: locateToken, scrollContainerRef: scrollContainerRef, interactive: interactive, onPrdPick: onPrdPick })) : (_jsx(EmptyDoc, { icon: "fa-file-contract", title: "\u6682\u65E0 PRD", hint: "\u521B\u5EFA\u6216\u8FED\u4EE3\u65F6 AI \u53EF\u5199\u5165 PRD.md\uFF08\u4EA7\u54C1\u9700\u6C42\u89C4\u683C\uFF09" }))) : changelog ? (_jsx(ChangelogDocView, { text: changelog, title: `变更记录 - ${project.meta.title}` })) : (_jsx(EmptyDoc, { icon: "fa-history", title: "\u6682\u65E0\u53D8\u66F4\u8BB0\u5F55", hint: "\u8FED\u4EE3\u540E AI \u5C06\u8FFD\u52A0 CHANGELOG.md" })) }) }));
});
function EmptyDoc({ icon, title, hint }) {
    return (_jsxs("div", { className: "text-center py-20", children: [_jsx("div", { className: "w-14 h-14 mx-auto mb-4 rounded-2xl bg-white border border-border-light flex items-center justify-center", children: _jsx(FaIcon, { className: `fas ${icon} text-xl text-text-muted/40` }) }), _jsx("p", { className: "text-sm font-semibold text-dark", children: title }), _jsx("p", { className: "text-xs text-text-muted mt-2 max-w-xs mx-auto leading-relaxed", children: hint })] }));
}
