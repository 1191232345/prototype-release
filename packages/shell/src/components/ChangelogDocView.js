import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { parseChangelogMarkdown } from '@prototype/runtime/changelog';
import { ChangelogTable } from './ChangelogTable';
import { FaIcon } from '@prototype/ui/Icon';
export function ChangelogDocView({ text, title, dense = false }) {
    const rows = parseChangelogMarkdown(text);
    return (_jsxs("div", { className: "logic-doc", children: [title && (_jsxs("div", { className: "mb-6 flex items-center gap-3 pb-4 border-b border-border-light", children: [_jsx(FaIcon, { className: "fas fa-bullhorn text-accent text-lg" }), _jsx("h1", { className: "font-semibold text-accent text-lg", children: title })] })), _jsx(ChangelogTable, { rows: rows, dense: dense })] }));
}
