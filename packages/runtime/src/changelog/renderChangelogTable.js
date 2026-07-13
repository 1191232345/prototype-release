import { normalizeChangelogBodyLines, parseChangelogMarkdown } from './parseChangelog';
export function changelogRowsFromBlocks(blocks) {
    return blocks
        .filter((block) => block.type === 'changelog-entry')
        .map((block) => ({
        date: block.entry.date,
        summary: block.entry.summary,
        items: normalizeChangelogBodyLines(block.entry.body),
    }));
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function renderItemsHtml(items) {
    if (!items.length)
        return '<span class="changelog-empty">—</span>';
    const lis = items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    return `<ul class="changelog-items">${lis}</ul>`;
}
export function renderChangelogTableHtml(rows) {
    if (!rows.length) {
        return '<p class="changelog-empty">暂无变更记录</p>';
    }
    const trs = rows
        .map((row) => `<tr>
        <td class="changelog-date">${escapeHtml(row.date)}</td>
        <td class="changelog-summary">${escapeHtml(row.summary || '—')}</td>
        <td class="changelog-detail">${renderItemsHtml(row.items)}</td>
      </tr>`)
        .join('');
    return `<div class="table-wrap changelog-table-wrap">
    <table class="changelog-table">
      <thead><tr><th>日期</th><th>摘要</th><th>变更内容</th></tr></thead>
      <tbody>${trs}</tbody>
    </table>
  </div>`;
}
export const CHANGELOG_PAGE_CSS = `
body { margin: 0; padding: 24px 20px 48px; background: #f5f3ef; color: #1c1917;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; line-height: 1.7; }
.changelog-page { max-width: 1080px; margin: 0 auto; background: #fffcf8; border: 1px solid #e7e5e4;
  border-radius: 12px; padding: 28px 32px; box-shadow: 0 1px 3px rgba(28,25,23,.06); }
.changelog-page h1 { margin: 0 0 20px; font-size: 20px; color: #9a3412; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px; }
.changelog-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.changelog-table th, .changelog-table td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #e7e5e4; vertical-align: top; }
.changelog-table th { background: #f5f3ef; color: #57534e; font-size: 12px; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
.changelog-table tbody tr:hover td { background: #faf9f7; }
.changelog-date { width: 108px; font-weight: 600; color: #1c1917; white-space: nowrap; }
.changelog-summary { width: 180px; color: #57534e; }
.changelog-items { margin: 0; padding-left: 1.1em; }
.changelog-items li { margin: 4px 0; color: #57534e; }
.changelog-empty { color: #78716c; }
`;
export function renderChangelogPageHtml(title, markdown) {
    const rows = parseChangelogMarkdown(markdown);
    const safeTitle = escapeHtml(title);
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>${CHANGELOG_PAGE_CSS}</style>
</head>
<body>
  <article class="changelog-page">
    <h1>${safeTitle}</h1>
    ${renderChangelogTableHtml(rows)}
  </article>
</body>
</html>`;
}
