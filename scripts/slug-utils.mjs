/** 发布用 meta.id：小写英文、数字、连字符 */
export const PROJECT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidProjectId(id) {
  return PROJECT_ID_RE.test(id);
}

export function slugifyAscii(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 磁盘目录名：保留中文，去掉非法路径字符 */
export function sanitizeProjectFolder(name) {
  return (
    String(name || '')
      .trim()
      .replace(/[/\\:*?"<>|]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'new-project'
  );
}

function randomProjectId() {
  return `proj-${Math.random().toString(36).slice(2, 8)}`;
}

/** 生成唯一 meta.id（ASCII，用于发布链接） */
export function generateProjectId(name, isIdTaken) {
  const base = slugifyAscii(name);
  if (base && isValidProjectId(base) && !isIdTaken(base)) return base;
  if (base && isValidProjectId(base)) {
    let n = 2;
    while (isIdTaken(`${base}-${n}`)) n += 1;
    return `${base}-${n}`;
  }
  let id;
  do {
    id = randomProjectId();
  } while (isIdTaken(id));
  return id;
}

/** 生成唯一目录名（可与项目名称一致，冲突时加后缀） */
export function generateProjectFolder(name, isFolderTaken) {
  const base = sanitizeProjectFolder(name);
  if (!isFolderTaken(base)) return base;
  let n = 2;
  while (isFolderTaken(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function validateProjectName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) {
    return { ok: false, error: '请填写项目名称' };
  }
  if (/[/\\:*?"<>|]/.test(trimmed)) {
    return { ok: false, error: '项目名称不能包含 / \\ : * ? " < > | 等字符' };
  }
  return { ok: true, name: trimmed };
}
