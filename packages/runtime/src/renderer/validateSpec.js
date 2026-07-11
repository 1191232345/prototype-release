import Ajv from 'ajv';
import pageSchema from './schema/spec.schema.json';
import flowSchema from './schema/flow.schema.json';
import flowManifestSchema from './schema/flow-manifest.schema.json';
import changelogSchema from './schema/changelog.schema.json';
import metaSchema from './schema/meta.schema.json';
const ajv = new Ajv({ allErrors: true, strict: false });
const validatePageFn = ajv.compile(pageSchema);
const validateFlowFn = ajv.compile(flowSchema);
const validateFlowManifestFn = ajv.compile(flowManifestSchema);
const validateChangelogFn = ajv.compile(changelogSchema);
const validateMetaFn = ajv.compile(metaSchema);
function toIssues(errors) {
    if (!errors)
        return [];
    return errors.map((e) => ({
        path: e.instancePath || '/',
        message: e.message ?? '校验失败',
    }));
}
export function validatePageSpec(spec) {
    const ok = validatePageFn(spec);
    return ok ? [] : toIssues(validatePageFn.errors);
}
export function validateFlowManifest(manifest) {
    const ok = validateFlowManifestFn(manifest);
    return ok ? [] : toIssues(validateFlowManifestFn.errors);
}
export function validateChangelog(changelog) {
    const ok = validateChangelogFn(changelog);
    return ok ? [] : toIssues(validateChangelogFn.errors);
}
export function validateFlowSpec(flow) {
    const ok = validateFlowFn(flow);
    const issues = ok ? [] : toIssues(validateFlowFn.errors);
    if (flow && typeof flow === 'object') {
        const f = flow;
        if (!f.pages[f.entry]) {
            issues.push({ path: '/entry', message: `entry "${f.entry}" 在 pages 中不存在` });
        }
        Object.entries(f.pages ?? {}).forEach(([pageId, page]) => {
            validatePageSpec(page).forEach((err) => {
                issues.push({ path: `/pages/${pageId}${err.path}`, message: err.message });
            });
        });
    }
    return issues;
}
export function validateMetaInfo(meta) {
    const ok = validateMetaFn(meta);
    return ok ? [] : toIssues(validateMetaFn.errors);
}
