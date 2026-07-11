export function recalcSegmentStarts(segments, perFeeItem) {
    return segments.map((seg, i) => {
        if (!perFeeItem) {
            if (i === 0)
                return { ...seg, start: 0 };
            return { ...seg, start: segments[i - 1].end };
        }
        let start = 0;
        for (let j = i - 1; j >= 0; j--) {
            if (segments[j].feeItem && segments[j].feeItem === seg.feeItem) {
                start = segments[j].end;
                break;
            }
        }
        return { ...seg, start };
    });
}
export function feeItemLabel(value, options) {
    if (!value)
        return '—';
    return options.find((o) => o.value === value)?.label ?? value;
}
