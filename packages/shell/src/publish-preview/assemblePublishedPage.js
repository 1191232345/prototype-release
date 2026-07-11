import { assemblePageFromParts } from '../lib/assemblePageParts';
async function fetchJsonOptional(url) {
    try {
        const res = await fetch(url);
        if (!res.ok)
            return null;
        return (await res.json());
    }
    catch {
        return null;
    }
}
export async function assemblePublishedPageSpec(base, pageId, page) {
    const sharedFragments = {};
    const includeKeys = page.includeSections ?? [];
    await Promise.all(includeKeys.map(async (key) => {
        const payload = await fetchJsonOptional(`${base}pages/shared.sections.${key}.json`);
        if (payload)
            sharedFragments[key] = payload;
    }));
    const feeRowSamples = await fetchJsonOptional(`${base}pages/${pageId}.fee-rows.json`);
    return assemblePageFromParts({
        page,
        sharedFragments,
        feeRowSamples: feeRowSamples ?? undefined,
    });
}
