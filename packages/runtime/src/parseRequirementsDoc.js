const SECTION_ICONS = {
    现状: 'fas fa-play-circle',
    痛点: 'fas fa-exclamation-triangle',
    诉求与目标: 'fas fa-bullseye',
    范围边界: 'fas fa-border-all',
    验收标准: 'fas fa-clipboard-check',
    变更记录: 'fas fa-history',
    'Executive Summary': 'fas fa-lightbulb',
    执行摘要: 'fas fa-lightbulb',
    'User Experience & Functionality': 'fas fa-users',
    用户体验与功能: 'fas fa-users',
    'AI System Requirements': 'fas fa-robot',
    AI系统需求: 'fas fa-robot',
    'Technical Specifications': 'fas fa-cogs',
    技术规格: 'fas fa-cogs',
    'Risks & Roadmap': 'fas fa-road',
    风险与路线图: 'fas fa-road',
    'User Stories': 'fas fa-book-open',
    用户故事: 'fas fa-book-open',
    'Non-Goals': 'fas fa-ban',
    非目标: 'fas fa-ban',
    页面交互规格: 'fas fa-sitemap',
};
function sectionIcon(title) {
    if (SECTION_ICONS[title])
        return SECTION_ICONS[title];
    if (title.includes('初始化') || title.includes('数据展示'))
        return 'fas fa-play-circle';
    if (title.includes('检索'))
        return 'fas fa-search';
    if (title.includes('列表属性') || title.includes('列字段'))
        return 'fas fa-table';
    if (title.includes('展示样式'))
        return 'fas fa-palette';
    if (title.includes('主要按钮'))
        return 'fas fa-mouse-pointer';
    if (title.includes('列表按钮'))
        return 'fas fa-ellipsis-h';
    if (title.includes('状态变更'))
        return 'fas fa-sitemap';
    if (title.includes('详情弹窗'))
        return 'fas fa-window-maximize';
    if (title.includes('表单字段'))
        return 'fas fa-list-alt';
    if (title.includes('验证'))
        return 'fas fa-check-circle';
    if (title.includes('交互逻辑'))
        return 'fas fa-exchange-alt';
    return 'fas fa-file-alt';
}
function parseTableRow(line) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|'))
        return null;
    return trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
}
function isTableSeparator(cells) {
    return cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c));
}
const SUBSECTION_ICONS = {
    做: 'fas fa-check',
    不做: 'fas fa-times',
};
function flushTable(blocks, headers, rows) {
    if (headers?.length && rows.length) {
        blocks.push({ type: 'table', headers, rows: [...rows] });
    }
}
function parseListLine(line) {
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (!bullet)
        return null;
    const content = bullet[1].trim();
    const bold = content.match(/^\*\*(.+?)\*\*[：:]\s*(.*)$/);
    if (bold)
        return { label: bold[1], text: bold[2] || '—' };
    return { text: content };
}
function parseCheckLine(line) {
    const unchecked = line.match(/^-\s+\[\s\]\s+(.*)$/);
    if (unchecked)
        return { text: unchecked[1].trim(), checked: false };
    const checked = line.match(/^-\s+\[[xX]\]\s+(.*)$/);
    if (checked)
        return { text: checked[1].trim(), checked: true };
    return null;
}
import { parseChangelogHeadingLine } from './changelog/parseChangelog';
function flushList(blocks, items) {
    if (items.length)
        blocks.push({ type: 'list', items: [...items] });
}
function flushSubsection(blocks, title, subBlocks) {
    if (subBlocks.length)
        blocks.push({ type: 'subsection', title, blocks: [...subBlocks] });
}
function flushChecklist(blocks, items) {
    if (items.length)
        blocks.push({ type: 'checklist', items: [...items] });
}
const ANCHOR_SUFFIX_RE = /\s*\{#([a-z0-9._-]+)\}\s*$/i;
export function parseSectionHeading(raw) {
    const m = raw.match(ANCHOR_SUFFIX_RE);
    if (m)
        return { title: raw.slice(0, m.index).trim(), anchorId: m[1] };
    return { title: raw.trim() };
}
export function inferPageScope(title, anchorId) {
    if (anchorId) {
        const page = anchorId.split('.')[0];
        if (page && page !== anchorId)
            return page;
    }
    if (title.includes('列表页'))
        return 'list';
    if (title.includes('表单页'))
        return 'form';
    return undefined;
}
export function filterDocSections(sections, pageScope) {
    if (!pageScope)
        return sections;
    const aliases = new Set([pageScope]);
    if (pageScope === 'task')
        aliases.add('form');
    if (pageScope === 'form')
        aliases.add('task');
    return sections.filter((s) => s.pageScope && aliases.has(s.pageScope));
}
export function parseRequirementsDoc(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    let title = '需求文档';
    const sections = [];
    let current = null;
    let listBuf = [];
    let checkBuf = [];
    let subTitle = null;
    let subBlocks = [];
    let subListBuf = [];
    let subTableHeaders = null;
    let subTableRows = [];
    let changelogEntry = null;
    let tableHeaders = null;
    let tableRows = [];
    let lastContentLine = 0;
    const finishTable = () => {
        if (current)
            flushTable(current.blocks, tableHeaders, tableRows);
        tableHeaders = null;
        tableRows = [];
    };
    const finishSubTable = () => {
        flushTable(subBlocks, subTableHeaders, subTableRows);
        subTableHeaders = null;
        subTableRows = [];
    };
    const flushSubList = () => {
        flushList(subBlocks, subListBuf);
        subListBuf = [];
    };
    const finishSubsection = () => {
        if (current && subTitle) {
            finishSubTable();
            flushSubList();
            flushSubsection(current.blocks, subTitle, subBlocks);
            subTitle = null;
            subBlocks = [];
            subListBuf = [];
        }
    };
    const finishChangelogEntry = () => {
        if (current && changelogEntry) {
            current.blocks.push({ type: 'changelog-entry', entry: changelogEntry });
            changelogEntry = null;
        }
    };
    const finishSection = () => {
        if (!current)
            return;
        finishTable();
        flushList(current.blocks, listBuf);
        listBuf = [];
        flushChecklist(current.blocks, checkBuf);
        checkBuf = [];
        finishSubsection();
        finishChangelogEntry();
        current.endLine = lastContentLine;
        sections.push(current);
        current = null;
    };
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const raw = lines[lineIdx];
        const line = raw.trimEnd();
        if (line.trim())
            lastContentLine = lineIdx;
        if (line.startsWith('# ')) {
            finishSection();
            title = line.slice(2).trim();
            continue;
        }
        if (line.startsWith('## ')) {
            finishSection();
            const { title: sectionTitle, anchorId } = parseSectionHeading(line.slice(3));
            current = {
                title: sectionTitle,
                icon: sectionIcon(sectionTitle),
                blocks: [],
                anchorId,
                pageScope: inferPageScope(sectionTitle, anchorId),
                startLine: lineIdx,
                endLine: lineIdx,
            };
            continue;
        }
        if (!current)
            continue;
        if (line.startsWith('### ')) {
            finishTable();
            flushList(current.blocks, listBuf);
            listBuf = [];
            flushChecklist(current.blocks, checkBuf);
            checkBuf = [];
            const heading = line.slice(4).trim();
            if (current.title === '变更记录') {
                finishChangelogEntry();
                const parsed = parseChangelogHeadingLine(line);
                if (parsed) {
                    changelogEntry = { ...parsed, body: [] };
                }
                continue;
            }
            finishSubsection();
            subTitle = parseSectionHeading(heading).title;
            subBlocks = [];
            subListBuf = [];
            subTableHeaders = null;
            subTableRows = [];
            continue;
        }
        if (current.title === '变更记录' && changelogEntry) {
            if (!line.trim())
                continue;
            changelogEntry.body.push(line.trim());
            continue;
        }
        if (subTitle) {
            const tableCells = parseTableRow(line);
            if (tableCells) {
                flushSubList();
                if (!subTableHeaders) {
                    subTableHeaders = tableCells;
                    continue;
                }
                if (isTableSeparator(tableCells))
                    continue;
                subTableRows.push(tableCells);
                continue;
            }
            finishSubTable();
            const item = parseListLine(line);
            if (item) {
                subListBuf.push(item);
                continue;
            }
            if (!line.trim())
                continue;
            flushSubList();
            const text = line.trim().startsWith('>') ? line.trim().replace(/^>\s*/, '') : line.trim();
            subBlocks.push({ type: 'paragraph', text });
            continue;
        }
        const tableCells = parseTableRow(line);
        if (tableCells) {
            flushList(current.blocks, listBuf);
            listBuf = [];
            flushChecklist(current.blocks, checkBuf);
            checkBuf = [];
            if (!tableHeaders) {
                tableHeaders = tableCells;
                continue;
            }
            if (isTableSeparator(tableCells))
                continue;
            tableRows.push(tableCells);
            continue;
        }
        finishTable();
        const check = parseCheckLine(line);
        if (check) {
            checkBuf.push(check);
            continue;
        }
        const listItem = parseListLine(line);
        if (listItem) {
            listBuf.push(listItem);
            continue;
        }
        if (!line.trim())
            continue;
        flushList(current.blocks, listBuf);
        listBuf = [];
        current.blocks.push({ type: 'paragraph', text: line.trim() });
    }
    finishSection();
    return { title, sections };
}
export function subsectionIcon(title) {
    return SUBSECTION_ICONS[title] ?? 'fas fa-circle';
}
