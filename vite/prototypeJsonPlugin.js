import fs from 'node:fs';
const NULL_EXPORT = 'export default null';
/** AI 增量写入 prototypes 时，空文件或半截 JSON 不应导致 vite:json 崩溃 */
export function prototypeJsonPlugin() {
    return {
        name: 'prototype-json-safe',
        enforce: 'pre',
        load(id) {
            const filePath = id.split('?')[0];
            if (!filePath.includes('/prototypes/') || !filePath.endsWith('.json'))
                return null;
            if (!fs.existsSync(filePath))
                return null;
            const content = fs.readFileSync(filePath, 'utf8').trim();
            if (!content)
                return NULL_EXPORT;
            try {
                JSON.parse(content);
            }
            catch {
                return NULL_EXPORT;
            }
            return null;
        },
    };
}
