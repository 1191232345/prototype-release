import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { ProjectDocPanel } from './ProjectDocPanel';
import { FaIcon } from '@prototype/ui/Icon';
export function SplitReviewPrdDrawer({ project, docWidth, pageScope, docRef, activeTab, sectionEditor, originalPrdText, highlightKey, highlightTableRow, locateToken, onStartResize, }) {
    const isPrdTab = activeTab === 'prd';
    return (_jsxs(_Fragment, { children: [_jsx("div", { role: "separator", "aria-orientation": "vertical", "aria-label": "\u62D6\u62FD\u8C03\u6574\u9762\u677F\u5BBD\u5EA6", className: "split-review-resizer hidden md:flex group", onPointerDown: (e) => {
                    e.preventDefault();
                    onStartResize(e.clientX);
                }, children: _jsx(FaIcon, { className: "fas fa-grip-vertical text-[10px] text-text-muted/30 group-hover:text-primary/50 transition-colors" }) }), _jsx("aside", { className: "split-review-drawer split-review-drawer--open md:rounded-lg md:border md:border-border-light md:shadow-card flex flex-col min-h-0 bg-white shrink-0 max-md:!w-[min(100vw,420px)] overflow-hidden", style: { width: docWidth }, children: _jsx(ProjectDocPanel, { ref: docRef, project: project, tab: activeTab, embedded: true, dense: true, pageScope: isPrdTab ? pageScope : null, highlightKey: isPrdTab ? highlightKey : null, highlightTableRow: isPrdTab ? highlightTableRow : null, locateToken: isPrdTab ? locateToken : 0, editable: isPrdTab, sectionEditor: sectionEditor, originalPrdText: originalPrdText }) })] }));
}
