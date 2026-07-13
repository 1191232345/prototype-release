import { renderChangelogPageHtml } from '@prototype/runtime/changelog';
export function openChangelogDocInNewTab(title, markdown) {
    const html = renderChangelogPageHtml(title, markdown);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}
