const ROW_STATUSES = ['draft', 'published', 'voided'];
export function resolveStatusLabels(filters, overrides) {
    const statusFilter = filters?.find((f) => f.id === 'status');
    const fromFilters = {};
    for (const opt of statusFilter?.options ?? []) {
        if (opt.value === 'all')
            continue;
        if (ROW_STATUSES.includes(opt.value)) {
            fromFilters[opt.value] = opt.label;
        }
    }
    const merged = { ...fromFilters, ...overrides };
    return Object.keys(merged).length > 0 ? merged : undefined;
}
