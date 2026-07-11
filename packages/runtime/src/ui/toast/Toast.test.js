import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toast } from './Toast';
describe('Toast', () => {
    it('renders message text', () => {
        render(_jsx(Toast, { message: "\u64CD\u4F5C\u6210\u529F" }));
        expect(screen.getByText('操作成功')).toBeInTheDocument();
    });
});
