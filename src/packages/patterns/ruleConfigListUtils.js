import { normalizeRowAction } from '../../lib/rowActionUtils';
export function cellPrimary(cell) {
    if (cell == null)
        return '';
    if (typeof cell === 'string')
        return cell;
    return cell.primary ?? '';
}
export function periodStart(cell) {
    return cellPrimary(cell);
}
export function getBatchScope(rows, selectedIds) {
    const isFull = selectedIds.size === 0;
    const targetRows = isFull ? rows : rows.filter((row) => selectedIds.has(row.id));
    return { isFull, count: targetRows.length, rows: targetRows };
}
export function getConfirmableRows(rows, selectedIds) {
    return getBatchScope(rows, selectedIds).rows.filter((row) => row.actions?.some((action) => normalizeRowAction(action) === 'publish'));
}
