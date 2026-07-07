import { normalizeRowAction } from './rowActionUtils';
import { flattenTableRows } from './tableRowUtils';
const STATE_ACTION_REQUIREMENTS = {
    publish: 'draft',
    void: 'published',
    copy: 'voided',
};
const MIN_ROWS = 2;
const MAX_ROWS = 20;
function cellText(cell) {
    if (cell == null)
        return '';
    if (typeof cell === 'string')
        return cell.trim();
    return String(cell.primary ?? '').trim();
}
function rowsUseStatus(rows) {
    return flattenTableRows(rows).some((row) => row.status != null);
}
function collectActions(rows) {
    const actions = new Set();
    for (const row of flattenTableRows(rows)) {
        for (const action of row.actions ?? []) {
            actions.add(normalizeRowAction(action));
        }
    }
    return actions;
}
function collectStatuses(rows) {
    const statuses = new Set();
    for (const row of flattenTableRows(rows)) {
        if (row.status)
            statuses.add(row.status);
    }
    return statuses;
}
function analyzeFilterCoverage(filters, rows) {
    const issues = [];
    const leafRows = flattenTableRows(rows);
    for (const filter of filters ?? []) {
        if (filter.type !== 'select' || !filter.options?.length)
            continue;
        const options = filter.options.filter((opt) => opt.value !== 'all' && opt.label !== '全部' && opt.label.trim() !== '');
        if (options.length === 0 || options.length > 8)
            continue;
        for (const opt of options) {
            const covered = [...rows, ...leafRows].some((row) => {
                const text = cellText(row.cells[filter.id]);
                return (text === opt.label ||
                    text.includes(opt.label) ||
                    opt.label.includes(text) ||
                    text === opt.value);
            });
            if (!covered) {
                issues.push({
                    level: 'warn',
                    code: 'filter-option-uncovered',
                    message: `筛选项「${filter.label}」选项「${opt.label}」在 mock rows 中无对应数据`,
                });
            }
        }
    }
    return issues;
}
export function analyzeListPageMockCoverage(page) {
    const issues = [];
    const rows = page.table?.rows ?? [];
    const leafRows = flattenTableRows(rows);
    if (leafRows.length === 0 && rows.length === 0)
        return issues;
    const rowCount = leafRows.length || rows.length;
    if (rowCount < MIN_ROWS) {
        issues.push({
            level: 'error',
            code: 'rows-too-few',
            message: `mock 行数过少（${rowCount} 行），建议至少 ${MIN_ROWS} 条以便验收`,
        });
    }
    if (rowCount > MAX_ROWS) {
        issues.push({
            level: 'warn',
            code: 'rows-too-many',
            message: `mock 行数过多（${rowCount} 行），建议不超过 ${MAX_ROWS} 条`,
        });
    }
    const actions = collectActions(rows);
    const statuses = collectStatuses(rows);
    const usesStatus = rowsUseStatus(rows);
    if (usesStatus) {
        for (const [action, requiredStatus] of Object.entries(STATE_ACTION_REQUIREMENTS)) {
            if (!actions.has(action))
                continue;
            if (!statuses.has(requiredStatus)) {
                issues.push({
                    level: 'error',
                    code: `missing-status-${requiredStatus}`,
                    message: `行操作含「${action}」，但 mock 缺少 status=${requiredStatus} 的样例行`,
                });
            }
        }
    }
    issues.push(...analyzeFilterCoverage(page.filters, rows));
    return issues;
}
export function listPageUsesStateFlow(page) {
    const rows = page.table?.rows ?? [];
    if (!rowsUseStatus(rows))
        return false;
    const actions = collectActions(rows);
    return actions.has('publish') || actions.has('void') || actions.has('copy');
}
export function formPageHasRequiredFields(page) {
    for (const section of page.sections ?? []) {
        for (const field of section.fields ?? []) {
            if (field.required)
                return true;
        }
    }
    return false;
}
export function mockCoverageIssueToAcceptanceId(_code, index) {
    return `A-${String(index + 1).padStart(2, '0')}`;
}
