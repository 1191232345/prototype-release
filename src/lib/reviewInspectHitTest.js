const IGNORE_SELECTOR = '.review-inspect-overlay, .split-review-inspect-bar';
function shouldIgnoreElement(el) {
    if (el.closest(IGNORE_SELECTOR))
        return true;
    if (el.classList.contains('modal-backdrop-contained') ||
        el.classList.contains('modal-backdrop')) {
        return true;
    }
    return false;
}
export function reviewHitAtPoint(hitRoot, clientX, clientY) {
    if (!hitRoot)
        return null;
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
        if (!(el instanceof HTMLElement))
            continue;
        if (!hitRoot.contains(el))
            continue;
        if (shouldIgnoreElement(el))
            continue;
        const reviewEl = el.closest('[data-review-id]');
        if (reviewEl instanceof HTMLElement && hitRoot.contains(reviewEl)) {
            const reviewId = reviewEl.getAttribute('data-review-id');
            if (!reviewId)
                continue;
            const rowHint = reviewEl.getAttribute('data-review-row') ?? undefined;
            return { reviewId, tableRowHint: rowHint || undefined };
        }
    }
    return null;
}
export function reviewIdAtPoint(hitRoot, clientX, clientY) {
    return reviewHitAtPoint(hitRoot, clientX, clientY)?.reviewId ?? null;
}
export function clearReviewInspectHover(root) {
    root?.querySelectorAll('.review-inspect-hover-target').forEach((el) => {
        el.classList.remove('review-inspect-hover-target');
    });
}
export function setReviewInspectHover(root, reviewId) {
    clearReviewInspectHover(root);
    if (!reviewId || !root)
        return;
    root
        .querySelector(`[data-review-id="${CSS.escape(reviewId)}"]`)
        ?.classList.add('review-inspect-hover-target');
}
