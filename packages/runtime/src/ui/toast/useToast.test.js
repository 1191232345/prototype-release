import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useToast } from './useToast';
describe('useToast', () => {
    beforeEach(() => {
        vi.useRealTimers();
    });
    it('shows and clears toast message', () => {
        vi.useFakeTimers();
        const { result } = renderHook(() => useToast(1000));
        act(() => {
            result.current.showToast('已保存');
        });
        expect(result.current.toastMessage).toBe('已保存');
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.toastMessage).toBeNull();
    });
    it('clearToast removes message immediately', () => {
        const { result } = renderHook(() => useToast());
        act(() => {
            result.current.showToast('提示');
            result.current.clearToast();
        });
        expect(result.current.toastMessage).toBeNull();
    });
});
