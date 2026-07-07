export function clearPrototypeLocateHighlight(stageRoot) {
    stageRoot?.querySelectorAll('.review-prototype-locate-target').forEach((el) => {
        el.classList.remove('review-prototype-locate-target');
    });
}
export function setPrototypeLocateHighlight(stageRoot, reviewId) {
    clearPrototypeLocateHighlight(stageRoot);
    if (!reviewId || !stageRoot)
        return;
    stageRoot
        .querySelector(`[data-review-id="${CSS.escape(reviewId)}"]`)
        ?.classList.add('review-prototype-locate-target');
}
export function scrollPrototypeToReviewId(scrollRoot, stageRoot, reviewId, behavior = 'smooth') {
    if (!stageRoot)
        return;
    const target = stageRoot.querySelector(`[data-review-id="${CSS.escape(reviewId)}"]`);
    if (!(target instanceof HTMLElement))
        return;
    if (scrollRoot?.contains(target)) {
        const cRect = scrollRoot.getBoundingClientRect();
        const eRect = target.getBoundingClientRect();
        const top = scrollRoot.scrollTop +
            (eRect.top - cRect.top) -
            scrollRoot.clientHeight / 2 +
            target.clientHeight / 2;
        scrollRoot.scrollTo({ top: Math.max(0, top), behavior });
    }
    else {
        target.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
    }
}
