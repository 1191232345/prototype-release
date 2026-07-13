import { changelogRowsFromBlocks, renderChangelogTableHtml } from '../changelog/renderChangelogTable';
import { reqIcon } from './icons';
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function renderScopeCell(cell) {
    if (/✅|本期做/.test(cell)) {
        return `<span class="scope-in">${reqIcon('circle-check')} ${escapeHtml(cell.replace(/✅\s*/, ''))}</span>`;
    }
    if (/⏳|后续做|不做/.test(cell)) {
        return `<span class="scope-out">${reqIcon('clock')} ${escapeHtml(cell.replace(/⏳\s*/, ''))}</span>`;
    }
    return escapeHtml(cell);
}
function renderTable(headers, rows) {
    const ths = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
    const trs = rows
        .map((row) => {
        const tds = row
            .map((cell, ci) => {
            const isScopeCol = /分类|范围/.test(headers[ci] || '') || /✅|⏳/.test(cell);
            const content = isScopeCol ? renderScopeCell(cell) : escapeHtml(cell);
            return `<td>${content}</td>`;
        })
            .join('');
        return `<tr>${tds}</tr>`;
    })
        .join('\n');
    return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
}
function renderList(items) {
    const lis = items
        .map((item) => {
        const text = item.label ? `<strong>${escapeHtml(item.label)}</strong>：${escapeHtml(item.text)}` : escapeHtml(item.text);
        return `<li>${text}</li>`;
    })
        .join('');
    return `<ul>${lis}</ul>`;
}
function renderChecklist(items) {
    const rows = items.map((item, i) => {
        const status = item.checked
            ? `<span class="scope-in">${reqIcon('check')} 已通过</span>`
            : `<span class="scope-out">${reqIcon('minus')} 待验收</span>`;
        return `<tr><td>${i + 1}</td><td>${escapeHtml(item.text)}</td><td>${status}</td></tr>`;
    });
    return `<div class="table-wrap"><table><thead><tr><th>序号</th><th>验收项</th><th>状态</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}
export function renderBlocksHtml(blocks, sectionTitle) {
    if (sectionTitle === '变更记录') {
        return renderChangelogTableHtml(changelogRowsFromBlocks(blocks));
    }
    return blocks
        .map((block) => {
        switch (block.type) {
            case 'paragraph':
                return `<p>${escapeHtml(block.text)}</p>`;
            case 'list':
                return renderList(block.items);
            case 'checklist':
                return renderChecklist(block.items);
            case 'table':
                return renderTable(block.headers, block.rows);
            case 'subsection':
                return `<h3>${escapeHtml(block.title)}</h3>${renderBlocksHtml(block.blocks)}`;
            case 'changelog-entry':
                return '';
            default:
                return '';
        }
    })
        .join('\n');
}
