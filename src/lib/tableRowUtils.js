export function flattenTableRows(rows) {
    const out = [];
    for (const row of rows) {
        if (row.children?.length) {
            out.push(...flattenTableRows(row.children));
        }
        else if (row.rowType !== 'group') {
            out.push(row);
        }
    }
    return out;
}
export function findTableRowById(rows, rowId) {
    for (const row of rows) {
        if (row.id === rowId)
            return row;
        if (row.children?.length) {
            const found = findTableRowById(row.children, rowId);
            if (found)
                return found;
        }
    }
    return undefined;
}
