import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { getServerPublishSettings } from './settings-store.mjs';
import {
  docPreviewUrl,
  materializeProjectBundle,
  normalizeRepoPath,
  persistPublishedBundle,
  preparePublishBundle,
  previewUrl,
  publishedRoot,
  publishPreviewDeployMessage,
} from './publish-bundle.mjs';
import {
  computePublishFingerprint,
  getPublishStatus,
  recordFromPublishResult,
  savePublishRecord,
  shouldSkipPublish,
} from './publish-record.mjs';

const UPLOAD_TIMEOUT_MS = 120_000;

function zipDirectory(sourceDir, zipPath) {
  const absZipPath = path.resolve(zipPath);
  fs.mkdirSync(path.dirname(absZipPath), { recursive: true });
  if (fs.existsSync(absZipPath)) fs.rmSync(absZipPath);
  // Zip staging contents (prototype/, docs/) directly — not the staging folder name.
  execFileSync('zip', ['-r', '-q', absZipPath, '.'], { cwd: sourceDir, timeout: 60_000 });
  return absZipPath;
}

function buildUploadUrl(uploadUrl, token) {
  const url = new URL(uploadUrl.trim());
  url.searchParams.set('token', token.trim());
  return url.toString();
}

function parseUploadResponse(text) {
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(text.trim() || '远程服务器返回无效响应');
  }
}

function isUsablePreviewUrl(url, publishPath) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    const pathname = decodeURIComponent(parsed.pathname || '/');
    if (pathname === '/' || pathname === '') return false;
    if (publishPath && pathname.includes(publishPath)) return true;
    if (publishPath && pathname.includes(publishPath.split('/')[0])) return true;
    return pathname.length > 1;
  } catch {
    return false;
  }
}

