export function serializeSection(section) {
    const lines = [];
    if (section.anchorId) {
        lines.push(`## ${section.title} {#${section.anchorId}}`);
    }
    else {
        lines.push(`## ${section.title}`);
    }
    for (const block of section.blocks) {
        lines.push(...serializeBlock(block));
    }
    return lines;
}
function serializeBlock(block) {
    switch (block.type) {
        case 'paragraph':
            return ['', block.text];
        case 'list':
            return ['', ...block.items.map((item) => serializeListItem(item))];
        case 'checklist':
            return ['', ...block.items.map((item) => `- [${item.checked ? 'x' : ' '}] ${item.text}`)];
        case 'table':
            return serializeTable(block.headers, block.rows);
        case 'subsection':
            return ['', `### ${block.title}`, ...block.blocks.flatMap(serializeBlock)];
        case 'changelog-entry':
            return [`### ${block.entry.date} · ${block.entry.summary}`, ...block.entry.body];
        default:
            return [];
    }
}
function serializeListItem(item) {
    if (item.label) {
        return `- **${item.label}**：${item.text}`;
    }
    return `- ${item.text}`;
}
function serializeTable(headers, rows) {
    if (!headers.length)
        return [];
    const lines = [''];
    const colWidths = headers.map((h, i) => {
        const maxRowLen = Math.max(...rows.map((r) => (r[i] ?? '').length), h.length);
        return Math.max(maxRowLen, 3);
    });
    lines.push(`| ${headers.map((h, i) => padCell(h, colWidths[i])).join(' | ')} |`);
    lines.push(`| ${colWidths.map((w) => '-'.repeat(w)).join(' | ')} |`);
    for (const row of rows) {
        lines.push(`| ${headers.map((_, i) => padCell(row[i] ?? '', colWidths[i])).join(' | ')} |`);
    }
    return lines;
}
function padCell(text, width) {
    if (text.length >= width)
        return text;
    return text + ' '.repeat(width - text.length);
}
