export { resolveReviewAnchor, getTableRowHintFallback, isLegacyImportModalReviewId, } from './anchorRules';
export { FORM_PAGE_RECOMMENDED_ANCHORS, FORM_WAREHOUSE_SPLIT_ANCHORS, FORM_ZONE_TABLE_ANCHORS, FORM_SURCHARGE_TABLE_ANCHORS, LIST_PAGE_RECOMMENDED_ANCHORS, deriveListPageExpectations, deriveFormPageExpectations, } from './expectations';
import { getTableRowHintFallback, resolveReviewAnchor, } from './anchorRules';
import { labelsMatch } from './match';
export { labelsMatch } from './match';
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
