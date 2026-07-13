export function parseChangelogHeadingLine(line) {
    const h2 = line.match(/^##\s+(\d{4}-\d{2}-\d{2})(?:\s*[·•]\s*(.+?)|（([^）]+)）)?\s*$/);
    if (h2) {
        return { date: h2[1], summary: (h2[2] || h2[3] || '').trim() };
    }
    const h3 = line.match(/^###\s+(\d{4}-\d{2}-\d{2})(?:\s*[·•]\s*(.+?))?\s*$/);
    if (h3) {
        return { date: h3[1], summary: (h3[2] || '').trim() };
    }
    return null;
}
function normalizeBullet(text) {
    return text.replace(/^[-*]\s+/, '').trim();
}
export function parseChangelogMarkdown(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const rows = [];
    let current = null;
    const flush = () => {
        if (current && (current.summary || current.items.length)) {
            rows.push(current);
        }
        current = null;
    };
    for (const raw of lines) {
        const line = raw.trimEnd();
        if (line.startsWith('# '))
            continue;
        if (line.startsWith('## ') || line.startsWith('### ')) {
            const parsed = parseChangelogHeadingLine(line);
            if (parsed) {
                flush();
                current = { date: parsed.date, summary: parsed.summary, items: [] };
                continue;
            }
        }
        if (!current)
            continue;
        const subBullet = line.match(/^\s+[-*]\s+(.*)$/);
        if (subBullet) {
            current.items.push(normalizeBullet(subBullet[1]));
            continue;
        }
        const bullet = line.match(/^[-*]\s+(.*)$/);
        if (bullet) {
            current.items.push(normalizeBullet(bullet[1]));
            continue;
        }
        if (line.trim()) {
            current.items.push(line.trim());
        }
    }
    flush();
    return rows;
}
export function normalizeChangelogBodyLines(body) {
    return body
        .map((line) => normalizeBullet(line))
        .filter(Boolean);
}
