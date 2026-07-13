import { renderRequirementsPageHtml } from '@prototype/runtime/requirementsPage';
import requirementsCss from '../../../runtime/src/renderer/styles/requirements-doc.css?raw';
export function openRequirementsDocInNewTab(title, markdown, meta) {
    const html = renderRequirementsPageHtml({
        markdown,
        meta,
        pageTitle: title,
        cssText: requirementsCss,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}
