const STATUS_LABELS = {
    draft: { label: '草稿', tone: 'muted' },
    pending: { label: '待确认', tone: 'warn' },
    review: { label: '评审中', tone: 'warn' },
    confirmed: { label: '已确认', tone: 'ok' },
    approved: { label: '已确认', tone: 'ok' },
};
export function formatStatus(status) {
    const key = (status || '').trim().toLowerCase();
    if (!key)
        return { label: '待确认', tone: 'warn' };
    return STATUS_LABELS[key] ?? { label: status, tone: 'muted' };
}
export function resolvePageTitle(meta, fallback = '需求文档') {
    return meta?.title?.trim() || fallback;
}
export function resolveDocHeading(meta, parsedTitle) {
    const base = meta?.title?.trim() || parsedTitle?.replace(/^需求文档\s*[-–—]\s*/, '') || '需求文档';
    return `${base} PRD`;
}
