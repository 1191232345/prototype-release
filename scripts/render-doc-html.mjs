import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { renderRequirementsPageForPublish } from './requirements-template.mjs';

const DOC_KIND_META = {
  prd: { label: 'PRD 文档', class: 'prd' },
  requirements: { label: '需求文档', class: 'requirements' },
  manual: { label: '操作手册', class: 'manual' },
};

let cssCache = null;

function loadDocCss(root) {
  if (cssCache) return cssCache;
  const cssPath = path.join(root, 'static', 'doc-preview.css');
  cssCache = fs.readFileSync(cssPath, 'utf8');
  return cssCache;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]+/g, '');
}

function wrapTables(bodyHtml) {
  return bodyHtml.replace(/<table>/g, '<div class="doc-preview__table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
}

function buildToc(headings) {
  if (headings.length === 0) return '';
  const items = headings
    .map((h) => `<li><a href="#${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`)
    .join('\n');
  return `<nav class="doc-preview__toc" aria-label="文档目录">
      <p class="doc-preview__toc-title">目录</p>
      <div class="doc-preview__toc-scroll">
        <ul>${items}</ul>
      </div>
    </nav>`;
}

function extractHeadings(markdownText) {
  const headings = [];
  for (const line of markdownText.split('\n')) {
    const match = line.match(/^(#{1,4})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length;
    if (level > 3) continue;
    const text = match[2].trim();
    headings.push({ level, text, id: slugifyHeading(text) });
  }
  return headings;
}

function addHeadingIds(html, headings) {
  let idx = 0;
  return html.replace(/<h([1-3])>([^<]+)<\/h\1>/g, (full, level, text) => {
    const heading = headings[idx];
    idx += 1;
    if (!heading) return full;
    return `<h${level} id="${escapeHtml(heading.id)}">${text}</h${level}>`;
  });
}

export function renderDocHtml(root, markdownText, { kind, title = '', meta: projectMeta = null }) {
  const meta = DOC_KIND_META[kind];
  if (!meta) throw new Error(`不支持的文档类型: ${kind}`);

  if (kind === 'requirements') {
    return renderRequirementsPageForPublish(root, markdownText, {
      meta: projectMeta || {},
      title,
    });
  }

  const headings = extractHeadings(markdownText);
  let body = marked.parse(markdownText.trim(), { gfm: true, breaks: true });
  body = addHeadingIds(body, headings);
  body = wrapTables(body);
  const tocNav = buildToc(headings.filter((h) => h.level <= 2));

  const lines = markdownText.split('\n').length;
  const pageTitle = title.trim() || meta.label;
  const safeTitle = escapeHtml(pageTitle);
  const css = loadDocCss(root);

  const bodyLayout = tocNav
    ? `<div class="doc-preview__body doc-preview__body--with-toc">
      ${tocNav}
      <div class="doc-preview__content">
${body}
      </div>
    </div>`
    : `<div class="doc-preview__body">
      <div class="doc-preview__content">
${body}
      </div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <style>${css}</style>
</head>
<body>
  <article class="doc-preview doc-preview--${meta.class}">
    <header class="doc-preview__header">
      <span class="doc-preview__badge doc-preview__badge--${meta.class}">${meta.label}</span>
      <span class="doc-preview__meta">${lines} 行</span>
    </header>
    ${bodyLayout}
  </article>
</body>
</html>
`;
}
