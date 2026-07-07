import fs from 'node:fs';
import path from 'node:path';
import { renderDocHtml } from './render-doc-html.mjs';
import { resolveProjectDir } from './delete-project-dir.mjs';
import { ensurePublishViewer, getPublishViewerDir } from './build-publish-viewer.mjs';

export function normalizeRepoPath(repoPath) {
  const clean = String(repoPath || 'prototypes').trim().replace(/^[/\\]+|[/\\]+$/g, '');
  return clean || 'prototypes';
}

export function normalizePagesBase(url) {
  const clean = url.trim();
  if (!clean) throw new Error('请配置预览地址前缀');
  return clean.endsWith('/') ? clean : `${clean}/`;
}

const PUBLISH_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION_RE = /^v\d+$/;

function readProjectMeta(sourceDir) {
  const metaPath = path.join(sourceDir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    throw new Error('缺少 meta.json，无法发布');
  }
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    throw new Error('meta.json 格式无效');
  }
  return meta;
}

/** 发布 URL 路径：meta.id + version，避免中文项目名无法解析 */
export function resolvePublishPath(meta) {
  const id = String(meta?.id || '').trim();
  const version = String(meta?.version || '').trim();
  if (!PUBLISH_ID_RE.test(id)) {
    throw new Error(
      `meta.json 的 id「${id || '(空)'}」不能用于预览链接，请使用英文小写与连字符（如 express-supplement）`,
    );
  }
  if (!VERSION_RE.test(version)) {
    throw new Error(`meta.json 的 version「${version || '(空)'}」无效，应为 v1、v2 等格式`);
  }
  return `${id}/${version}`;
}

export function previewUrl(pagesBase, repoPath, publishPath) {
  const base = normalizePagesBase(pagesBase);
  const sub = normalizeRepoPath(repoPath);
  return `${base}${sub}/${publishPath}/index.html`;
}

export function docPreviewUrl(pagesBase, publishPath, kind) {
  const base = normalizePagesBase(pagesBase);
  return `${base}docs/${publishPath}/${kind}.html`;
}

export const PUBLISH_PREVIEW_MESSAGE =
  '已发布可交互原型预览，默认动态交互，可切换对照模式与 PRD 面板。';

export function publishPreviewDeployMessage(viewerRebuilt = false) {
  return viewerRebuilt
    ? `${PUBLISH_PREVIEW_MESSAGE}（预览组件已自动更新）`
    : PUBLISH_PREVIEW_MESSAGE;
}

