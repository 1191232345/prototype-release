const STROKE = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
    bullseye: `<circle cx="12" cy="12" r="10" ${STROKE}/><circle cx="12" cy="12" r="6" ${STROKE}/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>`,
    'diagram-project': `<path d="M3 7h7V3H3v4zm11 0h7V3h-7v4zM3 21h7v-4H3v4zm11 0h7v-4h-7v4z" ${STROKE}/>`,
    'list-check': `<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12l2 2 4-4M4 18h.01" ${STROKE}/>`,
    'user-shield': `<path d="M12 3l7 3v5c0 4.4-2.9 7.7-7 9-4.1-1.3-7-4.6-7-9V6l7-3z" ${STROKE}/><circle cx="12" cy="11" r="2" ${STROKE}/>`,
    flag: `<path d="M5 4v16M5 4h12l-2 3 2 3H5" ${STROKE}/>`,
    'clipboard-check': `<path d="M9 5h6a2 2 0 0 1 2 2v12H7V7a2 2 0 0 1 2-2z" ${STROKE}/><path d="M9 3h6v4H9zM9 14l2 2 4-4" ${STROKE}/>`,
    'circle-question': `<circle cx="12" cy="12" r="10" ${STROKE}/><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.2 1.2-1.2 2.2M12 17h.01" ${STROKE}/>`,
    book: `<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2z" ${STROKE}/><path d="M7 20h13" ${STROKE}/>`,
    history: `<path d="M3 12a9 9 0 1 0 3-6.7" ${STROKE}/><path d="M3 4v5h5M12 8v4l3 2" ${STROKE}/>`,
    'file-lines': `<path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" ${STROKE}/><path d="M14 3v5h5M8 13h8M8 17h8" ${STROKE}/>`,
    'triangle-exclamation': `<path d="M12 3l10 18H2L12 3z" ${STROKE}/><path d="M12 10v4M12 18h.01" ${STROKE}/>`,
    'calendar-check': `<rect x="3" y="5" width="18" height="16" rx="2" ${STROKE}/><path d="M8 3v4M16 3v4M3 10h18M9 15l2 2 4-4" ${STROKE}/>`,
    'arrows-rotate': `<path d="M21 12a9 9 0 0 0-15-6.7L3 8" ${STROKE}/><path d="M3 3v5h5M3 12a9 9 0 0 0 15 6.7L21 16" ${STROKE}/><path d="M21 21v-5h-5" ${STROKE}/>`,
    bars: `<path d="M4 7h16M4 12h16M4 17h16" ${STROKE}/>`,
    clock: `<circle cx="12" cy="12" r="9" ${STROKE}/><path d="M12 7v5l3 2" ${STROKE}/>`,
    'hourglass-half': `<path d="M6 3h12v3a6 6 0 0 1-4 5.7V15a6 6 0 0 1 4 5.3V21H6v-3a6 6 0 0 1 4-5.3v-3.3A6 6 0 0 1 6 6V3z" ${STROKE}/>`,
    'arrow-up': `<path d="M12 19V5M5 12l7-7 7 7" ${STROKE}/>`,
    'circle-check': `<circle cx="12" cy="12" r="10" ${STROKE}/><path d="M8 12l3 3 5-6" ${STROKE}/>`,
    check: `<path d="M5 12l4 4L19 6" ${STROKE}/>`,
    minus: `<path d="M5 12h14" ${STROKE}/>`,
    'clock-rotate-left': `<path d="M3 12a9 9 0 1 0 2.8 6.5" ${STROKE}/><path d="M3 12H1m2 0l2-2m9 2a4 4 0 1 0-1-7.5" ${STROKE}/>`,
    lightbulb: `<path d="M9 18h6M10 22h4M8 10a4 4 0 1 1 8 0c0 2-2 2.5-2 4H10c0-1.5-2-2-2-4z" ${STROKE}/>`,
};
export function reqIcon(name, className = 'req-icon') {
    const inner = ICONS[name] ?? ICONS['file-lines'];
    return `<svg class="${className}" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">${inner}</svg>`;
}
