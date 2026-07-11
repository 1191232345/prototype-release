import fs from 'node:fs';
import path from 'node:path';
import { deriveGithubPagesBaseUrl, githubPublishMissing } from '../packages/shell/src/lib/githubUtils.js';

const DEFAULT_SETTINGS = {
  githubRepoUrl: '',
  githubBranch: 'main',
  githubRepoPath: 'prototypes',
  githubPagesBaseUrl: '',
  githubAccessToken: '',
  serverUploadUrl: 'http://139.196.105.207:3000/upload',
  serverPreviewBaseUrl: 'http://139.196.105.207:3000/',
  serverAccessToken: '',
  serverRepoPath: 'prototype',
  publishTarget: 'server',
};

function maskSecret(value) {
  if (!value) return '';
  if (value.length <= 8) return '***';
  return `${value.slice(0, 3)}...${value.slice(-4)}`;
}

function shouldSkipSecret(value, current) {
  if (value == null) return true;
  const text = String(value).trim();
  if (!text) return false;
  if (text === maskSecret(current)) return true;
  return /^\*{3}|.{3}\.\.\..{4}$/.test(text);
}

export function serverPublishMissing(data) {
  const missing = [];
  const upload = String(data.serverUploadUrl || '').trim();
  const token = String(data.serverAccessToken || '').trim();
  const preview = String(data.serverPreviewBaseUrl || '').trim();
  if (!upload) missing.push('上传地址');
  if (!token) missing.push('Access Token');
  if (!preview) missing.push('预览前缀');
  return missing;
}

export function settingsFilePath(root) {
  return path.join(root, 'settings.json');
}

function readRaw(root) {
  const file = settingsFilePath(root);
  if (!fs.existsSync(file)) {
    const data = { ...DEFAULT_SETTINGS };
    writeRaw(root, data);
    return data;
  }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function writeRaw(root, data) {
  const file = settingsFilePath(root);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export function getPublicConfig(root) {
  const data = readRaw(root);
  const githubRepo = String(data.githubRepoUrl || '').trim();
  let githubPages = String(data.githubPagesBaseUrl || '').trim();
  if (!githubPages && githubRepo) githubPages = deriveGithubPagesBaseUrl(githubRepo);
  const githubMissing = githubPublishMissing(data);
  const serverMissing = serverPublishMissing(data);
  const githubToken = String(data.githubAccessToken || '');
  const serverToken = String(data.serverAccessToken || '');
  const publishTarget = String(data.publishTarget || 'server').trim() === 'github' ? 'github' : 'server';

  return {
    githubRepoUrl: githubRepo,
    githubBranch: String(data.githubBranch || DEFAULT_SETTINGS.githubBranch),
    githubRepoPath: String(data.githubRepoPath || DEFAULT_SETTINGS.githubRepoPath),
    githubPagesBaseUrl: githubPages,
    githubTokenSet: Boolean(githubToken),
    githubTokenMasked: githubToken ? maskSecret(githubToken) : '',
    githubPublishConfigured: githubMissing.length === 0,
    githubPublishMissing: githubMissing,
    serverUploadUrl: String(data.serverUploadUrl || DEFAULT_SETTINGS.serverUploadUrl).trim(),
    serverPreviewBaseUrl: String(data.serverPreviewBaseUrl || DEFAULT_SETTINGS.serverPreviewBaseUrl).trim(),
    serverRepoPath: String(data.serverRepoPath || DEFAULT_SETTINGS.serverRepoPath).trim(),
    serverTokenSet: Boolean(serverToken),
    serverTokenMasked: serverToken ? maskSecret(serverToken) : '',
    serverPublishConfigured: serverMissing.length === 0,
    serverPublishMissing: serverMissing,
    publishTarget,
    publishConfigured: publishTarget === 'github' ? githubMissing.length === 0 : serverMissing.length === 0,
    publishMissing: publishTarget === 'github' ? githubMissing : serverMissing,
  };
}

export function getPublishSettings(root) {
  const data = readRaw(root);
  const repo = String(data.githubRepoUrl || '').trim();
  const token = String(data.githubAccessToken || '').trim();
  let pages = String(data.githubPagesBaseUrl || '').trim();
  if (!pages && repo) pages = deriveGithubPagesBaseUrl(repo);

  return {
    configured: githubPublishMissing(data).length === 0,
    repoUrl: repo,
    branch: String(data.githubBranch || DEFAULT_SETTINGS.githubBranch).trim() || 'main',
    repoPath: String(data.githubRepoPath || DEFAULT_SETTINGS.githubRepoPath).trim() || 'prototypes',
    pagesBaseUrl: pages,
    accessToken: token,
  };
}

export function getServerPublishSettings(root) {
  const data = readRaw(root);
  return {
    configured: serverPublishMissing(data).length === 0,
    uploadUrl: String(data.serverUploadUrl || DEFAULT_SETTINGS.serverUploadUrl).trim(),
    previewBaseUrl: String(data.serverPreviewBaseUrl || DEFAULT_SETTINGS.serverPreviewBaseUrl).trim(),
    repoPath: String(data.serverRepoPath || DEFAULT_SETTINGS.serverRepoPath).trim() || 'prototype',
    accessToken: String(data.serverAccessToken || '').trim(),
  };
}

export function updateConfig(root, payload) {
  const current = readRaw(root);
  const merged = { ...current };

  if ('githubAccessToken' in payload && payload.githubAccessToken != null) {
    const tokenText = String(payload.githubAccessToken).trim();
    if (tokenText && !shouldSkipSecret(tokenText, String(current.githubAccessToken || ''))) {
      merged.githubAccessToken = tokenText;
    }
  }

  if ('serverAccessToken' in payload && payload.serverAccessToken != null) {
    const tokenText = String(payload.serverAccessToken).trim();
    if (tokenText && !shouldSkipSecret(tokenText, String(current.serverAccessToken || ''))) {
      merged.serverAccessToken = tokenText;
    }
  }

  for (const field of [
    'githubRepoUrl',
    'githubBranch',
    'githubRepoPath',
    'githubPagesBaseUrl',
    'serverUploadUrl',
    'serverPreviewBaseUrl',
    'serverRepoPath',
    'publishTarget',
  ]) {
    if (field in payload && payload[field] != null) {
      merged[field] = String(payload[field]).trim();
    }
  }

  if (!String(merged.githubPagesBaseUrl || '').trim() && String(merged.githubRepoUrl || '').trim()) {
    merged.githubPagesBaseUrl = deriveGithubPagesBaseUrl(String(merged.githubRepoUrl));
  }

  writeRaw(root, merged);
  return getPublicConfig(root);
}
