import { describe, expect, it } from 'vitest';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assemblePageFromParts } from '../lib/assemblePageParts';
import { getFeeSections } from '@prototype/patterns/ruleConfigFormUtils';
import { collectPagePartsFromPagesDir } from '../../../../scripts/loadPageSpec';
describe('published page assembly parity', () => {
    it('rule-config detail 合并 shared sections 与 fee-rows', () => {
        const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
        const pagesDir = join(root, 'prototypes/rule-config/v1/pages');
        const parts = collectPagePartsFromPagesDir(pagesDir, 'detail');
        const page = assemblePageFromParts(parts);
        expect(getFeeSections(page).length).toBeGreaterThan(0);
        expect(page.feeRowSamples?.['快递费配置::基础费']?.[0]?.feeRuleId).toBe('sf-001');
    });
    it('rule-config form 合并后含费用 sections', () => {
        const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
        const pagesDir = join(root, 'prototypes/rule-config/v1/pages');
        const parts = collectPagePartsFromPagesDir(pagesDir, 'form');
        const page = assemblePageFromParts(parts);
        expect(getFeeSections(page).length).toBeGreaterThan(0);
    });
});
