import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { resolveProjectDir } from './delete-project-dir.mjs';
import { isPublishViewerStale } from './build-publish-viewer.mjs';

const RECORDS_FILE = 'publish-records.json';

function recordsPath(root) {
  const dir = path.join(root, 'data');
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, RECORDS_FILE);
}

function readAllRecords(root) {
  const file = recordsPath(root);
  if (!fs.existsSync(file)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function writeAllRecords(root, records) {
  fs.writeFileSync(recordsPath(root), `${JSON.stringify(records, null, 2)}\n`, 'utf8');
}

export function recordKey(projectKey, target) {
  return `${projectKey}::${target}`;
}

function collectProjectFiles(sourceDir) {
  const files = [];
  const push = (relative) => {
    const abs = path.join(sourceDir, relative);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      files.push(relative.replace(/\\/g, '/'));
    }
  };

  push('flow.json');
  push('meta.json');
  push('PRD.md');
  push('REQUIREMENTS.md');
  push('CHANGELOG.md');
  push('changelog.json');

  const pagesDir = path.join(sourceDir, 'pages');
  if (fs.existsSync(pagesDir)) {
    for (const name of fs.readdirSync(pagesDir).sort()) {
      if (name.endsWith('.json')) push(`pages/${name}`);
    }
  }

  return files.sort();
}

/** 计算项目内容指纹（含预览 viewer 是否过期） */
export function computePublishFingerprint(root, sourceDir) {
  const parts = [];
  for (const relative of collectProjectFiles(sourceDir)) {
    parts.push(relative);
    parts.push(fs.readFileSync(path.join(sourceDir, relative), 'utf8'));
  }

  const viewerIndex = path.join(root, 'dist/publish-viewer/index.html');
  if (fs.existsSync(viewerIndex)) {
    parts.push('__viewer__');
    parts.push(fs.readFileSync(viewerIndex, 'utf8'));
  } else {
    parts.push('__viewer__');
    parts.push('missing');
  }

  const hash = crypto.createHash('sha256').update(parts.join('\0')).digest('hex').slice(0, 16);
  const viewerStale = isPublishViewerStale();
  return { contentHash: hash, viewerStale };
}

export function getPublishRecord(root, projectKey, target) {
  const records = readAllRecords(root);
  return records[recordKey(projectKey, target)] ?? null;
}

export function savePublishRecord(root, projectKey, target, record) {
  const records = readAllRecords(root);
  records[recordKey(projectKey, target)] = {
    ...record,
    projectKey,
    target,
    updatedAt: new Date().toISOString(),
  };
  writeAllRecords(root, records);
  return records[recordKey(projectKey, target)];
}

/**
 * @returns {{
 *   hasPublished: boolean,
 *   isStale: boolean,
 *   staleReasons: string[],
 *   contentHash: string,
 *   viewerStale: boolean,
 *   record: object | null,
 * }}
 */
export function getPublishStatus(root, projectKey, target) {
  const sourceDir = resolveProjectDir(root, projectKey);
  if (!sourceDir || !fs.existsSync(sourceDir)) {
    throw new Error(`本地项目不存在：${projectKey}`);
  }

  const { contentHash, viewerStale } = computePublishFingerprint(root, sourceDir);
  const record = getPublishRecord(root, projectKey, target);
  const hasPublished = Boolean(record?.previewUrl);

  if (!hasPublished) {
    return {
      hasPublished: false,
      isStale: true,
      staleReasons: ['尚未发布'],
      contentHash,
      viewerStale,
      record: null,
    };
  }

  const staleReasons = [];
  if (record.contentHash !== contentHash) staleReasons.push('项目内容有变更');
  if (viewerStale) staleReasons.push('预览组件有更新');

  return {
    hasPublished: true,
    isStale: staleReasons.length > 0,
    staleReasons,
    contentHash,
    viewerStale,
    record,
  };
}

export function shouldSkipPublish(root, projectKey, target, { force = false } = {}) {
  if (force) return { skip: false, status: getPublishStatus(root, projectKey, target) };

  const status = getPublishStatus(root, projectKey, target);
  if (!status.hasPublished) return { skip: false, status };
  if (status.isStale) return { skip: false, status };

  return { skip: true, status };
}

export function recordFromPublishResult(status, result, contentHash) {
  const prev = status.record ?? {};
  return {
    contentHash,
    publishedAt: new Date().toISOString(),
    previewUrl: result.previewUrl || prev.previewUrl || '',
    prdPreviewUrl: result.prdPreviewUrl || prev.prdPreviewUrl || '',
    requirementsPreviewUrl: result.requirementsPreviewUrl || prev.requirementsPreviewUrl || '',
    uploadId: result.uploadId || prev.uploadId || '',
    commit: result.commit || prev.commit || '',
    pagesDeployMessage: result.pagesDeployMessage || prev.pagesDeployMessage || '',
  };
}
