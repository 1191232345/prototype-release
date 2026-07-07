import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { getPublishSettings } from './settings-store.mjs';
import { renderDocHtml } from './render-doc-html.mjs';
import {
  docPreviewUrl,
  materializeProjectBundle,
  normalizeRepoPath,
  preparePublishBundle,
  previewUrl,
  publishPreviewDeployMessage,
} from './publish-bundle.mjs';
import {
  computePublishFingerprint,
  recordFromPublishResult,
  savePublishRecord,
  shouldSkipPublish,
} from './publish-record.mjs';

const PUBLISH_CACHE_DIRNAME = 'github-publish-cache';
const PAGES_HINT =
  '已推送到远程仓库。静态 Pages 约 1–3 分钟后生效。' +
  'Gitee：请在仓库「服务 → Gitee Pages」启用并填写 Pages 预览前缀。' +
  'GitHub：请在 Settings → Pages 启用 Deploy from a branch，Folder 选 / (root)。';

/** @type {import('node:child_process').ExecFileSyncOptions} */
const GIT_OPTS = { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] };

function runGit(args, cwd, timeout = 120_000) {
  try {
    return execFileSync('git', args, { ...GIT_OPTS, cwd, timeout });
  } catch (err) {
    if (err.killed || err.signal === 'SIGTERM') {
      throw new Error('Git 操作超时，请检查网络或 GitHub 访问');
    }
    if (err.code === 'ENOENT') {
      throw new Error('未找到 git 命令，请先安装 Git');
    }
    const stderr = err.stderr?.toString?.() || err.message || '';
    const stdout = err.stdout?.toString?.() || '';
    throw new Error(stderr.trim() || stdout.trim() || 'Git 命令失败');
  }
}

function authRepoUrl(repoUrl, token) {
  const url = new URL(repoUrl.trim());
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) {
    throw new Error('仓库地址格式无效，示例：https://gitee.com/owner/repo.git');
  }
  const host = url.hostname.toLowerCase();
  if (!host.includes('github.com') && !host.includes('gitee.com')) {
    throw new Error('请使用 GitHub 或 Gitee 仓库地址');
  }
  const safeToken = encodeURIComponent(token.trim());
  url.username = 'x-access-token';
  url.password = safeToken;
  return url.toString();
}

