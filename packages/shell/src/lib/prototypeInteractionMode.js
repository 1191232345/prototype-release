const STORAGE_KEY = 'prototype-archive-interaction-mode';
export function loadInteractionMode() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === 'review')
            return 'review';
        return 'dynamic';
    }
    catch {
        return 'dynamic';
    }
}
export function saveInteractionMode(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
}
export const INTERACTION_MODE_OPTIONS = [
    { value: 'dynamic', label: '动态交互', icon: 'fa-hand-pointer' },
    { value: 'review', label: '对照交互', icon: 'fa-crosshairs' },
];
