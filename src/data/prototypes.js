import { validateFlowManifest, validateFlowSpec, validateMetaInfo } from '@prototype/renderer/validateSpec';
import { applyProjectOverrides, loadProjectStoreSnapshot, pendingToProjectItem, reconcileDraftsInStore, } from '../lib/projectStore';
import { isFilesystemProjectReady, normalizeMetaInfo, } from '../lib/normalizeProjectMeta';
import { assembleFlowSpec, parseProjectKey } from '../lib/assembleFlowSpec';
import { findFlowPath, flowModules, hasPageSpecFile, loadPagesForProject, loadProjectDocs, metaModules, } from './prototypeGlob';
let projectsCache = null;
const detailCache = new Map();
export function invalidateProjectsCache() {
    projectsCache = null;
    detailCache.clear();
}
function flowManifestFromModule(mod) {
    const manifest = mod.default;
    if (!manifest || manifest.type !== 'flow')
        return null;
    return manifest;
}
export function getFilesystemSlugs() {
    const slugs = new Set();
    Object.entries(flowModules).forEach(([path, mod]) => {
        if (!flowManifestFromModule(mod))
            return;
        const m = path.match(/prototypes\/([^/]+)\//);
        if (m)
            slugs.add(m[1]);
    });
    return slugs;
}
function buildIndexProject(path, manifest, meta, status = 'active') {
    const parsed = parseProjectKey(path);
    const manifestErrors = validateFlowManifest(manifest);
    return {
        key: parsed.key,
        project: parsed.project,
        version: parsed.version,
        status,
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
        specErrors: manifestErrors,
        metaErrors: validateMetaInfo(meta),
    };
}
function loadFilesystemIndex() {
    const items = [];
    Object.entries(flowModules).forEach(([path, mod]) => {
        const manifest = flowManifestFromModule(mod);
        if (!manifest)
            return;
        const parsed = parseProjectKey(path);
        if (!parsed)
            return;
        const metaPath = path.replace('flow.json', 'meta.json');
        const rawMeta = metaModules[metaPath]?.default;
        if (!rawMeta)
            return;
        const meta = normalizeMetaInfo(parsed, rawMeta);
        const ready = isFilesystemProjectReady(manifest, meta, hasPageSpecFile(parsed.key, manifest.entry));
        items.push(buildIndexProject(path, manifest, meta, ready ? 'active' : 'pending'));
    });
    return items;
}
function buildProjectsResult() {
    const fsProjects = loadFilesystemIndex();
    const readyKeys = new Set(fsProjects.filter((p) => p.status === 'active').map((p) => p.key));
    const { drafts, overrides, hidden } = loadProjectStoreSnapshot();
    const { archived: archivedDrafts, remaining: remainingDrafts } = reconcileDraftsInStore(drafts, readyKeys);
    const fsKeys = new Set(fsProjects.map((p) => p.key));
    const pendingDrafts = remainingDrafts
        .map(pendingToProjectItem)
        .filter((p) => !fsKeys.has(p.key));
    const draftingOnDisk = fsProjects.filter((p) => p.status === 'pending');
    const activeOnDisk = fsProjects.filter((p) => p.status === 'active');
    const merged = [...pendingDrafts, ...draftingOnDisk, ...activeOnDisk]
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
    const manifest = flowManifestFromModule(flowModules[flowPath]);
    if (!manifest)
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
        metaErrors: indexItem.metaErrors,
    };
    detailCache.set(key, item);
    return item;
}
export function countValidationErrors(items) {
    return items.reduce((n, i) => n + i.specErrors.length + i.metaErrors.length, 0);
}
