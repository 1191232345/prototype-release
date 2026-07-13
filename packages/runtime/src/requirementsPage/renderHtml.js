import { parseRequirementsDoc } from '../parseRequirementsDoc';
import { extractKpis, extractSummary } from './extractSummary';
import { formatStatus, resolveDocHeading, resolvePageTitle } from './formatMeta';
import { reqIcon } from './icons';
import { REQUIREMENTS_PAGE_SCRIPT } from './pageScript';
import { renderBlocksHtml } from './renderBlocks';
import { sectionDisplayNumber, sectionDomSlug, sectionNavIcon } from './sectionIcons';
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
export function renderRequirementsPageHtml(options) {
    const { markdown, meta = {}, pageTitle, cssText = '' } = options;
    const doc = parseRequirementsDoc(markdown);
    const summary = extractSummary(markdown);
    const kpis = extractKpis(markdown);
    const status = formatStatus(meta.status);
    const title = resolvePageTitle(meta, doc.title);
    const heading = resolveDocHeading(meta, doc.title);
    const version = meta.version?.trim() || 'v1';
    const author = meta.author?.trim() || '—';
    const updatedAt = meta.createdAt?.trim() || '—';
    const browserTitle = pageTitle?.trim() || `需求文档 - ${title}`;
    const navItems = doc.sections
        .map((section, index) => {
        const id = sectionDomSlug(section.title, index);
        const icon = sectionNavIcon(section.title);
        const label = section.title.replace(/^[一二三四五六七八九十\d]+[.、\s]+/, '').trim() || section.title;
        return `<li><a href="#${id}">${reqIcon(icon, 'req-icon req-icon--nav')}${escapeHtml(label)}</a></li>`;
    })
        .join('\n');
    const sectionsHtml = doc.sections
        .map((section, index) => {
        const id = sectionDomSlug(section.title, index);
        const num = sectionDisplayNumber(section.title, index);
        const label = section.title.replace(/^[一二三四五六七八九十\d]+[.、\s]+/, '').trim() || section.title;
        const body = renderBlocksHtml(section.blocks, section.title);
        const confirmBanner = /待确认/.test(section.title) && body.includes('<table')
            ? `<div class="confirm-box">${reqIcon('triangle-exclamation')}<span>以下事项需要业务方确认。如无异议按「建议方案」执行；有修改请标注条目编号。</span></div>`
            : '';
        return `<section class="section" id="${id}">
        <h2><span class="sec-num">${num}</span>${escapeHtml(label)}</h2>
        ${confirmBanner}
        ${body || '<p class="text-text-muted">暂无内容</p>'}
      </section>`;
    })
        .join('\n<hr />\n');
    const kpiHtml = kpis.length > 0
        ? `<div class="kpi-strip">${kpis
            .map((kpi) => `<div class="kpi-card">
            <div class="kpi-icon">${reqIcon(kpi.icon, 'req-icon req-icon--kpi')}</div>
            <div class="kpi-val">${escapeHtml(kpi.value)}</div>
            <div class="kpi-label">${escapeHtml(kpi.label)}</div>
          </div>`)
            .join('')}</div>`
        : '';
    const summaryHtml = summary
        ? `<div class="summary">${reqIcon('lightbulb', 'req-icon req-icon--summary')}<div><strong>一句话：</strong>${escapeHtml(summary)}</div></div>`
        : meta.changeSummary
            ? `<div class="summary">${reqIcon('lightbulb', 'req-icon req-icon--summary')}<div>${escapeHtml(meta.changeSummary)}</div></div>`
            : '';
    const statusColor = status.tone === 'warn' ? 'var(--warning)' : status.tone === 'ok' ? 'var(--success)' : 'var(--muted)';
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(browserTitle)}</title>
  <style>${cssText}</style>
</head>
<body>
  <div class="progress-bar" id="progressBar"></div>

  <header class="mobile-header">
    <span class="doc-title">${escapeHtml(title)} PRD</span>
    <button class="menu-btn" id="menuBtn" aria-label="打开目录">
      ${reqIcon('bars', 'req-icon req-icon--menu')}
    </button>
  </header>

  <div class="nav-overlay" id="navOverlay"></div>

  <div class="layout">
    <nav id="sidebar">
      <div class="nav-brand">
        <div class="label">Product Doc</div>
        <div class="title">${escapeHtml(title)}</div>
        <div class="version">${escapeHtml(version)} · ${escapeHtml(updatedAt)}</div>
      </div>
      <h2>目录</h2>
      <ul id="navList">
        ${navItems}
      </ul>
    </nav>

    <main>
      <div class="hero">
        <div class="hero-top">
          <h1>${escapeHtml(heading)}</h1>
          <div class="hero-badges">
            <span class="badge badge-version">${escapeHtml(version)}</span>
            <span class="badge badge-warn">${reqIcon('clock', 'req-icon req-icon--badge')} ${escapeHtml(status.label)}</span>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item"><div class="key">版本</div><div class="val">${escapeHtml(version)}</div></div>
          <div class="meta-item"><div class="key">负责人</div><div class="val">${escapeHtml(author)}</div></div>
          <div class="meta-item"><div class="key">更新日期</div><div class="val">${escapeHtml(updatedAt)}</div></div>
          <div class="meta-item"><div class="key">状态</div><div class="val" style="color:${statusColor};">${escapeHtml(status.label)}</div></div>
        </div>

        ${summaryHtml}
        ${kpiHtml}
      </div>

      ${sectionsHtml}

      <div class="status-bar">
        ${reqIcon('hourglass-half', 'req-icon req-icon--status')}
        <span>文档状态：<strong>${escapeHtml(status.label)}</strong></span>
      </div>
    </main>
  </div>

  <button class="back-top" id="backTop" aria-label="回到顶部">
    ${reqIcon('arrow-up', 'req-icon req-icon--back-top')}
  </button>

  <script>${REQUIREMENTS_PAGE_SCRIPT}</script>
</body>
</html>`;
}
