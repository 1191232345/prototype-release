import { validateFlowSpec, validateMetaInfo } from '@prototype/renderer/validateSpec';
import { applyProjectOverrides, loadProjectStoreSnapshot, pendingToProjectItem, reconcileDraftsInStore, } from '../lib/projectStore';
import { assembleFlowSpec, parseProjectKey } from '../lib/assembleFlowSpec';
import { findFlowPath, flowModules, loadPagesForProject, loadProjectDocs, metaModules, } from './prototypeGlob';
let projectsCache = null;
const detailCache = new Map();
export function invalidateProjectsCache() {
    projectsCache = null;
    detailCache.clear();
}
export function getFilesystemSlugs() {
    const slugs = new Set();
    Object.entries(flowModules).forEach(([path, mod]) => {
        const manifest = mod.default;
        if (!manifest || manifest.type !== 'flow')
            return;
        const m = path.match(/prototypes\/([^/]+)\//);
        if (m)
            slugs.add(m[1]);
    });
    return slugs;
}
function buildIndexProject(path, manifest, meta) {
    const parsed = parseProjectKey(path);
    return {
        key: parsed.key,
        project: parsed.project,
        version: parsed.version,
        status: 'active',
        description: meta.changeSummary,
        flow: {
            type: 'flow',
            title: meta.title,
            entry: manifest.entry,
            pages: {},
        },
        meta,
        changelogText: '',
        requirementsText: '',
        prdText: '',
        specErrors: [],
        metaErrors: validateMetaInfo(meta),
    };
}
function loadFilesystemIndex() {
    const items = [];
    Object.entries(flowModules).forEach(([path, mod]) => {
        const manifest = mod.default;
        if (!manifest || manifest.type !== 'flow')
            return;
        const metaPath = path.replace('flow.json', 'meta.json');
        const meta = metaModules[metaPath]?.default;
        if (!meta)
            return;
        items.push(buildIndexProject(path, manifest, meta));
    });
    return items;
}
function buildProjectsResult() {
    const fsProjects = loadFilesystemIndex();
    const fsKeys = new Set(fsProjects.map((p) => p.key));
    const { drafts, overrides, hidden } = loadProjectStoreSnapshot();
    const { archived: archivedDrafts, remaining: remainingDrafts } = reconcileDraftsInStore(drafts, fsKeys);
    const pending = remainingDrafts
        .map(pendingToProjectItem)
        .filter((p) => !fsKeys.has(p.key));
    const merged = [...pending, ...fsProjects]
        .map((item) => applyProjectOverrides(item, overrides))
        .filter((p) => !hidden.has(p.key));
    const projects = merged.sort((a, b) => a.project.localeCompare(b.project) || b.version.localeCompare(a.version));
    const newlyArchived = archivedDrafts.map((d) => ({
        key: d.id,
        title: d.name,
    }));
    return { projects, newlyArchived };
}
export function loadProjectsWithReconcile() {
    if (!projectsCache) {
        projectsCache = buildProjectsResult();
    }
    return projectsCache;
}
export async function loadProjectDetail(key) {
    const cached = detailCache.get(key);
    if (cached)
        return cached;
    const indexItem = loadProjectsWithReconcile().projects.find((p) => p.key === key);
    if (!indexItem)
        return null;
    if (indexItem.status === 'pending')
        return indexItem;
    const flowPath = findFlowPath(key);
    if (!flowPath)
        return indexItem;
    const manifest = flowModules[flowPath].default;
    if (!manifest || manifest.type !== 'flow')
        return indexItem;
    const [pageMap, docs] = await Promise.all([
        loadPagesForProject(key),
        loadProjectDocs(flowPath),
    ]);
    const flow = assembleFlowSpec(manifest, pageMap, docs.changelog);
    const item = {
        ...indexItem,
        flow,
        changelogText: docs.changelogText,
        requirementsText: docs.requirementsText,
        prdText: docs.prdText,
        specErrors: validateFlowSpec(flow),
    };
    detailCache.set(key, item);
    return item;
}
export function countValidationErrors(items) {
    return items.reduce((n, i) => n + i.specErrors.length + i.metaErrors.length, 0);
}
