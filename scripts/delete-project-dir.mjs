import fs from 'node:fs';
import path from 'node:path';

const SLUG_RE = /^[a-z0-9\u4e00-\u9fa5-]+$/;
const VERSION_RE = /^v\d+$/;

export function resolveProjectDir(root, projectKey) {
  const parts = projectKey.split('/');
  if (parts.length !== 2) return null;
  const [slug, version] = parts;
  if (!SLUG_RE.test(slug) || !VERSION_RE.test(version)) return null;
  const dir = path.resolve(root, 'prototypes', slug, version);
  const prototypesRoot = path.resolve(root, 'prototypes');
  if (!dir.startsWith(`${prototypesRoot}${path.sep}`)) return null;
  return dir;
}

export function deleteProjectDirectory(root, projectKey) {
  const dir = resolveProjectDir(root, projectKey);
  if (!dir) {
    return { ok: false, error: '无效的项目 ID，格式应为 {slug}/{version}（如 rule-config/v1）' };
  }
  if (!fs.existsSync(dir)) {
    return { ok: false, error: `项目目录不存在：prototypes/${projectKey}` };
  }
  fs.rmSync(dir, { recursive: true, force: true });
  return { ok: true };
}
