import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseChangelogMarkdown } from './parseChangelog';
import { changelogRowsFromBlocks, renderChangelogTableHtml } from './renderChangelogTable';
import { parseRequirementsDoc } from '../parseRequirementsDoc';
describe('parseChangelogMarkdown', () => {
    it('解析 CHANGELOG.md 日期标题与条目', () => {
        const rows = parseChangelogMarkdown(`# 变更记录

## 2026-07-08（状态分流）
- 列表跳转任务页时带入任务状态。
- 任务页按状态分流。

## 2026-07-07 · 导入导出
- **导入**：批量导入
`);
        expect(rows).toHaveLength(2);
        expect(rows[0]).toMatchObject({
            date: '2026-07-08',
            summary: '状态分流',
            items: expect.arrayContaining(['列表跳转任务页时带入任务状态。']),
        });
        expect(rows[1].summary).toBe('导入导出');
    });
    it('从 REQUIREMENTS 变更记录章节生成表格行', () => {
        const md = readFileSync(join(import.meta.dirname, '../../../../prototypes/尾货处理/v1/REQUIREMENTS.md'), 'utf8');
        const section = parseRequirementsDoc(md).sections.find((s) => s.title === '变更记录');
        expect(section).toBeTruthy();
        const rows = changelogRowsFromBlocks(section.blocks);
        expect(rows.length).toBeGreaterThan(0);
        expect(renderChangelogTableHtml(rows)).toContain('<table class="changelog-table">');
    });
});
