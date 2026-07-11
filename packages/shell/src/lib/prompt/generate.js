import { CREATE_CONFIRM_PHRASE, ITERATE_CONFIRM_PHRASE, REQUIREMENTS_CONFIRM_PHRASE, } from './content';
import { buildCreatePromptLauncher, buildIteratePromptLauncher } from './launchers';
import { countLines } from '../utils';
export { REQUIREMENTS_CONFIRM_PHRASE, CREATE_CONFIRM_PHRASE, ITERATE_CONFIRM_PHRASE };
function toVars(input, platform) {
    const version = input.version ?? 'v1';
    return {
        name: input.name,
        slug: input.slug,
        version,
        projectKey: `${input.slug}/${version}`,
        platform,
    };
}
export function buildCreatePromptClipboard(input, platform = 'pc') {
    return buildCreatePromptLauncher({ ...toVars(input, platform) });
}
export function buildIteratePromptClipboard(input) {
    return buildIteratePromptLauncher(input);
}
export function getCreateLauncherLineCount(input, platform = 'pc') {
    return countLines(buildCreatePromptClipboard(input, platform));
}
export function generateProjectPrompt(input, platform = 'pc') {
    return buildCreatePromptClipboard(input, platform);
}
export function getPromptLineCount(input, platform = 'pc') {
    return getCreateLauncherLineCount(input, platform);
}