function gitWorkdir(root) {
  const dir = path.join(root, 'data');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function publishCacheDir(root) {
  return path.join(gitWorkdir(root), PUBLISH_CACHE_DIRNAME);
}

function listRemoteBranches(authUrl, root) {
  const output = runGit(['ls-remote', '--heads', authUrl], gitWorkdir(root));
  const branches = [];
  for (const line of output.split('\n')) {
    const parts = line.split('\t');
    if (parts.length === 2 && parts[1].startsWith('refs/heads/')) {
      branches.push(parts[1].slice('refs/heads/'.length));
    }
  }
  return branches;
}

function resolveBranch(authUrl, preferred, root) {
  const pref = preferred.trim() || 'main';
  const branches = listRemoteBranches(authUrl, root);
  if (branches.length === 0) return pref;
  if (branches.includes(pref)) return pref;

  const sym = runGit(['ls-remote', '--symref', authUrl, 'HEAD'], gitWorkdir(root));
  for (const line of sym.split('\n')) {
    if (line.startsWith('ref:')) {
      const match = line.match(/refs\/heads\/(\S+)/);
      if (match) return match[1];
    }
  }
  for (const fallback of ['main', 'master']) {
    if (branches.includes(fallback)) return fallback;
  }
  return branches[0];
}

function initEmptyRepo(checkout, authUrl, branch) {
  if (fs.existsSync(checkout)) fs.rmSync(checkout, { recursive: true, force: true });
  fs.mkdirSync(checkout, { recursive: true });
  runGit(['init'], checkout);
  runGit(['remote', 'add', 'origin', authUrl], checkout);
  runGit(['checkout', '-b', branch], checkout);
}

function cloneRepo(checkout, authUrl, branch) {
  fs.mkdirSync(path.dirname(checkout), { recursive: true });
  if (fs.existsSync(checkout)) fs.rmSync(checkout, { recursive: true, force: true });
  try {
    runGit(['clone', '--depth', '1', '--branch', branch, authUrl, path.basename(checkout)], path.dirname(checkout));
    return true;
  } catch {
    return false;
  }
}

function discardLocalChanges(checkout) {
  const status = runGit(['status', '--porcelain'], checkout);
  if (!status.trim()) return;
  runGit(['reset', '--hard', 'HEAD'], checkout);
  runGit(['clean', '-fd'], checkout);
}

function syncWithRemote(checkout, branch) {
  try {
    runGit(['pull', '--rebase', '--autostash', 'origin', branch], checkout);
    return;
  } catch (err) {
    const stderr = err.message.toLowerCase();
    if (stderr.includes("couldn't find remote ref") || stderr.includes('not found')) return;
    runGit(['fetch', 'origin', branch], checkout);
    runGit(['reset', '--hard', `origin/${branch}`], checkout);
    runGit(['clean', '-fd'], checkout);
  }
}

function ensureRepo(checkout, authUrl, branch, root) {
  const resolved = resolveBranch(authUrl, branch, root);
  if (fs.existsSync(path.join(checkout, '.git'))) {
    runGit(['remote', 'set-url', 'origin', authUrl], checkout);
    const current = runGit(['rev-parse', '--abbrev-ref', 'HEAD'], checkout).trim();
    if (current && current !== resolved) {
      runGit(['checkout', '-B', resolved], checkout);
    }
    discardLocalChanges(checkout);
    syncWithRemote(checkout, resolved);
    return resolved;
  }

  if (listRemoteBranches(authUrl, root).length === 0) {
    initEmptyRepo(checkout, authUrl, resolved);
    return resolved;
  }

  if (!cloneRepo(checkout, authUrl, resolved)) {
    throw new Error(
      `无法克隆分支「${resolved}」。请确认 GitHub 仓库地址、Token（repo 权限）及设置中的分支名称是否正确。`,
    );
  }
  return resolved;
}

function slugTitle(title) {
  const text = title.trim().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fff-]+/g, '');
  return text.slice(0, 40) || 'project';
}

function publishResult({
  previewUrl: preview = '',
  prdPreviewUrl = '',
  requirementsPreviewUrl = '',
  commitId = '',
  deployMessage = PAGES_HINT,
  pagesDeployTriggered = true,
  skipped = false,
  publishedAt = '',
  contentHash = '',
  isStale = false,
} = {}) {
  return {
    previewUrl: preview,
    prdPreviewUrl,
    requirementsPreviewUrl,
    commit: commitId,
    pagesDeployTriggered,
    pagesDeployMessage: deployMessage,
    skipped,
    publishedAt,
    contentHash,
    isStale,
  };
}

const SKIP_MESSAGE = '远程预览已是最新，无需重复推送。';

/**
 * 发布项目到 GitHub / Gitee 远程仓库。
 */
