import { parseRequirementsDoc } from '../parseRequirementsDoc';
import { getTableRowHintFallback, resolveReviewAnchor, } from './rules';
export function reviewAnchorId(reviewId) {
    return resolveReviewAnchor(reviewId).anchorId;
}
function sectionKeywords(reviewId) {
    return resolveReviewAnchor(reviewId).keywords;
}
function tableRowHint(reviewId) {
    return getTableRowHintFallback(reviewId);
}
function findSectionByAnchor(sections, anchorId) {
    return sections.find((s) => s.anchorId === anchorId);
}
function findSectionByKeywords(sections, keywords) {
    for (const kw of keywords) {
        const section = sections.find((s) => s.title.includes(kw));
        if (section)
            return section;
    }
    return undefined;
}
export function locateInPrd(sections, reviewId, rowHintOverride) {
    const { anchorId } = resolveReviewAnchor(reviewId);
    const section = (anchorId && findSectionByAnchor(sections, anchorId)) ??
        findSectionByKeywords(sections, sectionKeywords(reviewId));
    if (!section)
        return null;
    return {
        sectionTitle: section.title,
        anchorId: section.anchorId,
        tableRowHint: rowHintOverride ?? tableRowHint(reviewId),
    };
}
export function locateInPrdText(prdText, reviewId, rowHintOverride) {
    if (!prdText.trim())
        return null;
    const { sections } = parseRequirementsDoc(prdText);
    return locateInPrd(sections, reviewId, rowHintOverride);
}
export function sectionDomId(section) {
    if (section.anchorId)
        return `prd-${section.anchorId}`;
    return `prd-sec-${section.title.replace(/\s+/g, '-').replace(/[·]/g, '')}`;
}
export function findPrdSectionElement(root, highlightKey) {
    if (!root)
        return null;
    const candidates = [`prd-${highlightKey}`, sectionDomId({ title: highlightKey })];
    for (const id of candidates) {
        const el = root.querySelector(`[id="${id.replace(/"/g, '\\"')}"]`);
        if (el instanceof HTMLElement)
            return el;
    }
    return null;
}
export function scrollPrdSectionIntoView(scrollContainer, sectionEl, behavior = 'smooth') {
    const cRect = scrollContainer.getBoundingClientRect();
    const eRect = sectionEl.getBoundingClientRect();
    const top = scrollContainer.scrollTop +
        (eRect.top - cRect.top) -
        scrollContainer.clientHeight / 2 +
        sectionEl.clientHeight / 2;
    scrollContainer.scrollTo({ top: Math.max(0, top), behavior });
}
export function reviewHintLabel(reviewId, located) {
    if (!located) {
        const anchor = reviewAnchorId(reviewId);
        return anchor ? `未找到 PRD 锚点 · ${anchor}` : '未找到 PRD 对应章节';
    }
    const row = located.tableRowHint;
    const sec = located.sectionTitle?.replace(/^[\d.]+\s*/, '') ?? 'PRD';
    return row ? `${sec} · ${row}` : sec;
}
export function reviewTarget(id, rowHint) {
    const attrs = {
        'data-review-id': id,
    };
    if (rowHint)
        attrs['data-review-row'] = rowHint;
    return attrs;
}
