import { validateFlowManifest, validateMetaInfo } from '@prototype/renderer/validateSpec';
import { designSystemForPlatform } from './projectPlatform';
export function normalizeMetaInfo(parsed, meta) {
    return {
        id: typeof meta.id === 'string' && meta.id ? meta.id : parsed.project,
        version: typeof meta.version === 'string' && meta.version ? meta.version : parsed.version,
        title: typeof meta.title === 'string' && meta.title.trim()
            ? meta.title.trim()
            : parsed.project,
        project: typeof meta.project === 'string' && meta.project ? meta.project : parsed.project,
        type: meta.type === 'page' ? 'page' : 'flow',
        mode: meta.mode === 'hybrid' || meta.mode === 'escape' ? meta.mode : 'spec',
        designSystem: typeof meta.designSystem === 'string' && meta.designSystem
            ? meta.designSystem
            : designSystemForPlatform('pc'),
        author: typeof meta.author === 'string' && meta.author ? meta.author : '待填写',
        createdAt: typeof meta.createdAt === 'string' && meta.createdAt
            ? meta.createdAt
            : new Date().toISOString().slice(0, 10),
        changeSummary: typeof meta.changeSummary === 'string' ? meta.changeSummary : undefined,
        status: meta.status === 'draft' || meta.status === 'review' || meta.status === 'approved'
            ? meta.status
            : undefined,
        pattern: typeof meta.pattern === 'string' ? meta.pattern : undefined,
        extensions: Array.isArray(meta.extensions)
            ? meta.extensions.filter((x) => typeof x === 'string')
            : undefined,
    };
}
export function getManifestPageIds(manifest) {
    if (!manifest || !Array.isArray(manifest.pages))
        return [];
    return manifest.pages.filter((id) => typeof id === 'string');
}
export function isFilesystemProjectReady(manifest, meta, hasEntryPage) {
    if (!manifest || manifest.type !== 'flow')
        return false;
    if (validateFlowManifest(manifest).length > 0)
        return false;
    if (validateMetaInfo(meta).length > 0)
        return false;
    if (!hasEntryPage)
        return false;
    return getManifestPageIds(manifest).includes(manifest.entry);
}
