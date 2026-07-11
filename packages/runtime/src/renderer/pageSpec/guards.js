const PATTERN_IDS = [
    'rule-config-list',
    'rule-config-form',
    'rule-config-detail',
    'price-card-list',
    'price-card-form',
    'price-card-detail',
    'express-supplement-import-form',
    'sku-fill-list',
    'sku-fill-form',
    'sku-fill-detail-page',
    'sku-fill-audit-page',
    'sku-fill-pda-list',
    'sku-fill-pda-task',
];
export function isKnownPatternId(pattern) {
    return PATTERN_IDS.includes(pattern);
}
export function isRuleConfigListSpec(spec) {
    return spec.pattern === 'rule-config-list';
}
export function isRuleConfigFormSpec(spec) {
    return spec.pattern === 'rule-config-form';
}
export function isFeeConfigSpec(spec) {
    return spec.pattern === 'rule-config-form' || spec.pattern === 'rule-config-detail' || spec.pattern === 'price-card-form' || spec.pattern === 'price-card-detail';
}
export function isPriceCardListSpec(spec) {
    return spec.pattern === 'price-card-list';
}
export function isPriceCardFormSpec(spec) {
    return spec.pattern === 'price-card-form';
}
export function isExpressSupplementImportFormSpec(spec) {
    return spec.pattern === 'express-supplement-import-form';
}
export function isSkuFillListSpec(spec) {
    return spec.pattern === 'sku-fill-list';
}
export function isSkuFillFormSpec(spec) {
    return spec.pattern === 'sku-fill-form';
}
export function isSkuFillDetailSpec(spec) {
    return spec.pattern === 'sku-fill-detail-page' || spec.pattern === 'sku-fill-audit-page';
}
export function isSkuFillPdaListSpec(spec) {
    return spec.pattern === 'sku-fill-pda-list';
}
export function isSkuFillPdaTaskSpec(spec) {
    return spec.pattern === 'sku-fill-pda-task';
}
export function narrowPageSpec(raw) {
    if (!isKnownPatternId(raw.pattern))
        return null;
    return raw;
}
