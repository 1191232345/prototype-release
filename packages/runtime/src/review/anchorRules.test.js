import { describe, expect, it } from 'vitest';
import { resolveReviewAnchor } from './anchorRules';
describe('resolveReviewAnchor task alias', () => {
    it('将 task review-id 映射到 form 锚点', () => {
        expect(resolveReviewAnchor('task.info.退回原因').anchorId).toBe('form.init');
        expect(resolveReviewAnchor('task.sku.SKU001.weight').anchorId).toBe('form.fields');
        expect(resolveReviewAnchor('task.instruction.sheet').anchorId).toBe('form.interaction');
        expect(resolveReviewAnchor('task.btn.submit').anchorId).toBe('form.main-buttons');
        expect(resolveReviewAnchor('task.title').anchorId).toBe('form.init');
    });
});
