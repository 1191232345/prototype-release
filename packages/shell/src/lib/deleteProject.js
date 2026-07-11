import { cleanupProjectLocalState } from './projectStore';
export async function deleteProjectByKey(projectKey) {
    let res;
    try {
        res = await fetch('/api/projects/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectKey }),
        });
    }
    catch {
        return { ok: false, error: '无法连接删除服务，请确认正在使用 npm run dev 启动' };
    }
    let data;
    try {
        data = (await res.json());
    }
    catch {
        return { ok: false, error: '删除服务响应异常' };
    }
    if (!res.ok || !data.ok) {
        return { ok: false, error: data.error ?? '删除失败' };
    }
    cleanupProjectLocalState(projectKey);
    return { ok: true };
}
