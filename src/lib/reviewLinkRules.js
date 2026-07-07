export { resolveReviewAnchor, getTableRowHintFallback, isLegacyImportModalReviewId, } from './reviewLinkAnchorRules';
export { FORM_PAGE_RECOMMENDED_ANCHORS, FORM_WAREHOUSE_SPLIT_ANCHORS, FORM_ZONE_TABLE_ANCHORS, FORM_SURCHARGE_TABLE_ANCHORS, LIST_PAGE_RECOMMENDED_ANCHORS, deriveListPageExpectations, deriveFormPageExpectations, } from './reviewLinkExpectations';
import { getTableRowHintFallback, resolveReviewAnchor, } from './reviewLinkAnchorRules';
import { labelsMatch } from './reviewLinkMatch';
export { labelsMatch } from './reviewLinkMatch';
export function findReviewIdsForPrdPick(stageRoot, anchorId, rowLabel) {
    const out = [];
    stageRoot.querySelectorAll('[data-review-id]').forEach((node) => {
        if (!(node instanceof HTMLElement))
            return;
        const id = node.getAttribute('data-review-id');
        if (!id)
            return;
        const { anchorId: resolved } = resolveReviewAnchor(id);
        if (resolved !== anchorId)
            return;
        if (rowLabel) {
            const hint = node.getAttribute('data-review-row') ?? getTableRowHintFallback(id);
            if (!hint || !labelsMatch(rowLabel, hint))
                return;
        }
        out.push(id);
    });
    return out;
}
