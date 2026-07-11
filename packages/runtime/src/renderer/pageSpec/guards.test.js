import { describe, expect, it } from 'vitest';
import { isKnownPatternId, isRuleConfigListSpec, isSkuFillListSpec, narrowPageSpec, } from './guards';
const ruleConfigListSpec = {
    pattern: 'rule-config-list',
    title: '规则配置',
    table: { columns: [{ key: 'name', label: '名称' }], rows: [] },
};
describe('pageSpecGuards', () => {
    it('isKnownPatternId accepts registered patterns', () => {
        expect(isKnownPatternId('rule-config-list')).toBe(true);
        expect(isKnownPatternId('unknown-pattern')).toBe(false);
    });
    it('isRuleConfigListSpec narrows list spec', () => {
        expect(isRuleConfigListSpec(ruleConfigListSpec)).toBe(true);
        expect(isSkuFillListSpec(ruleConfigListSpec)).toBe(false);
    });
    it('narrowPageSpec returns null for unknown pattern', () => {
        const unknown = { pattern: 'custom', title: 'x' };
        expect(narrowPageSpec(unknown)).toBeNull();
    });
    it('narrowPageSpec returns pattern union for known pattern', () => {
        const narrowed = narrowPageSpec(ruleConfigListSpec);
        expect(narrowed?.pattern).toBe('rule-config-list');
        expect(narrowed && 'table' in narrowed && narrowed.table.rows).toEqual([]);
    });
});
