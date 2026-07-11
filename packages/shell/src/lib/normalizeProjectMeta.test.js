import { describe, expect, it } from 'vitest';
import { getManifestPageIds, isFilesystemProjectReady, normalizeMetaInfo, } from './normalizeProjectMeta';
describe('normalizeMetaInfo', () => {
    const parsed = { project: 'test', version: 'v1', key: 'test/v1' };
    it('fills required fields when AI omits them', () => {
        const meta = normalizeMetaInfo(parsed, {
            title: '订单系统',
            changeSummary: '初始化',
        });
        expect(meta.id).toBe('test');
        expect(meta.project).toBe('test');
        expect(meta.type).toBe('flow');
        expect(meta.mode).toBe('spec');
        expect(meta.designSystem).toBe('elsa-enterprise');
        expect(meta.author).toBe('待填写');
        expect(meta.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
describe('getManifestPageIds', () => {
    it('returns page ids from valid manifest', () => {
        const manifest = {
            type: 'flow',
            title: 'x',
            entry: 'list',
            pages: ['list', 'form'],
        };
        expect(getManifestPageIds(manifest)).toEqual(['list', 'form']);
    });
    it('returns empty array when pages is wrongly an object', () => {
        const manifest = {
            type: 'flow',
            title: 'x',
            entry: 'list',
            pages: { list: { pattern: 'rule-config-list' } },
        };
        expect(getManifestPageIds(manifest)).toEqual([]);
    });
});
describe('isFilesystemProjectReady', () => {
    const meta = normalizeMetaInfo({ project: 'test', version: 'v1', key: 'test/v1' }, {
        id: 'test',
        version: 'v1',
        title: 'Test',
        project: 'test',
        type: 'flow',
        mode: 'spec',
        designSystem: 'elsa-enterprise',
        author: 'a',
        createdAt: '2026-07-08',
    });
    it('rejects wrong pages shape', () => {
        const manifest = {
            type: 'flow',
            title: 'Test',
            entry: 'list',
            pages: { list: {} },
        };
        expect(isFilesystemProjectReady(manifest, meta, true)).toBe(false);
    });
    it('requires entry page file', () => {
        const manifest = {
            type: 'flow',
            title: 'Test',
            entry: 'list',
            pages: ['list'],
        };
        expect(isFilesystemProjectReady(manifest, meta, false)).toBe(false);
        expect(isFilesystemProjectReady(manifest, meta, true)).toBe(true);
    });
});
