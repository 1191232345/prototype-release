import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from 'react';
import { PatternErrorBoundary } from './PatternErrorBoundary';
import { FaIcon } from '@prototype/ui/Icon';
const asPattern = (component) => component;
const patternLoaders = {
    'rule-config-list': () => import('@prototype/patterns/RuleConfigList').then((m) => ({ default: asPattern(m.RuleConfigListPattern) })),
    'rule-config-form': () => import('@prototype/patterns/RuleConfigForm').then((m) => ({ default: asPattern(m.RuleConfigFormPattern) })),
    'rule-config-detail': () => import('@prototype/patterns/RuleConfigDetail').then((m) => ({ default: asPattern(m.RuleConfigDetailPattern) })),
    'price-card-list': () => import('@prototype/patterns/RuleConfigList').then((m) => ({ default: asPattern(m.RuleConfigListPattern) })),
    'price-card-form': () => import('@prototype/patterns/RuleConfigForm').then((m) => ({ default: asPattern(m.RuleConfigFormPattern) })),
    'price-card-detail': () => import('@prototype/patterns/RuleConfigDetail').then((m) => ({ default: asPattern(m.RuleConfigDetailPattern) })),
    'express-supplement-import-form': () => import('@prototype/patterns/ExpressSupplementImportForm').then((m) => ({
        default: asPattern(m.ExpressSupplementImportFormPattern),
    })),
    'sku-fill-list': () => import('@prototype/patterns/SkuFillList').then((m) => ({ default: asPattern(m.SkuFillListPattern) })),
    'sku-fill-form': () => import('@prototype/patterns/SkuFillForm').then((m) => ({ default: asPattern(m.SkuFillFormPattern) })),
    'sku-fill-detail-page': () => import('@prototype/patterns/SkuFillDetailPage').then((m) => ({ default: asPattern(m.SkuFillDetailPagePattern) })),
    'sku-fill-audit-page': () => import('@prototype/patterns/SkuFillDetailPage').then((m) => ({ default: asPattern(m.SkuFillDetailPagePattern) })),
    'sku-fill-pda-list': () => import('@prototype/patterns/SkuFillPdaList').then((m) => ({ default: asPattern(m.SkuFillPdaListPattern) })),
    'sku-fill-pda-task': () => import('@prototype/patterns/SkuFillPdaTask').then((m) => ({ default: asPattern(m.SkuFillPdaTaskPattern) })),
};
const lazyPatterns = Object.fromEntries(Object.entries(patternLoaders).map(([id, loader]) => [id, lazy(loader)]));
function PatternSkeleton() {
    return (_jsxs("div", { className: "flex items-center justify-center p-12 text-text-muted", children: [_jsx(FaIcon, { className: "fas fa-spinner fa-spin mr-2" }), "\u52A0\u8F7D\u9875\u9762\u2026"] }));
}
export function renderSpec(spec) {
    const Pattern = lazyPatterns[spec.pattern];
    if (!Pattern) {
        return (_jsxs("div", { className: "p-8 text-center text-danger", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle text-2xl mb-2" }), _jsxs("p", { children: ["\u672A\u77E5 Pattern: ", spec.pattern] })] }));
    }
    return (_jsx(PatternErrorBoundary, { pattern: spec.pattern, children: _jsx(Suspense, { fallback: _jsx(PatternSkeleton, {}), children: _jsx(Pattern, { spec: spec }) }) }));
}
