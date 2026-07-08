import { buildIteratePromptClipboard } from './generateProjectPrompt';
export { ITERATE_CONFIRM_PHRASE } from './projectPromptContent';
export function generateIterateProjectPrompt(input) {
    return buildIteratePromptClipboard({
        name: input.name,
        slug: input.slug,
        version: input.version,
        projectKey: input.projectKey,
    });
}
