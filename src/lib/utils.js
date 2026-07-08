export function sanitizeProjectFolder(name) {
    return (name
        .trim()
        .replace(/[/\\:*?"<>|]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'new-project');
}
export function slugify(name) {
    return sanitizeProjectFolder(name);
}
export function validateProjectName(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return { ok: false, error: '请填写项目名称' };
    }
    if (/[/\\:*?"<>|]/.test(trimmed)) {
        return { ok: false, error: '项目名称不能包含 / \\ : * ? " < > | 等字符' };
    }
    return { ok: true, name: trimmed };
}
export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    }
    catch {
        return false;
    }
}
export function countLines(text) {
    return text.split('\n').length;
}
