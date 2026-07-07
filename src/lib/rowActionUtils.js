export function normalizeRowAction(item) {
    return typeof item === 'string' ? item : item.action;
}
export function rowActionKey(item, index) {
    return typeof item === 'string' ? `${item}-${index}` : `${item.action}-${index}`;
}
