export function findPrdPlaceholders(text) {
    const found = new Set();
    for (const line of text.split('\n')) {
        if (line.trimStart().startsWith('```'))
            continue;
        const matches = line.matchAll(/\{([^}]+)\}/g);
        for (const m of matches) {
            const full = m[0];
            const inner = m[1].trim();
            if (inner.startsWith('#'))
                continue;
            if (/[\u4e00-\u9fff]/.test(inner)) {
                found.add(full);
                continue;
            }
            if (inner.includes('.')) {
                found.add(full);
                continue;
            }
            if (/^(占位符|xxx|TODO|TBD)$/i.test(inner)) {
                found.add(full);
            }
        }
    }
    return [...found];
}
export function findChapter3HeadersWithoutAnchor(text) {
    const missing = [];
    for (const line of text.split('\n')) {
        const m = line.match(/^##\s+(3\.\S.+)$/);
        if (!m)
            continue;
        if (!/\{#([a-z0-9.-]+)\}\s*$/.test(m[1])) {
            missing.push(m[1].trim());
        }
    }
    return missing;
}
export const CONDITIONAL_LIST_ANCHORS = {
    detailModal: 'list.detail-modal',
    importModal: 'list.import-modal',
    stateFlow: 'list.state-flow',
};
export const CONDITIONAL_FORM_ANCHORS = {
    validation: 'form.validation',
    zoneTable: 'form.zone-table',
    zoneButtons: 'form.zone-buttons',
    zoneImportModal: 'form.zone-import-modal',
};
const TECH_TABLE_HEADER_RE = /字段\s*(?:ID|id|key)\b|列\s*key\b/i;
const TECH_DATA_SOURCE_RE = /\b(?:cells\.|rows\.|mock\b|list\.json|pages\/|\.json\b|customer_id|warehouse_id|status\s*=\s*(?:draft|published|voided))/i;
const TECH_ACTION_RE = /\bnavigate\s*\(|action\s*key\b/i;
export function findPrdProductLanguageViolations(text) {
    const issues = new Set();
    let inChapter3 = false;
    for (const line of text.split('\n')) {
        const chapter = line.match(/^##\s+(\d+)\./);
        if (chapter) {
            inChapter3 = chapter[1] === '3';
            continue;
        }
        if (!inChapter3)
            continue;
        if (line.trimStart().startsWith('```'))
            continue;
        if (/^\|/.test(line) && TECH_TABLE_HEADER_RE.test(line)) {
            issues.add('第 3 章表格含「字段 ID / 字段 key」列，应只保留中文业务名称列');
        }
        if (TECH_DATA_SOURCE_RE.test(line)) {
            issues.add('第 3 章「数据来源」或说明中混入了表名/mock/JSON 路径，应改为菜单路径（如 客户管理 > 客户列表）');
        }
        if (TECH_ACTION_RE.test(line)) {
            issues.add('第 3 章含 navigate() 或 action key，触发动作应写业务描述（如「进入编辑表单页」）');
        }
    }
    return [...issues];
}
