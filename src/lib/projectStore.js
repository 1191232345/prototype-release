import { slugify } from './utils';
import { generateProjectPrompt } from './generateProjectPrompt';
import { getFilesystemSlugs } from '../data/prototypes';
import { designSystemForPlatform } from './projectPlatform';
const PENDING_KEY = 'prototype-archive-pending';
const OVERRIDES_KEY = 'prototype-archive-overrides';
const HIDDEN_KEY = 'prototype-archive-hidden';
export function slugExists(slug, version = 'v1') {
    const key = `${slug}/${version}`;
    if (loadDrafts().some((d) => d.slug === slug || d.id === key))
        return true;
    return getFilesystemSlugs().has(slug);
}
export function isLocalPendingDraft(item) {
    return item.status === 'pending' && Boolean(item.prompt);
}
export function canPublishProject(item) {
    return item.status !== 'pending' || !item.prompt;
}
export function getProjectStatus(item) {
    return item.meta.status ?? 'draft';
}
function loadDrafts() {
    try {
        const raw = localStorage.getItem(PENDING_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function saveDrafts(drafts) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(drafts));
}
function loadOverrides() {
    try {
        const raw = localStorage.getItem(OVERRIDES_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch {
        return {};
    }
}
function saveOverrides(map) {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
}
function loadHidden() {
    try {
        const raw = localStorage.getItem(HIDDEN_KEY);
        return new Set(raw ? JSON.parse(raw) : []);
    }
    catch {
        return new Set();
    }
}
function saveHidden(set) {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([...set]));
}
export function createPendingProject(name, platform = 'pc') {
    const slug = slugify(name);
    const version = 'v1';
    const prompt = generateProjectPrompt({ name, slug, version }, platform);
    const draft = {
        id: `${slug}/${version}`,
        name: name.trim(),
        description: '待 IDE 补充需求',
        slug,
        version,
        platform,
        prompt,
        createdAt: new Date().toISOString().slice(0, 10),
    };
    const drafts = loadDrafts().filter((d) => d.id !== draft.id);
    drafts.unshift(draft);
    saveDrafts(drafts);
    return draft;
}
export function updatePendingProject(id, name, description) {
    const drafts = loadDrafts();
    const idx = drafts.findIndex((d) => d.id === id);
    if (idx < 0)
        return null;
    const version = drafts[idx].version;
    const slug = drafts[idx].slug;
    const platform = drafts[idx].platform ?? 'pc';
    const prompt = generateProjectPrompt({ name, slug, version }, platform);
    drafts[idx] = {
        ...drafts[idx],
        name: name.trim(),
        description: description.trim(),
        prompt,
    };
    saveDrafts(drafts);
    return drafts[idx];
}
export function removePendingProject(id) {
    saveDrafts(loadDrafts().filter((d) => d.id !== id));
}
export function saveMetaOverride(key, title, description, status) {
    const map = loadOverrides();
    const prev = map[key];
    map[key] = {
        key,
        title,
        description,
        status: status ?? prev?.status,
        updatedAt: new Date().toISOString().slice(0, 10),
    };
    saveOverrides(map);
}
export function removeMetaOverride(key) {
    const map = loadOverrides();
    delete map[key];
    saveOverrides(map);
}
function unhideProject(key) {
    const set = loadHidden();
    set.delete(key);
    saveHidden(set);
}
export function cleanupProjectLocalState(key) {
    removeMetaOverride(key);
    unhideProject(key);
}
export function loadProjectStoreSnapshot() {
    return {
        drafts: loadDrafts(),
        overrides: loadOverrides(),
        hidden: loadHidden(),
    };
}
function reconcileDrafts(drafts, fsKeys) {
    const archived = [];
    const remaining = drafts.filter((d) => {
        if (fsKeys.has(d.id)) {
            archived.push(d);
            return false;
        }
        return true;
    });
    return { archived, remaining };
}
export function reconcileDraftsInStore(drafts, fsKeys) {
    const result = reconcileDrafts(drafts, fsKeys);
    if (result.archived.length > 0) {
        saveDrafts(result.remaining);
    }
    return result;
}
export function saveProjectInfo(project, name, description, status) {
    if (project.status === 'pending') {
        updatePendingProject(project.key, name, description);
    }
    else {
        saveMetaOverride(project.key, name, description, status ?? getProjectStatus(project));
    }
}
export function pendingToProjectItem(draft) {
    const platform = draft.platform ?? 'pc';
    return {
        key: draft.id,
        project: draft.slug,
        version: draft.version,
        status: 'pending',
        prompt: draft.prompt,
        description: draft.description,
        flow: { type: 'flow', title: draft.name, entry: 'list', pages: {} },
        meta: {
            id: draft.slug,
            version: draft.version,
            title: draft.name,
            project: draft.slug,
            type: 'flow',
            mode: 'spec',
            designSystem: designSystemForPlatform(platform),
            author: '待创建',
            createdAt: draft.createdAt,
            changeSummary: draft.description,
        },
        changelogText: `# 待 AI 创建\n\n${draft.description}`,
        specErrors: [],
        metaErrors: [],
    };
}
export function loadPendingProjects() {
    return loadDrafts().map(pendingToProjectItem);
}
export function applyProjectOverrides(item, overrides) {
    const ov = overrides[item.key];
    if (!ov)
        return item;
    return {
        ...item,
        description: ov.description,
        meta: {
            ...item.meta,
            title: ov.title,
            changeSummary: ov.description,
            status: ov.status ?? item.meta.status,
        },
        flow: { ...item.flow, title: ov.title },
    };
}
export function matchProjectSearch(item, query) {
    const q = query.trim().toLowerCase();
    if (!q)
        return true;
    const haystack = [
        item.meta.title,
        item.meta.changeSummary,
        item.description,
        item.key,
        item.project,
        item.version,
        item.meta.author,
        item.meta.status,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return haystack.includes(q);
}
