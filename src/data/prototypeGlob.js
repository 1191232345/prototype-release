import { assemblePageFromParts, applyPageTimelines, mergePageDetails, } from '../lib/assemblePageParts';
import { sharedSectionFragmentKey, pageSectionFragmentKey, } from '../lib/mergePageSections';
import { parsePageDetailId, parsePageId, parsePageTimelineId, parseProjectKey, } from '../lib/assembleFlowSpec';
export const flowModules = import.meta.glob('../../prototypes/**/flow.json', { eager: true });
export const metaModules = import.meta.glob('../../prototypes/**/meta.json', { eager: true });
const pageSectionModules = import.meta.glob('../../prototypes/**/pages/*.sections.*.json', { eager: true });
const sharedSectionModules = import.meta.glob('../../prototypes/**/pages/shared.sections.*.json', { eager: true });
const feeRowsModules = import.meta.glob('../../prototypes/**/pages/*.fee-rows.json', { eager: true });
const pageModules = import.meta.glob('../../prototypes/**/pages/*.json');
const pageDetailModules = import.meta.glob('../../prototypes/**/pages/*.details*.json');
const pageTimelineModules = import.meta.glob('../../prototypes/**/pages/*.timelines.json');
const changelogModules = import.meta.glob('../../prototypes/**/changelog.json');
const changelogModulesMd = import.meta.glob('../../prototypes/**/CHANGELOG.md', {
    query: '?raw',
    import: 'default',
});
const requirementsModules = import.meta.glob('../../prototypes/**/REQUIREMENTS.md', {
    query: '?raw',
    import: 'default',
});
const prdModules = import.meta.glob('../../prototypes/**/PRD.md', {
    query: '?raw',
    import: 'default',
});
export function belongsToProject(path, projectKey) {
    return path.includes(`/prototypes/${projectKey}/`);
}
async function loadRawDoc(loaders, path) {
    const loader = loaders[path];
    if (!loader)
        return '';
    return loader();
}
export async function loadPagesForProject(projectKey) {
    const map = {};
    await Promise.all(Object.entries(pageModules).map(async ([path, loader]) => {
        if (!belongsToProject(path, projectKey))
            return;
        const pageId = parsePageId(path);
        if (!pageId)
            return;
        const mod = await loader();
        if (!mod.default)
            return;
        map[pageId] = mod.default;
    }));
    const sharedFragments = {};
    for (const [path, mod] of Object.entries(sharedSectionModules)) {
        if (!belongsToProject(path, projectKey))
            continue;
        const fileName = path.split('/').pop() ?? '';
        const key = sharedSectionFragmentKey(fileName);
        if (key && mod.default)
            sharedFragments[key] = mod.default;
    }
    for (const pageId of Object.keys(map)) {
        const pageFragments = {};
        for (const [path, mod] of Object.entries(pageSectionModules)) {
            if (!belongsToProject(path, projectKey))
                continue;
            const fileName = path.split('/').pop() ?? '';
            const key = pageSectionFragmentKey(pageId, fileName);
            if (key && mod.default)
                pageFragments[key] = mod.default;
        }
        let feeRowSamples;
        for (const [path, mod] of Object.entries(feeRowsModules)) {
            if (!belongsToProject(path, projectKey))
                continue;
            if (path.endsWith(`/pages/${pageId}.fee-rows.json`) && mod.default) {
                feeRowSamples = mod.default;
            }
        }
        map[pageId] = assemblePageFromParts({
            page: map[pageId],
            sharedFragments,
            pageFragments,
            feeRowSamples,
        });
    }
    await Promise.all(Object.entries(pageDetailModules).map(async ([path, loader]) => {
        if (!belongsToProject(path, projectKey))
            return;
        const pageId = parsePageDetailId(path);
        if (!pageId || !map[pageId])
            return;
        const mod = await loader();
        if (!mod.default)
            return;
        map[pageId] = mergePageDetails(map[pageId], mod.default);
    }));
    await Promise.all(Object.entries(pageTimelineModules).map(async ([path, loader]) => {
        if (!belongsToProject(path, projectKey))
            return;
        const pageId = parsePageTimelineId(path);
        if (!pageId || !map[pageId]?.details)
            return;
        const mod = await loader();
        if (!mod.default)
            return;
        map[pageId] = applyPageTimelines(map[pageId], mod.default);
    }));
    return map;
}
export async function loadProjectDocs(flowPath) {
    const changelogPath = flowPath.replace('flow.json', 'changelog.json');
    const clPath = flowPath.replace('flow.json', 'CHANGELOG.md');
    const reqPath = flowPath.replace('flow.json', 'REQUIREMENTS.md');
    const prdPath = flowPath.replace('flow.json', 'PRD.md');
    const changelogLoader = changelogModules[changelogPath];
    const [changelogMod, changelogText, requirementsText, prdText] = await Promise.all([
        changelogLoader ? changelogLoader() : Promise.resolve(null),
        loadRawDoc(changelogModulesMd, clPath),
        loadRawDoc(requirementsModules, reqPath),
        loadRawDoc(prdModules, prdPath),
    ]);
    return {
        changelog: changelogMod?.default,
        changelogText,
        requirementsText,
        prdText,
    };
}
export function findFlowPath(projectKey) {
    for (const path of Object.keys(flowModules)) {
        if (parseProjectKey(path)?.key === projectKey)
            return path;
    }
    return null;
}
