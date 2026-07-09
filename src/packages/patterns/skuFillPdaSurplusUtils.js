export function isReadonlySurplusStatus(status) {
    return status === 'completed' || status === 'pending_review';
}
export function gridItemMap(sections) {
    const map = new Map();
    for (const section of sections) {
        if (section.layout !== 'grid' || !section.items)
            continue;
        for (const item of section.items) {
            map.set(item.label, item.value);
        }
    }
    return map;
}
function parseRfidList(raw) {
    if (!raw || raw === '—')
        return [];
    return raw.split('\n').map((line) => line.trim()).filter(Boolean);
}
export function extractSurplusTaskContext(spec, rowDetail) {
    const items = rowDetail?.sections ? gridItemMap(rowDetail.sections) : new Map();
    const guideSection = spec.sections?.find((s) => s.title.includes('逻辑'));
    const logicGuide = guideSection?.fields?.find((f) => f.id === 'logicGuide')?.defaultValue ?? '';
    const interactionGuide = guideSection?.fields?.find((f) => f.id === 'interactionGuide')?.defaultValue ?? '';
    const catalog = parseRfidList(items.get('RFID 清单'));
    const fallbackCatalog = spec.sections
        ?.flatMap((s) => s.fields ?? [])
        .find((f) => f.id === 'rfidCatalog')
        ?.options?.map((o) => o.value || o.label)
        .filter(Boolean);
    return {
        sku: items.get('SKU') ?? spec.title,
        location: items.get('库位码') ?? '-',
        pallet: items.get('托盘号') ?? '-',
        rejectReason: items.get('驳回原因'),
        catalog: catalog.length ? catalog : fallbackCatalog ?? ['RFID-EPC-DEMO-0001'],
        logicGuide,
        interactionGuide,
    };
}
