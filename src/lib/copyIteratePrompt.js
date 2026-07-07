import { generateIterateProjectPrompt } from './generateIterateProjectPrompt';
import { copyText } from './utils';
export function buildIteratePrompt(project) {
    return generateIterateProjectPrompt({
        name: project.meta.title,
        slug: project.project,
        version: project.version,
        projectKey: project.key,
        flow: project.flow,
    });
}
export async function copyIteratePrompt(project) {
    return copyText(buildIteratePrompt(project));
}
