export function normalizeFragmentPayload(payload) {
    if (Array.isArray(payload))
        return payload;
    if ('sections' in payload && Array.isArray(payload.sections))
        return payload.sections;
    return [payload];
}
function mergeSectionList(base, incoming) {
    const result = [...base];
    for (const section of incoming) {
        const idx = result.findIndex((s) => s.title === section.title && s.icon === section.icon);
        if (idx >= 0 && section.tabs?.length) {
            const existing = result[idx];
            result[idx] = {
                ...existing,
                tabs: [...(existing.tabs ?? []), ...section.tabs],
            };
        }
        else {
            result.push(section);
        }
    }
    return result;
}
export function mergeSectionsIntoPage(page, fragments) {
    if (!fragments.length)
        return page;
    return {
        ...page,
        sections: mergeSectionList(page.sections ?? [], fragments),
    };
}
export function applySectionFragmentsToPage(page, fragmentMap, includeKeys) {
    let next = page;
    const keys = includeKeys ?? [];
    for (const key of keys) {
        const payload = fragmentMap[key];
        if (payload) {
            next = mergeSectionsIntoPage(next, normalizeFragmentPayload(payload));
        }
    }
    return next;
}
export function assemblePageSpec(page, options = {}) {
    let next = applySectionFragmentsToPage(page, options.sharedFragments ?? {}, page.includeSections);
    for (const key of Object.keys(options.pageFragments ?? {}).sort()) {
        const payload = options.pageFragments[key];
        next = mergeSectionsIntoPage(next, normalizeFragmentPayload(payload));
    }
    if (options.feeRowSamples) {
        next = { ...next, feeRowSamples: options.feeRowSamples };
    }
    return next;
}
export function isSharedSectionFragmentFile(name) {
    return /^shared\.sections\.[^.]+\.json$/.test(name);
}
export function isPageSectionFragmentFile(pageId, name) {
    return name.startsWith(`${pageId}.sections.`) && name.endsWith('.json');
}
export function sharedSectionFragmentKey(name) {
    const m = name.match(/^shared\.sections\.(.+)\.json$/);
    return m?.[1] ?? null;
}
export function pageSectionFragmentKey(pageId, name) {
    const m = name.match(new RegExp(`^${pageId}\\.sections\\.(.+)\\.json$`));
    return m?.[1] ?? null;
}
