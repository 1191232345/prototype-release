import { describe, expect, it } from 'vitest';
import { filterDocSections, inferPageScope, parseRequirementsDoc, parseSectionHeading, } from './parseRequirementsDoc';
describe('parseSectionHeading', () => {
    it('解析标题末尾锚点', () => {
        expect(parseSectionHeading('检索条件说明 {#list.filters}')).toEqual({
            title: '检索条件说明',
            anchorId: 'list.filters',
        });
        expect(parseSectionHeading('无锚点标题')).toEqual({ title: '无锚点标题' });
    });
});
describe('inferPageScope', () => {
    it('从 anchorId 推断页面', () => {
        expect(inferPageScope('', 'list.filters')).toBe('list');
        expect(inferPageScope('', 'form.fields')).toBe('form');
    });
    it('从标题关键词推断页面', () => {
        expect(inferPageScope('列表页 · 初始化', undefined)).toBe('list');
        expect(inferPageScope('表单页 · 字段', undefined)).toBe('form');
    });
});
describe('filterDocSections', () => {
    const sections = [
        { title: 'A', icon: 'x', blocks: [], pageScope: 'list' },
        { title: 'B', icon: 'x', blocks: [], pageScope: 'form' },
        { title: 'C', icon: 'x', blocks: [] },
    ];
    it('null pageScope 返回全部', () => {
        expect(filterDocSections(sections, null)).toHaveLength(3);
    });
    it('按 pageScope 过滤', () => {
        expect(filterDocSections(sections, 'list')).toHaveLength(1);
    });
});
describe('parseRequirementsDoc', () => {
    it('解析标题、章节、表格与锚点', () => {
        const doc = parseRequirementsDoc(`# 测试需求

## 现状

当前流程繁琐。

## 列表页 · 检索条件 {#list.filters}

| 字段 | 说明 |
| --- | --- |
| 名称 | 模糊匹配 |

- 条目一
`);
        expect(doc.title).toBe('测试需求');
        expect(doc.sections).toHaveLength(2);
        const filters = doc.sections.find((s) => s.anchorId === 'list.filters');
        expect(filters?.pageScope).toBe('list');
        expect(filters?.blocks.some((b) => b.type === 'table')).toBe(true);
        expect(filters?.blocks.some((b) => b.type === 'list')).toBe(true);
    });
});
