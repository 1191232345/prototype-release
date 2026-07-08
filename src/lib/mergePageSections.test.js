import { describe, expect, it } from 'vitest';
import { assemblePageFromParts, applyPageTimelines, mergePageDetails, } from './assemblePageParts';
import { assemblePageSpec, normalizeFragmentPayload } from './mergePageSections';
const basePage = {
    pattern: 'rule-config-form',
    title: '测试页',
    includeSections: ['fee-a'],
    sections: [{ title: '基本信息', icon: 'fa-info', fields: [] }],
};
describe('assemblePageSpec', () => {
    it('按 includeSections 合并 shared 片段', () => {
        const fragment = {
            title: '快递费',
            icon: 'fa-truck',
            tabs: [{ label: 'Tab1', content: { fields: [] } }],
        };
        const result = assemblePageSpec(basePage, {
            sharedFragments: { 'fee-a': fragment, 'fee-b': { title: '忽略', icon: 'x', fields: [] } },
        });
        expect(result.sections).toHaveLength(2);
        expect(result.sections?.[1].title).toBe('快递费');
    });
    it('同名 section 合并 tabs', () => {
        const page = {
            ...basePage,
            sections: [{ title: '库内费用', icon: 'fa-box', tabs: [{ label: 'A', content: { fields: [] } }] }],
        };
        const incoming = {
            title: '库内费用',
            icon: 'fa-box',
            tabs: [{ label: 'B', content: { fields: [] } }],
        };
        const result = assemblePageSpec(page, { pageFragments: { part1: incoming } });
        expect(result.sections?.[0].tabs).toHaveLength(2);
    });
    it('normalizeFragmentPayload 支持数组与 sections 包装', () => {
        const section = { title: 'S', icon: 'fa-x', fields: [] };
        expect(normalizeFragmentPayload([section])).toEqual([section]);
        expect(normalizeFragmentPayload({ sections: [section] })).toEqual([section]);
        expect(normalizeFragmentPayload(section)).toEqual([section]);
    });
});
describe('assemblePageFromParts', () => {
    it('按 sections → details → timelines 顺序组装', () => {
        const result = assemblePageFromParts({
            page: basePage,
            sharedFragments: {
                'fee-a': { title: '附加', icon: 'fa-plus', fields: [] },
            },
            feeRowSamples: { zone1: [{ col: '1' }] },
            detailFragments: [{ row1: { title: '行1', sections: [] } }],
            timelines: { row1: [{ time: '2024-01-01', operator: '系统', action: '创建', state: 'done' }] },
        });
        expect(result.sections?.some((s) => s.title === '附加')).toBe(true);
        expect(result.feeRowSamples?.zone1).toHaveLength(1);
        expect(result.details?.row1.title).toBe('行1');
        expect(result.details?.row1.timeline).toHaveLength(1);
    });
});
describe('mergePageDetails', () => {
    it('按顺序叠加 details 片段', () => {
        const page = mergePageDetails(basePage, { a: { title: 'A', sections: [] } }, { b: { title: 'B', sections: [] } });
        expect(Object.keys(page.details ?? {})).toEqual(['a', 'b']);
    });
    it('无 details 时不修改 page 引用', () => {
        expect(mergePageDetails(basePage)).toBe(basePage);
    });
});
describe('applyPageTimelines', () => {
    it('仅写入已有 details 行', () => {
        const page = {
            ...basePage,
            details: { row1: { title: '行1', sections: [] } },
        };
        const next = applyPageTimelines(page, {
            row1: [{ time: 't', operator: '张三', action: '更新', state: 'done' }],
            missing: [{ time: 't', operator: '李四', action: '忽略', state: 'done' }],
        });
        expect(next.details?.row1.timeline).toHaveLength(1);
        expect(next.details?.missing).toBeUndefined();
    });
});
