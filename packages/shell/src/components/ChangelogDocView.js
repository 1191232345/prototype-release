import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogicDocCard } from './RequirementsDocView';
import { FaIcon } from '@prototype/ui/Icon';
export function ChangelogDocView({ text, title }) {
    const sections = parseChangelogMarkdown(text);
    return (_jsxs("div", { className: "logic-doc", children: [title && (_jsxs("div", { className: "mb-6 flex items-center gap-3 pb-4 border-b border-border-light", children: [_jsx(FaIcon, { className: "fas fa-bullhorn text-accent text-lg" }), _jsx("h1", { className: "font-semibold text-accent text-lg", children: title })] })), sections.map((section) => (_jsx(LogicDocCard, { title: section.heading, icon: "fas fa-history", children: section.items.length > 0 ? (_jsx("ul", { className: "space-y-3 text-sm text-text-secondary", children: section.items.map((item, i) => (_jsxs("li", { className: "border border-border rounded-lg p-3 bg-stone-50/50", children: [item.title && (_jsx("div", { className: "font-semibold text-dark mb-1", children: item.title })), item.lines.length > 0 && (_jsx("ul", { className: "space-y-1 pl-4 list-disc marker:text-text-muted", children: item.lines.map((line, j) => (_jsx("li", { children: line }, j))) }))] }, i))) })) : (section.paragraphs.map((p, i) => (_jsx("p", { className: "text-sm text-text-secondary", children: p }, i)))) }, section.heading)))] }));
}
function parseChangelogMarkdown(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const sections = [];
    let current = null;
    let currentItem = null;
    const finishItem = () => {
        if (current && currentItem) {
            current.items.push(currentItem);
            currentItem = null;
        }
    };
    const finishSection = () => {
        finishItem();
        if (current) {
            sections.push(current);
            current = null;
        }
    };
    for (const raw of lines) {
        const line = raw.trimEnd();
        if (line.startsWith('# '))
            continue;
        if (line.startsWith('## ')) {
            finishSection();
            current = { heading: line.slice(3).trim(), items: [], paragraphs: [] };
            continue;
        }
        if (!current)
            continue;
        const boldItem = line.match(/^-\s+\*\*(.+?)\*\*\s*$/);
        if (boldItem) {
            finishItem();
            currentItem = { title: boldItem[1], lines: [] };
            continue;
        }
        const subBullet = line.match(/^\s+-\s+(.*)$/);
        if (subBullet && currentItem) {
            currentItem.lines.push(subBullet[1].trim());
            continue;
        }
        const bullet = line.match(/^-\s+(.*)$/);
        if (bullet) {
            finishItem();
            current.items.push({ lines: [bullet[1].trim()] });
            continue;
        }
        if (line.trim()) {
            finishItem();
            current.paragraphs.push(line.trim());
        }
    }
    finishSection();
    return sections;
}
