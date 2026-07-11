import { buildIteratePromptClipboard } from './generate';
import { copyText } from '../utils';
export { ITERATE_CONFIRM_PHRASE } from './content';
export async function copyIteratePrompt(project) {
    const launcher = buildIteratePromptClipboard({
        name: project.meta.title,
        slug: project.project,
        version: project.version,
        projectKey: project.key,
    });
    return copyText(launcher);
}
