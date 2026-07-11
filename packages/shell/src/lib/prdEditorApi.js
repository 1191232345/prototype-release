export async function saveProjectPrd(input) {
    const res = await fetch('/api/projects/prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.ok) {
        throw new Error(data?.error || '保存 PRD 失败');
    }
    return { updatedAt: String(data.updatedAt || '') };
}
