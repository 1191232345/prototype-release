export const PLATFORM_LABELS = {
    pc: 'PC 端',
    mobile: '移动端',
};
export const PLATFORM_ICONS = {
    pc: 'fa-desktop',
    mobile: 'fa-mobile-alt',
};
export function designSystemForPlatform(platform) {
    return platform === 'mobile' ? 'elsa-pda' : 'elsa-enterprise';
}
export function isMobileDesignSystem(designSystem) {
    if (!designSystem)
        return false;
    return designSystem === 'elsa-pda' || designSystem.endsWith('-pda');
}
export function getProjectPlatform(item) {
    return isMobileDesignSystem(item.meta.designSystem) ? 'mobile' : 'pc';
}
export function groupProjectsByPlatform(items) {
    const groups = { pc: [], mobile: [] };
    for (const item of items) {
        groups[getProjectPlatform(item)].push(item);
    }
    return groups;
}
