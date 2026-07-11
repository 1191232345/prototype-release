import { assemblePageSpec } from './mergePageSections';
export function mergePageDetails(page, ...fragments) {
    let details = { ...(page.details ?? {}) };
    for (const fragment of fragments) {
        if (fragment)
            details = { ...details, ...fragment };
    }
    if (Object.keys(details).length === 0 && !page.details)
        return page;
    return { ...page, details };
}
export function applyPageTimelines(page, timelines) {
    if (!timelines || !page.details)
        return page;
    const details = { ...page.details };
    for (const [rowId, entries] of Object.entries(timelines)) {
        if (details[rowId]) {
            details[rowId] = { ...details[rowId], timeline: entries };
        }
    }
    return { ...page, details };
}
export function assemblePageFromParts(input) {
    let page = assemblePageSpec(input.page, {
        sharedFragments: input.sharedFragments,
        pageFragments: input.pageFragments,
        feeRowSamples: input.feeRowSamples,
    });
    if (input.detailFragments?.length) {
        page = mergePageDetails(page, ...input.detailFragments);
    }
    page = applyPageTimelines(page, input.timelines);
    return page;
}
