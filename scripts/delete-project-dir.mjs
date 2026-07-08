import fs from 'node:fs';
import path from 'node:path';

const VERSION_RE = /^v\d+$/;

/** 列出已有项目目录名（prototypes/{folder}/） */
export function listProjectFolders(root) {
  const prototypesRoot = path.join(root, 'prototypes');
  const folders = new Set();
  if (!fs.existsSync(prototypesRoot)) return folders;
  for (const entry of fs.readdirSync(prototypesRoot)) {
    const full = path.join(prototypesRoot, entry);
    if (!fs.statSync(full).isDirectory()) continue;
    folders.add(entry);
  }
  return folders;
}

/** 收集已有 meta.id */
export function listProjectMetaIds(root) {
  const ids = new Set();
  const prototypesRoot = path.join(root, 'prototypes');
  if (!fs.existsSync(prototypesRoot)) return ids;
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (entry !== 'meta.json') continue;
      try {
        const meta = JSON.parse(fs.readFileSync(full, 'utf8'));
        if (meta?.id) ids.add(String(meta.id));
      } catch {
        /* ignore */
      }
    }
  };
  walk(prototypesRoot);
  return ids;
}

export function resolveProjectDir(root, projectKey) {
  const parts = projectKey.split('/');
  if (parts.length !== 2) return null;
  const [folder, version] = parts;
  if (!folder || !version || !VERSION_RE.test(version)) return null;
  if (folder.includes('..') || folder.includes('/') || folder.includes('\\')) return null;
  const dir = path.resolve(root, 'prototypes', folder, version);
  const prototypesRoot = path.resolve(root, 'prototypes');
  if (!dir.startsWith(`${prototypesRoot}${path.sep}`)) return null;
  return dir;
}

export function deleteProjectDirectory(root, projectKey) {
  const dir = resolveProjectDir(root, projectKey);
  if (!dir) {
    return { ok: false, error: '无效的项目 ID，格式应为 {目录名}/{version}（如 rule-config/v1）' };
  }
  if (!fs.existsSync(dir)) {
    return { ok: false, error: `项目目录不存在：prototypes/${projectKey}` };
  }
  fs.rmSync(dir, { recursive: true, force: true });
  return { ok: true };
}
