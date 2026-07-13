import { jsx as _jsx } from "react/jsx-runtime";
import { LogicTable } from './RequirementsDocView';
function ChangelogDetailCell({ items }) {
    if (!items.length)
        return _jsx("span", { className: "text-text-muted", children: "\u2014" });
    return (_jsx("ul", { className: "changelog-items m-0 pl-4 list-disc marker:text-text-muted space-y-1", children: items.map((item, i) => (_jsx("li", { className: "text-text-secondary leading-relaxed", children: item }, i))) }));
}
export function ChangelogTable({ rows, dense = false }) {
    if (!rows.length) {
        return _jsx("p", { className: `text-text-muted ${dense ? 'text-xs' : 'text-sm'}`, children: "\u6682\u65E0\u53D8\u66F4\u8BB0\u5F55" });
    }
    return (_jsx(LogicTable, { dense: dense, headers: ['日期', '摘要', '变更内容'], rows: rows.map((row) => [
            row.date,
            row.summary || '—',
            _jsx(ChangelogDetailCell, { items: row.items }, `${row.date}-${row.summary}`),
        ]) }));
}