export function copyDir(source, target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

export function mergeCopy(source, target) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const name of fs.readdirSync(source)) {
      mergeCopy(path.join(source, name), path.join(target, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyPublishViewer(destDir, meta) {
  const { rebuilt } = ensurePublishViewer();
  const viewerDir = getPublishViewerDir();

  for (const name of fs.readdirSync(viewerDir)) {
    mergeCopy(path.join(viewerDir, name), path.join(destDir, name));
  }

  patchPublishedIndexHtml(destDir, meta);

  return { viewerRebuilt: rebuilt };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 发布时写入项目标题，浏览器标签与首屏加载即可识别业务 */
function patchPublishedIndexHtml(projectDest, meta) {
  const indexPath = path.join(projectDest, 'index.html');
  if (!fs.existsSync(indexPath) || !meta) return;

  const title = meta.title?.trim() || meta.project?.trim() || '原型预览';
  const version = meta.version?.trim() || '';
  const pageTitle = version ? `${title} · ${version} · 原型预览` : `${title} · 原型预览`;
  const summary = meta.changeSummary?.trim() || '';

  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);

  const bootBanner = [
    '<div id="publish-preview-boot"',
    ' style="position:fixed;inset:0;display:flex;flex-direction:column;background:#F5F3EF;font-family:system-ui,sans-serif;z-index:9999"',
    '>',
    `<header style="flex-shrink:0;background:#1B3A4B;color:#fff;padding:10px 16px;border-bottom:2px solid #E8A838;display:flex;align-items:center;gap:8px">`,
    `<span style="font-weight:600;font-size:13px">ELSA</span>`,
    `<span style="opacity:.35">|</span>`,
    `<span style="font-weight:600;font-size:14px">${escapeHtml(title)}</span>`,
    version
      ? `<span style="font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.15)">${escapeHtml(version)}</span>`
      : '',
    `<span style="margin-left:auto;font-size:11px;color:#F0C060">原型预览</span>`,
    `</header>`,
    `<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#8B93A5;font-size:13px">`,
    `<span>加载 ${escapeHtml(title)}…</span>`,
    `</div>`,
    summary
      ? `<p style="position:absolute;bottom:12px;left:16px;right:16px;text-align:center;font-size:11px;color:#8B93A5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0">${escapeHtml(summary)}</p>`
      : '',
    `</div>`,
  ].join('');

  if (!html.includes('id="publish-preview-boot"')) {
    html = html.replace('<div id="root"></div>', `${bootBanner}\n    <div id="root"></div>`);
  }

  fs.writeFileSync(indexPath, html, 'utf8');
}

function writeDocHtml(destRoot, publishPath, kind, title, markdown, root) {
  const destDir = path.join(destRoot, 'docs', ...publishPath.split('/'));
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, `${kind}.html`), renderDocHtml(root, markdown, { kind, title }), 'utf8');
}

/**
 * 在 staging 目录生成可发布的项目包（源码 + 文档 HTML + 入口页）。
 * 文档是否打包以项目目录下 PRD.md / REQUIREMENTS.md 是否实际存在为准。
 * @returns {{ stagingDir: string, hasPrdFile: boolean, hasReqFile: boolean }}
 */
export function preparePublishBundle(root, projectKey, options = {}) {
  const { title = '' } = options;
  const sourceDir = resolveProjectDir(root, projectKey);
  if (!sourceDir || !fs.existsSync(sourceDir)) {
    throw new Error(`本地项目不存在：${projectKey}`);
  }

  const prdPath = path.join(sourceDir, 'PRD.md');
  const reqPath = path.join(sourceDir, 'REQUIREMENTS.md');
  const hasPrdFile = fs.existsSync(prdPath);
  const hasReqFile = fs.existsSync(reqPath);

  if (!hasPrdFile && !hasReqFile) {
    throw new Error('请至少存在 PRD.md 或 REQUIREMENTS.md 后再发布');
  }

  const meta = readProjectMeta(sourceDir);
  const publishPath = resolvePublishPath(meta);

  const stagingDir = path.join(root, 'data', 'publish-staging', publishPath.replace(/\//g, '_'));
  if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
  fs.mkdirSync(stagingDir, { recursive: true });

  const docTitle = title || meta.title || projectKey;
  const docLinks = [];

  if (hasPrdFile) {
    writeDocHtml(stagingDir, publishPath, 'prd', docTitle, fs.readFileSync(prdPath, 'utf8'), root);
    docLinks.push({ label: 'PRD 文档', href: `../../docs/${publishPath}/prd.html` });
  }
  if (hasReqFile) {
    writeDocHtml(
      stagingDir,
      publishPath,
      'requirements',
      docTitle,
      fs.readFileSync(reqPath, 'utf8'),
      root,
    );
    docLinks.push({ label: '需求文档', href: `../../docs/${publishPath}/requirements.html` });
  }

  return {
    stagingDir,
    hasPrdFile,
    hasReqFile,
    docLinks,
    docTitle,
    sourceDir,
    publishPath,
    meta,
  };
}

export function materializeProjectBundle(stagingDir, repoPath, publishPath, sourceDir) {
  const projectDest = path.join(stagingDir, normalizeRepoPath(repoPath), ...publishPath.split('/'));
  copyDir(sourceDir, projectDest);

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(path.join(sourceDir, 'meta.json'), 'utf8'));
  } catch {
    meta = null;
  }

  const { viewerRebuilt } = copyPublishViewer(projectDest, meta);
  return { viewerRebuilt };
}

/** 本地持久化发布包，供 dev 静态预览与远程不可用时的兜底 */
export function publishedRoot(root) {
  return path.join(root, 'data', 'published');
}

export function persistPublishedBundle(root, stagingDir) {
  const dest = publishedRoot(root);
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(stagingDir)) {
    mergeCopy(path.join(stagingDir, name), path.join(dest, name));
  }
}

export function hasLocalPublishedIndex(root, repoPath, publishPath) {
  const file = path.join(
    publishedRoot(root),
    normalizeRepoPath(repoPath),
    ...publishPath.split('/'),
    'index.html',
  );
  return fs.existsSync(file);
}
