import { buildIteratePromptClipboard } from './generateProjectPrompt';
import { copyText } from './utils';
export { ITERATE_CONFIRM_PHRASE } from './projectPromptContent';
export async function copyIteratePrompt(project) {
    const launcher = buildIteratePromptClipboard({
        name: project.meta.title,
        slug: project.project,
        version: project.version,
        projectKey: project.key,
    });
    return copyText(launcher);
}
