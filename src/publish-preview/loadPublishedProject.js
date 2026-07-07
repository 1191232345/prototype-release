import { assembleFlowSpec } from '../lib/assembleFlowSpec';
async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`无法加载 ${url} (${res.status})`);
    return res.json();
}
async function fetchText(url) {
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`无法加载 ${url} (${res.status})`);
    return res.text();
}
async function fetchTextOptional(url) {
    try {
        return await fetchText(url);
    }
    catch {
        return '';
    }
}
function projectBaseUrl() {
    return new URL('.', window.location.href).href;
}
export async function loadPublishedProject() {
    const base = projectBaseUrl();
    const [manifest, meta] = await Promise.all([
        fetchJson(`${base}flow.json`),
        fetchJson(`${base}meta.json`),
    ]);
    const [prdText, requirementsText, changelogText] = await Promise.all([
        fetchTextOptional(`${base}PRD.md`),
        fetchTextOptional(`${base}REQUIREMENTS.md`),
        fetchTextOptional(`${base}CHANGELOG.md`),
    ]);
    const pageMap = {};
    for (const pageId of manifest.pages) {
        const page = await fetchJson(`${base}pages/${pageId}.json`);
        pageMap[pageId] = page;
        try {
            const mainDetails = await fetchJson(`${base}pages/${pageId}.details.json`);
            pageMap[pageId] = { ...pageMap[pageId], details: { ...(pageMap[pageId].details ?? {}), ...mainDetails } };
        }
        catch {
        }
        try {
            const moreDetails = await fetchJson(`${base}pages/${pageId}.details.more.json`);
            pageMap[pageId] = {
                ...pageMap[pageId],
                details: { ...(pageMap[pageId].details ?? {}), ...moreDetails },
            };
        }
        catch {
        }
        try {
            const timelines = await fetchJson(`${base}pages/${pageId}.timelines.json`);
            const details = pageMap[pageId].details;
            if (details) {
                for (const [rowId, entries] of Object.entries(timelines)) {
                    if (details[rowId])
                        details[rowId].timeline = entries;
                }
            }
        }
        catch {
        }
    }
    let changelog;
    try {
        changelog = await fetchJson(`${base}changelog.json`);
    }
    catch {
        changelog = undefined;
    }
    const flow = assembleFlowSpec(manifest, pageMap, changelog);
    const key = `${meta.project}/${meta.version}`;
    return {
        key,
        project: meta.project,
        version: meta.version,
        status: 'active',
        description: meta.changeSummary,
        flow,
        meta,
        changelogText,
        requirementsText,
        prdText,
        specErrors: [],
        metaErrors: [],
    };
}
