import { fileURLToPath, URL } from 'node:url';
const r = (p) => fileURLToPath(new URL(p, import.meta.url));
/** 全项目统一的 Vite / Vitest path alias */
export function prototypeAliases() {
    const runtime = r('../packages/runtime/src');
    const shell = r('../packages/shell/src');
    return {
        '@prototype/shell': shell,
        '@prototype/shell/*': `${shell}/*`,
        '@prototype/runtime': runtime,
        '@prototype/runtime/*': `${runtime}/*`,
        '@prototype/ui': `${runtime}/ui`,
        '@prototype/patterns': `${runtime}/patterns`,
        '@prototype/patterns/*': `${runtime}/patterns/*`,
        '@prototype/renderer': `${runtime}/renderer`,
        '@prototype/review': `${runtime}/review/index.js`,
        '@prototype/runtime/parseRequirementsDoc': `${runtime}/parseRequirementsDoc.js`,
        '@prototype/prompt': `${shell}/lib/prompt/index.js`,
    };
}
