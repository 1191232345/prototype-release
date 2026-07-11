export function sanitizeProjectFolder(name) {
    return (name
        .trim()
        .replace(/[/\\:*?"<>|]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'new-project');
}
export function slugify(name) {
    return sanitizeProjectFolder(name);
}
export function validateProjectName(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return { ok: false, error: '请填写项目名称' };
    }
    if (/[/\\:*?"<>|]/.test(trimmed)) {
        return { ok: false, error: '项目名称不能包含 / \\ : * ? " < > | 等字符' };
    }
    return { ok: true, name: trimmed };
}
export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    }
    catch {
        return false;
    }
}
export function countLines(text) {
    return text.split('\n').length;
}
export function openDocInNewTab(title, markdown) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 840px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; line-height: 1.7; }
  h1 { font-size: 1.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
  h2 { font-size: 1.25rem; margin-top: 2em; }
  h3 { font-size: 1.1rem; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 0.875rem; }
  th, td { border: 1px solid #e5e7eb; padding: 6px 10px; text-align: left; }
  th { background: #f9fafb; font-weight: 600; }
  code { background: #f3f4f6; padding: 1px 5px; border-radius: 3px; font-size: 0.85em; }
  pre { background: #f3f4f6; padding: 12px; border-radius: 6px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  ul, ol { padding-left: 1.5em; }
  li { margin: 4px 0; }
  a { color: #2563eb; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
</style>
</head>
<body>
${renderMarkdownToHtml(markdown)}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}
function renderMarkdownToHtml(md) {
    let html = escapeHtml(md);
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_match, header, _sep, body) => {
        const ths = header.split('|').filter((c) => c.trim()).map((c) => `<th>${c.trim()}</th>`).join('');
        const rows = body.trim().split('\n').map((row) => {
            const tds = row.split('|').filter((c) => c.trim()).map((c) => `<td>${c.trim()}</td>`).join('');
            return `<tr>${tds}</tr>`;
        }).join('');
        return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
    });
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/\n{2,}/g, '</p><p>');
    html = `<p>${html}</p>`;
    html = html.replace(/<p>\s*(<h[1-3]|<ul|<ol|<table|<pre|<hr)/g, '$1');
    html = html.replace(/(<\/h[1-3]>|<\/ul>|<\/ol>|<\/table>|<\/pre>|<hr>)\s*<\/p>/g, '$1');
    html = html.replace(/<p>\s*<\/p>/g, '');
    return html;
}
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
