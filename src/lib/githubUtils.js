export function deriveGithubPagesBaseUrl(repoUrl) {
    let text = (repoUrl || '').trim().replace(/\/+$/, '');
    if (text.endsWith('.git'))
        text = text.slice(0, -4);
    if (!text)
        return '';
    const gitee = text.match(/gitee\.com[/:]([^/]+)\/([^/]+)$/i);
    if (gitee) {
        return `https://${gitee[1]}.gitee.io/${gitee[2]}/`;
    }
    const github = text.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
    if (!github)
        return '';
    const owner = github[1];
    const repo = github[2];
    if (repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
        return `https://${owner}.github.io/`;
    }
    return `https://${owner}.github.io/${repo}/`;
}
