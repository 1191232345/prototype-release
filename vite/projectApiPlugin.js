import fs from 'node:fs';
import path from 'node:path';
import { deleteProjectDirectory, resolveProjectDir } from '../scripts/delete-project-dir.mjs';
import { scaffoldProject } from '../scripts/scaffold-project.mjs';
import { getPublicConfig, updateConfig } from '../scripts/settings-store.mjs';
import { publishProject } from '../scripts/publish-project.mjs';
import { publishProjectToServer } from '../scripts/publish-to-server.mjs';
import { getPublishStatus } from '../scripts/publish-record.mjs';
import { previewUrl, publishedRoot, resolvePublishPath, } from '../scripts/publish-bundle.mjs';
function attachLocalPreviewUrl(root, port, projectKey, result) {
    const sourceDir = resolveProjectDir(root, projectKey);
    if (!sourceDir)
        return result;
    const metaPath = path.join(sourceDir, 'meta.json');
    if (!fs.existsSync(metaPath))
        return result;
    try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        const publishPath = resolvePublishPath(meta);
        const config = getPublicConfig(root);
        const host = `http://localhost:${port || 5173}/`;
        return {
            ...result,
            localPreviewUrl: previewUrl(host, config.serverRepoPath, publishPath),
        };
    }
    catch {
        return result;
    }
}
function servePublishedStatic(root) {
    return (req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD'))
            return next();
        const urlPath = decodeURIComponent(req.url.split('?')[0]);
        if (!urlPath.startsWith('/prototype/') &&
            !urlPath.startsWith('/prototypes/') &&
            !urlPath.startsWith('/docs/')) {
            return next();
        }
        const publishedDir = publishedRoot(root);
        let filePath = path.join(publishedDir, urlPath.replace(/^\//, ''));
        if (urlPath.endsWith('/')) {
            filePath = path.join(filePath, 'index.html');
        }
        else if (!path.extname(urlPath)) {
            const asIndex = path.join(filePath, 'index.html');
            if (fs.existsSync(asIndex))
                filePath = asIndex;
        }
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile())
            return next();
        const ext = path.extname(filePath).toLowerCase();
        const types = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'text/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.md': 'text/markdown; charset=utf-8',
            '.svg': 'image/svg+xml',
            '.png': 'image/png',
            '.woff2': 'font/woff2',
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
        if (req.method === 'HEAD') {
            res.end();
            return;
        }
        fs.createReadStream(filePath).pipe(res);
    };
}
function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        req.on('end', () => {
            try {
                const raw = Buffer.concat(chunks).toString('utf8');
                resolve(raw ? JSON.parse(raw) : {});
            }
            catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}
function sendJson(res, status, body) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
}
function attachProjectApi(server) {
    server.middlewares.use(servePublishedStatic(server.config.root));
    server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/config' && req.method === 'GET') {
            try {
                sendJson(res, 200, { ok: true, config: getPublicConfig(server.config.root) });
            }
            catch (err) {
                sendJson(res, 500, { ok: false, error: err instanceof Error ? err.message : '读取配置失败' });
            }
            return;
        }
        if (url === '/api/config' && req.method === 'POST') {
            try {
                const body = (await readJsonBody(req));
                const config = updateConfig(server.config.root, body);
                sendJson(res, 200, { ok: true, config });
            }
            catch (err) {
                sendJson(res, 500, { ok: false, error: err instanceof Error ? err.message : '保存配置失败' });
            }
            return;
        }
        if (url === '/api/publish/status' && req.method === 'GET') {
            try {
                const params = new URL(req.url ?? '', 'http://local').searchParams;
                const projectKey = params.get('projectKey')?.trim() ?? '';
                if (!projectKey) {
                    sendJson(res, 400, { ok: false, error: '缺少 projectKey' });
                    return;
                }
                const config = getPublicConfig(server.config.root);
                const target = params.get('target')?.trim() === 'github' ? 'github' : config.publishTarget;
                const status = getPublishStatus(server.config.root, projectKey, target);
                sendJson(res, 200, { ok: true, ...status });
            }
            catch (err) {
                sendJson(res, 400, { ok: false, error: err instanceof Error ? err.message : '读取发布状态失败' });
            }
            return;
        }
        if (url === '/api/publish' && req.method === 'POST') {
            try {
                const body = (await readJsonBody(req));
                const projectKey = typeof body.projectKey === 'string' ? body.projectKey.trim() : '';
                if (!projectKey) {
                    sendJson(res, 400, { ok: false, error: '缺少 projectKey' });
                    return;
                }
                const config = getPublicConfig(server.config.root);
                const target = typeof body.target === 'string' && body.target.trim()
                    ? body.target.trim()
                    : config.publishTarget;
                const options = {
                    title: typeof body.title === 'string' ? body.title : '',
                    force: body.force === true,
                };
                const result = target === 'github'
                    ? publishProject(server.config.root, projectKey, options)
                    : await publishProjectToServer(server.config.root, projectKey, options);
                const payload = attachLocalPreviewUrl(server.config.root, server.config.server.port, projectKey, result);
                sendJson(res, 200, { ok: true, ...payload });
            }
            catch (err) {
                sendJson(res, 400, { ok: false, error: err instanceof Error ? err.message : '发布失败' });
            }
            return;
        }
        if (url === '/api/projects/create' && req.method === 'POST') {
            try {
                const body = (await readJsonBody(req));
                const result = scaffoldProject(server.config.root, {
                    name: typeof body.name === 'string' ? body.name : '',
                    slug: typeof body.slug === 'string' ? body.slug : '',
                    platform: body.platform === 'mobile' ? 'mobile' : 'pc',
                    version: typeof body.version === 'string' ? body.version : 'v1',
                });
                sendJson(res, result.ok ? 200 : 400, result);
            }
            catch (err) {
                sendJson(res, 500, {
                    ok: false,
                    error: err instanceof Error ? err.message : '创建项目失败',
                });
            }
            return;
        }
        if (url === '/api/projects/delete' && req.method === 'POST') {
            try {
                const body = (await readJsonBody(req));
                const projectKey = typeof body.projectKey === 'string' ? body.projectKey.trim() : '';
                if (!projectKey) {
                    sendJson(res, 400, { ok: false, error: '缺少 projectKey' });
                    return;
                }
                const result = deleteProjectDirectory(server.config.root, projectKey);
                sendJson(res, result.ok ? 200 : 400, result);
            }
            catch {
                sendJson(res, 500, { ok: false, error: '删除请求处理失败' });
            }
            return;
        }
        next();
    });
}
export function projectApiPlugin() {
    return {
        name: 'prototype-archive-project-api',
        configureServer(server) {
            attachProjectApi(server);
        },
        configurePreviewServer(server) {
            attachProjectApi(server);
        },
    };
}
