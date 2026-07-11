import { useCallback, useEffect, useState } from 'react';
const STORAGE_KEY = 'prototype-archive-split-doc-width';
const STORAGE_KEY_OPEN = 'prototype-archive-split-doc-open';
const DEFAULT_WIDTH = 400;
const MIN_WIDTH = 280;
const MAX_RATIO = 0.52;
function loadWidth() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return DEFAULT_WIDTH;
        const n = Number(raw);
        return Number.isFinite(n) ? n : DEFAULT_WIDTH;
    }
    catch {
        return DEFAULT_WIDTH;
    }
}
function loadOpen() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_OPEN);
        if (raw === '1')
            return true;
        return false;
    }
    catch {
        return false;
    }
}
function saveOpen(open) {
    localStorage.setItem(STORAGE_KEY_OPEN, open ? '1' : '0');
}
function saveWidth(width) {
    localStorage.setItem(STORAGE_KEY, String(Math.round(width)));
}
function clampWidth(width, containerWidth) {
    const max = Math.max(MIN_WIDTH, containerWidth * MAX_RATIO);
    return Math.min(Math.max(width, MIN_WIDTH), max);
}
export function useSplitDocPanel(containerRef, side = 'right') {
    const [docWidth, setDocWidthState] = useState(loadWidth);
    const [docOpen, setDocOpenState] = useState(loadOpen);
    const setDocOpen = useCallback((open) => {
        setDocOpenState(open);
        saveOpen(open);
    }, []);
    const toggleDocOpen = useCallback(() => {
        setDocOpenState((prev) => {
            const next = !prev;
            saveOpen(next);
            return next;
        });
    }, []);
    const setWidth = useCallback((width) => {
        const container = containerRef.current?.clientWidth ?? window.innerWidth;
        const clamped = clampWidth(width, container);
        setDocWidthState(clamped);
        saveWidth(clamped);
    }, [containerRef]);
    const startResize = useCallback((_clientX) => {
        const container = containerRef.current;
        if (!container)
            return;
        const rect = container.getBoundingClientRect();
        const onMove = (e) => {
            const width = side === 'left' ? e.clientX - rect.left : rect.right - e.clientX;
            setWidth(width);
        };
        const onUp = () => {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    }, [containerRef, setWidth, side]);
    useEffect(() => {
        const onResize = () => setWidth(docWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [docWidth, setWidth]);
    return { docWidth, docOpen, setDocOpen, toggleDocOpen, startResize };
}
