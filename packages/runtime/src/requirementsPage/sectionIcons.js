export function sectionNavIcon(title) {
    if (/背景|目标|现状|痛点|诉求/.test(title))
        return 'bullseye';
    if (/流程|业务/.test(title))
        return 'diagram-project';
    if (/功能|交互/.test(title))
        return 'list-check';
    if (/角色|权限/.test(title))
        return 'user-shield';
    if (/范围|边界/.test(title))
        return 'flag';
    if (/验收/.test(title))
        return 'clipboard-check';
    if (/待确认|确认/.test(title))
        return 'circle-question';
    if (/名词|术语/.test(title))
        return 'book';
    if (/变更/.test(title))
        return 'history';
    return 'file-lines';
}
export function sectionDisplayNumber(title, index) {
    const cn = title.match(/^([一二三四五六七八九十]+)\./);
    if (cn) {
        const map = {
            一: '1', 二: '2', 三: '3', 四: '4', 五: '5', 六: '6', 七: '7', 八: '8', 九: '9', 十: '10',
        };
        return map[cn[1]] ?? String(index + 1);
    }
    const num = title.match(/^(\d+)\./);
    if (num)
        return num[1];
    return String(index + 1);
}
export function sectionDomSlug(title, index) {
    const stripped = title
        .replace(/^[一二三四五六七八九十\d]+[.、\s]+/, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fff-]+/g, '');
    return stripped ? `sec-${stripped}` : `sec-${index + 1}`;
}
