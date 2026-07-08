import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist', 'publish-viewer');
const indexHtml = path.join(outDir, 'index.html');

function resolvePublishConfig() {
  const js = path.join(root, 'vite.publish.config.js');
  const ts = path.join(root, 'vite.publish.config.js');
  if (fs.existsSync(js)) return js;
  if (fs.existsSync(ts)) return ts;
  throw new Error('缺少 vite.publish.config.js / .ts');
}

function resolveViteBin() {
  const bin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
  if (!fs.existsSync(bin)) {
    throw new Error('未找到 vite，请先在项目目录运行 npm install');
  }
  return bin;
}

/** 发布 viewer 依赖的源码路径，变更后需重新构建 */
function watchPaths() {
  return [
    path.join(root, 'src'),
    path.join(root, 'static'),
    path.join(root, 'publish-preview.html'),
    resolvePublishConfig(),
  ];
}

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
  return watchPaths().some((watchPath) => latestMtime(watchPath) > builtAt);
}

export function buildPublishViewer() {
  const config = resolvePublishConfig();
  execFileSync(process.execPath, [resolveViteBin(), 'build', '--config', config], {
    cwd: root,
    stdio: 'inherit',
    timeout: 120_000,
    env: process.env,
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
