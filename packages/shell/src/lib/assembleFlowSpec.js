export function parseProjectKey(path) {
    const m = path.match(/prototypes\/([^/]+)\/([^/]+)\//);
    if (!m)
        return null;
    return { project: m[1], version: m[2], key: `${m[1]}/${m[2]}` };
}
export function parsePageId(path) {
    if (/\.details(\.|$)/.test(path) ||
        /\.sections\./.test(path) ||
        /\/shared\.sections\./.test(path) ||
        /\.fee-rows\.json$/.test(path) ||
        path.endsWith('.timelines.json')) {
        return null;
    }
    return path.match(/pages\/([^/]+)\.json$/)?.[1] ?? null;
}
export function parsePageDetailId(path) {
    const m = path.match(/pages\/([^.]+)\.details(?:\.[^/]+)?\.json$/);
    return m?.[1] ?? null;
}
export function parsePageTimelineId(path) {
    return path.match(/pages\/([^.]+)\.timelines\.json$/)?.[1] ?? null;
}
function manifestPageIds(manifest) {
    if (!Array.isArray(manifest.pages))
        return [];
    return manifest.pages.filter((id) => typeof id === 'string');
}
export function assembleFlowSpec(manifest, pageMap, changelog) {
    const pages = {};
    for (const pageId of manifestPageIds(manifest)) {
        const page = pageMap[pageId];
        if (page)
            pages[pageId] = page;
    }
    return {
        type: 'flow',
        title: manifest.title,
        entry: manifest.entry,
        header: manifest.header,
        pages,
        changelog,
    };
}
