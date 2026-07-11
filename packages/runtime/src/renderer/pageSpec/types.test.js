import { describe, expect, it } from 'vitest';
describe('RuleConfigListPageSpec typing', () => {
    it('requires table block for list pattern', () => {
        const spec = {
            pattern: 'rule-config-list',
            title: '规则配置',
            table: {
                columns: [{ key: 'name', label: '名称' }],
                rows: [{ id: '1', cells: { name: '规则 A' } }],
            },
        };
        expect(spec.table.rows).toHaveLength(1);
        expect(spec.table.rows[0].cells.name).toBe('规则 A');
    });
});
