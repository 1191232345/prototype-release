import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderRequirementsPageHtml } from './renderHtml';
describe('renderRequirementsPageHtml', () => {
    it('生成 Axure 风格全页 HTML', () => {
        const sample = `# 需求文档 - 尾货处理

## 一. 背景及目标

### 1.1 现状

尾货数量少。

## 二. 业务流程

库存低于 5 件时提醒。

| 步骤 | 执行人 | 做什么 | 结果 |
| --- | --- | --- | --- |
| ① 自动预警 | 系统 | 标红 | 生成任务 |
`;
        const html = renderRequirementsPageHtml({
            markdown: sample,
            meta: { title: '尾货处理', version: 'v1', author: 'zsw', createdAt: '2026-07-08', status: 'draft' },
            cssText: '/* test */',
        });
        expect(html).toContain('<nav id="sidebar">');
        expect(html).not.toContain('fonts.googleapis.com');
        expect(html).not.toContain('font-awesome');
        expect(html).toContain('<svg class="req-icon');
        expect(html).toContain('尾货处理 PRD');
        expect(html).toContain('class="hero"');
        expect(html).toContain('id="sec-背景及目标"');
        expect(html).toContain('<table>');
        expect(html).toContain('progress-bar');
    });
    it('可加载真实 REQUIREMENTS 样例', () => {
        const root = join(import.meta.dirname, '../../../..');
        const md = readFileSync(join(root, 'prototypes/尾货处理/v1/REQUIREMENTS.md'), 'utf8');
        const html = renderRequirementsPageHtml({
            markdown: md,
            meta: { title: '尾货处理', version: 'v1', status: 'draft' },
            cssText: '',
        });
        expect(html).toContain('角色与权限');
        expect(html).toContain('待确认事项');
    });
});
