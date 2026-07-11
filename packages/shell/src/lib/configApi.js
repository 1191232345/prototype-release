async function readError(res) {
    try {
        const data = (await res.json());
        return data.error || res.statusText || '请求失败';
    }
    catch {
        return res.statusText || '请求失败';
    }
}
export async function fetchConfig() {
    const res = await fetch('/api/config');
    if (!res.ok)
        throw new Error(await readError(res));
    const data = (await res.json());
    return data.config;
}
export async function saveConfig(payload) {
    const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok)
        throw new Error(await readError(res));
    const data = (await res.json());
    return data.config;
}
export async function fetchPublishStatus(projectKey, target) {
    const params = new URLSearchParams({ projectKey });
    if (target)
        params.set('target', target);
    const res = await fetch(`/api/publish/status?${params.toString()}`);
    if (!res.ok)
        throw new Error(await readError(res));
    const data = (await res.json());
    const { ok: _ok, ...status } = data;
    return status;
}
export async function publishProjectPreview(input) {
    const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    if (!res.ok)
        throw new Error(await readError(res));
    return (await res.json());
}