export function publishProject(root, projectKey, options = {}) {
  const { title = '', hasPrd = false, hasRequirements = false, force = false } = options;
  const settings = getPublishSettings(root);
  if (!settings.configured) {
    throw new Error('请先在设置中配置 GitHub 发布参数（仓库地址、Token、Pages 前缀）');
  }

  const target = 'github';
  const { skip, status } = shouldSkipPublish(root, projectKey, target, { force });
  if (skip && status.record) {
    return publishResult({
      previewUrl: status.record.previewUrl,
      prdPreviewUrl: status.record.prdPreviewUrl,
      requirementsPreviewUrl: status.record.requirementsPreviewUrl,
      commitId: status.record.commit,
      deployMessage: SKIP_MESSAGE,
      pagesDeployTriggered: false,
      skipped: true,
      publishedAt: status.record.publishedAt,
      contentHash: status.contentHash,
      isStale: false,
    });
  }

  const authUrl = authRepoUrl(settings.repoUrl, settings.accessToken);
  const checkout = publishCacheDir(root);
  const repoPath = normalizeRepoPath(settings.repoPath);
  const bundle = preparePublishBundle(root, projectKey, { title, hasPrd, hasRequirements });

  let prototypePreview = '';
  let prdPreview = '';
  let requirementsPreview = '';

  const branch = ensureRepo(checkout, authUrl, settings.branch, root);

  const remoteUrl = runGit(['remote', 'get-url', 'origin'], checkout).trim();
  if (remoteUrl && !remoteUrl.includes(settings.accessToken)) {
    runGit(['remote', 'set-url', 'origin', authUrl], checkout);
  }

  const { viewerRebuilt } = materializeProjectBundle(
    checkout,
    repoPath,
    bundle.publishPath,
    bundle.sourceDir,
  );

  const prdPath = path.join(bundle.sourceDir, 'PRD.md');
  const reqPath = path.join(bundle.sourceDir, 'REQUIREMENTS.md');

  if (bundle.hasPrdFile) {
    const destDir = path.join(checkout, 'docs', ...bundle.publishPath.split('/'));
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(
      path.join(destDir, 'prd.html'),
      renderDocHtml(root, fs.readFileSync(prdPath, 'utf8'), { kind: 'prd', title: bundle.docTitle }),
      'utf8',
    );
    prdPreview = docPreviewUrl(settings.pagesBaseUrl, bundle.publishPath, 'prd');
  }
  if (bundle.hasReqFile) {
    const destDir = path.join(checkout, 'docs', ...bundle.publishPath.split('/'));
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(
      path.join(destDir, 'requirements.html'),
      renderDocHtml(root, fs.readFileSync(reqPath, 'utf8'), {
        kind: 'requirements',
        title: bundle.docTitle,
      }),
      'utf8',
    );
    requirementsPreview = docPreviewUrl(settings.pagesBaseUrl, bundle.publishPath, 'requirements');
  }

  if (fs.existsSync(bundle.stagingDir)) fs.rmSync(bundle.stagingDir, { recursive: true, force: true });

  prototypePreview = previewUrl(settings.pagesBaseUrl, repoPath, bundle.publishPath);
  fs.writeFileSync(path.join(checkout, '.nojekyll'), '');

  runGit(['config', 'user.email', 'prototype-archive@local'], checkout);
  runGit(['config', 'user.name', 'Prototype Archive'], checkout);

  const addPaths = ['.nojekyll', repoPath];
  if (bundle.hasPrdFile || bundle.hasReqFile) addPaths.push('docs');
  runGit(['add', '-A', ...addPaths], checkout);

  const parts = [`source ${projectKey}`];
  if (bundle.hasPrdFile) parts.push('prd');
  if (bundle.hasReqFile) parts.push('requirements');
  const msg = `publish ${parts.join(' + ')} (${slugTitle(title) || projectKey})`;

  try {
    runGit(['commit', '-m', msg], checkout);
  } catch (err) {
    const text = err.message.toLowerCase();
    if (text.includes('nothing to commit')) {
      const { contentHash } = computePublishFingerprint(root, bundle.sourceDir);
      const noop = publishResult({
        previewUrl: prototypePreview,
        prdPreviewUrl: prdPreview,
        requirementsPreviewUrl: requirementsPreview,
        deployMessage: `${publishPreviewDeployMessage(viewerRebuilt)} ${SKIP_MESSAGE}`,
        pagesDeployTriggered: false,
        skipped: true,
        contentHash,
        isStale: false,
      });
      const saved = savePublishRecord(
        root,
        projectKey,
        target,
        recordFromPublishResult(status, noop, contentHash),
      );
      noop.publishedAt = saved.publishedAt;
      return noop;
    }
    throw err;
  }

  runGit(['push', '-u', 'origin', branch], checkout);
  const commitId = runGit(['rev-parse', '--short', 'HEAD'], checkout).trim();

  const { contentHash } = computePublishFingerprint(root, bundle.sourceDir);
  const result = publishResult({
    previewUrl: prototypePreview,
    prdPreviewUrl: prdPreview,
    requirementsPreviewUrl: requirementsPreview,
    commitId,
    deployMessage: `${publishPreviewDeployMessage(viewerRebuilt)} ${PAGES_HINT}`,
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
