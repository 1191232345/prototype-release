export function parseGithubRepo(repoUrl) {
    let text = (repoUrl || '').trim().replace(/\/+$/, '');
    if (text.endsWith('.git'))
        text = text.slice(0, -4);
    const match = text.match(/github\.com[/:]([^/]+)\/([^/]+)$/i);
    if (!match)
        throw new Error('无法从 GitHub 仓库地址解析 owner/repo');
    return [match[1], match[2]];
}
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
    try {
        const [owner, repo] = parseGithubRepo(text);
        if (repo.toLowerCase() === `${owner.toLowerCase()}.github.io`) {
            return `https://${owner}.github.io/`;
        }
        return `https://${owner}.github.io/${repo}/`;
    }
    catch {
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
}
export function githubPublishMissing(data) {
    const missing = [];
    const repo = String(data.githubRepoUrl || '').trim();
    const token = String(data.githubAccessToken || '').trim();
    let pages = String(data.githubPagesBaseUrl || '').trim();
    if (!pages && repo)
        pages = deriveGithubPagesBaseUrl(repo);
    if (!repo)
        missing.push('仓库地址');
    if (!token)
        missing.push('Personal Access Token');
    if (!pages)
        missing.push('Pages 预览前缀');
    return missing;
}
