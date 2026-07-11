export const DEFAULT_END_SUFFIX = '23:59:59';
export const DEFAULT_START_SUFFIX = '00:00:00';
export function parseDateTime(value) {
    if (!value?.trim())
        return null;
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const d = new Date(normalized.length === 16 ? `${normalized}:00` : normalized);
    return Number.isNaN(d.getTime()) ? null : d;
}
export function formatDateTime(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
export function endOfDay(d) {
    const out = new Date(d);
    out.setHours(23, 59, 59, 0);
    return out;
}
export function startOfDay(d) {
    const out = new Date(d);
    out.setHours(0, 0, 0, 0);
    return out;
}
export function nextDayStart(from) {
    const out = startOfDay(from);
    out.setDate(out.getDate() + 1);
    return out;
}
export function previousDayEnd(from) {
    const out = startOfDay(from);
    out.setDate(out.getDate() - 1);
    return endOfDay(out);
}
export function intervalsOverlapClosed(a, b) {
    return a.start <= b.end && b.start <= a.end;
}
export function formatClosedPeriod(start, end) {
    return `${formatDateTime(start)} 至 ${formatDateTime(end)}`;
}
export function truncateEndBeforeNewStart(newStart) {
    return formatDateTime(previousDayEnd(newStart));
}
export function defaultStartAfterEnd(previousEnd) {
    return formatDateTime(nextDayStart(previousEnd));
}
export function isStartAfterToday(startTime, now = new Date()) {
    const start = parseDateTime(startTime);
    if (!start)
        return false;
    return startOfDay(start).getTime() > startOfDay(now).getTime();
}
export function describeEffectiveByStart(startTime, now = new Date()) {
    return isStartAfterToday(startTime, now)
        ? '开始日期晚于今天 → 待生效（旧规则继续执行至新开始前一天）'
        : '开始日期 ≤ 今天 → 立即生效（重叠旧规则发布时停用）';
}
