import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist', 'publish-viewer');
const indexHtml = path.join(outDir, 'index.html');

/** 发布 viewer 依赖的源码路径，变更后需重新构建 */
const WATCH_PATHS = [
  path.join(root, 'src'),
  path.join(root, 'static'),
  path.join(root, 'publish-preview.html'),
  path.join(root, 'vite.publish.config.js'),
];

function latestMtime(targetPath) {
  if (!fs.existsSync(targetPath)) return 0;
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return stat.mtimeMs;
  let latest = stat.mtimeMs;
  for (const name of fs.readdirSync(targetPath)) {
    latest = Math.max(latest, latestMtime(path.join(targetPath, name)));
  }
  return latest;
}

export function isPublishViewerStale() {
  if (!fs.existsSync(indexHtml)) return true;
  const builtAt = fs.statSync(indexHtml).mtimeMs;
  return WATCH_PATHS.some((watchPath) => latestMtime(watchPath) > builtAt);
}

export function buildPublishViewer() {
  execFileSync('npx', ['vite', 'build', '--config', 'vite.publish.config.js'], {
    cwd: root,
    stdio: 'inherit',
    timeout: 120_000,
  });
  const builtHtml = path.join(outDir, 'publish-preview.html');
  if (fs.existsSync(builtHtml)) {
    fs.renameSync(builtHtml, indexHtml);
  }
  if (!fs.existsSync(indexHtml)) {
    throw new Error('发布预览构建失败：未生成 dist/publish-viewer/index.html');
  }
}

/** 若 viewer 缺失或源码已更新，则自动重新构建 */
export function ensurePublishViewer() {
  if (isPublishViewerStale()) {
    buildPublishViewer();
    return { rebuilt: true };
  }
  return { rebuilt: false };
}

export function getPublishViewerDir() {
  return outDir;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { rebuilt } = ensurePublishViewer();
  if (rebuilt) {
    console.log('Built publish viewer → dist/publish-viewer/');
  } else {
    console.log('Publish viewer is up to date → dist/publish-viewer/');
  }
}
