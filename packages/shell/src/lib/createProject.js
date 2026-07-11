export async function createProjectOnDisk(input) {
    let res;
    try {
        res = await fetch('/api/projects/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        });
    }
    catch {
        return { ok: false, error: '无法连接创建服务，请确认正在使用 npm run dev 启动' };
    }
    const data = (await res.json());
    if (!res.ok || !data.ok) {
        return { ok: false, error: data.error ?? '创建项目目录失败' };
    }
    return data;
}
