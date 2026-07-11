export function labelsMatch(specLabel, prdCell) {
    const a = specLabel.trim();
    const b = prdCell.trim();
    if (!a || !b)
        return false;
    if (a === b)
        return true;
    return a.includes(b) || b.includes(a);
}