async function uploadArchive(uploadUrl, token, zipPath, fields) {
  const fileBuffer = fs.readFileSync(zipPath);
  const blob = new Blob([fileBuffer], { type: 'application/zip' });
  const form = new FormData();
  form.append('file', blob, path.basename(zipPath));
  for (const [key, value] of Object.entries(fields)) {
    if (value != null && String(value).trim()) form.append(key, String(value));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  try {
    const res = await fetch(buildUploadUrl(uploadUrl, token), {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    const text = await res.text();
    const data = parseUploadResponse(text);
    if (!res.ok) {
      throw new Error(data.error || data.message || text.trim() || `上传失败 (${res.status})`);
    }
    if (data.error) throw new Error(String(data.error));
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('上传超时，请检查远程服务器状态或网络连接');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}


function publishResult({
  previewUrl: preview = '',
  prdPreviewUrl = '',
  requirementsPreviewUrl = '',
  uploadId = '',
  deployMessage = publishPreviewDeployMessage(),
  skipped = false,
  publishedAt = '',
  contentHash = '',
  isStale = false,
} = {}) {
  return {
    previewUrl: preview,
    prdPreviewUrl,
    requirementsPreviewUrl,
    uploadId,
    pagesDeployTriggered: !skipped,
    pagesDeployMessage: deployMessage,
    skipped,
    publishedAt,
    contentHash,
    isStale,
  };
}

const SKIP_MESSAGE = '远程预览已是最新，无需重复上传。';

async function isPreviewReachable(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const res = await fetch(url.trim(), {
      method: 'HEAD',
      signal: AbortSignal.timeout(8_000),
      redirect: 'follow',
    });
    if (res.ok) return true;
    if (res.status === 405 || res.status === 501) {
      const getRes = await fetch(url.trim(), {
        method: 'GET',
        signal: AbortSignal.timeout(8_000),
        redirect: 'follow',
      });
      return getRes.ok;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * 发布项目到远程 Node 预览服务器。
 * @param {string} root - prototype-archive 根目录
 * @param {string} projectKey - 如 rule-config/v1
 * @param {{ title?: string, hasPrd?: boolean, hasRequirements?: boolean }} options
 */
export async function publishProjectToServer(root, projectKey, options = {}) {
  const { title = '', hasPrd = false, hasRequirements = false, force = false } = options;
  const settings = getServerPublishSettings(root);
  if (!settings.configured) {
    throw new Error('请先在设置中配置远程服务器参数（上传地址、Token、预览前缀）');
  }

  const target = 'server';
  let { skip, status } = shouldSkipPublish(root, projectKey, target, { force });
  let remoteMissing = false;
  if (skip && status.record?.previewUrl) {
    const reachable = await isPreviewReachable(status.record.previewUrl);
    if (!reachable) {
      skip = false;
      remoteMissing = true;
    }
  }
  if (skip && status.record) {
    return publishResult({
      previewUrl: status.record.previewUrl,
      prdPreviewUrl: status.record.prdPreviewUrl,
      requirementsPreviewUrl: status.record.requirementsPreviewUrl,
      uploadId: status.record.uploadId,
      deployMessage: SKIP_MESSAGE,
      skipped: true,
      publishedAt: status.record.publishedAt,
      contentHash: status.contentHash,
      isStale: false,
    });
  }

  const repoPath = normalizeRepoPath(settings.repoPath);
  const bundle = preparePublishBundle(root, projectKey, { title, hasPrd, hasRequirements });
  const { viewerRebuilt } = materializeProjectBundle(
    bundle.stagingDir,
    repoPath,
    bundle.publishPath,
    bundle.sourceDir,
  );

  persistPublishedBundle(root, bundle.stagingDir);

  // 上传完整 published 目录，避免远程服务器按包覆盖时只剩最后一次发布的项目
  const publishedDir = publishedRoot(root);
  const zipPath = zipDirectory(
    publishedDir,
    path.join(bundle.stagingDir, '..', `${bundle.publishPath.replace(/\//g, '_')}.zip`),
  );

  let remote;
  try {
    remote = await uploadArchive(settings.uploadUrl, settings.accessToken, zipPath, {
      projectKey,
      publishPath: bundle.publishPath,
      publishId: bundle.meta.id,
      title: title || bundle.meta.title || projectKey,
      repoPath,
    });
  } finally {
    if (fs.existsSync(zipPath)) fs.rmSync(zipPath, { force: true });
    if (fs.existsSync(bundle.stagingDir)) fs.rmSync(bundle.stagingDir, { recursive: true, force: true });
  }

  const computedPrototypePreview = previewUrl(settings.previewBaseUrl, repoPath, bundle.publishPath);
  const computedPrdPreview = bundle.hasPrdFile
    ? docPreviewUrl(settings.previewBaseUrl, bundle.publishPath, 'prd')
    : '';
  const computedRequirementsPreview = bundle.hasReqFile
    ? docPreviewUrl(settings.previewBaseUrl, bundle.publishPath, 'requirements')
    : '';

  const prototypePreview = isUsablePreviewUrl(remote.previewUrl, bundle.publishPath)
    ? remote.previewUrl
    : isUsablePreviewUrl(remote.url, bundle.publishPath)
      ? remote.url
      : computedPrototypePreview;
  const prdPreview = bundle.hasPrdFile
    ? isUsablePreviewUrl(remote.prdPreviewUrl, bundle.publishPath)
      ? remote.prdPreviewUrl
      : isUsablePreviewUrl(remote.prdUrl, bundle.publishPath)
        ? remote.prdUrl
        : computedPrdPreview
    : '';
  const requirementsPreview = bundle.hasReqFile
    ? isUsablePreviewUrl(remote.requirementsPreviewUrl, bundle.publishPath)
      ? remote.requirementsPreviewUrl
      : isUsablePreviewUrl(remote.requirementsUrl, bundle.publishPath)
        ? remote.requirementsUrl
        : computedRequirementsPreview
    : '';

  const { contentHash } = computePublishFingerprint(root, bundle.sourceDir);

  const reachable = await isPreviewReachable(prototypePreview);
  if (!reachable) {
    throw new Error(
      `上传完成但预览链接不可访问：${prototypePreview}。请检查远程服务器静态目录配置（repoPath=${repoPath}）或联系运维。`,
    );
  }

  const deployHint = remoteMissing ? '检测到远程预览已失效，已重新上传。' : '';
  const result = publishResult({
    previewUrl: prototypePreview,
    prdPreviewUrl: prdPreview,
    requirementsPreviewUrl: requirementsPreview,
    uploadId: remote.id || remote.uploadId || '',
    deployMessage: `${deployHint}${publishPreviewDeployMessage(viewerRebuilt)}`.trim(),
    contentHash,
    isStale: false,
  });

  const saved = savePublishRecord(
    root,
    projectKey,
    target,
    recordFromPublishResult(status, result, contentHash),
  );
  result.publishedAt = saved.publishedAt;
  return result;
}
