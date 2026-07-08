import { renderPromptTemplate, todayIsoDate } from './renderPromptTemplate';
export const REQUIREMENTS_CONFIRM_PHRASE = '需求理解正确，继续细化';
export const CREATE_CONFIRM_PHRASE = '理解正确，继续创建';
export const ITERATE_CONFIRM_PHRASE = '理解正确，继续迭代';
export function buildTemplateVars(input) {
    const platform = input.platform ?? 'pc';
    return {
        NAME: input.name,
        SLUG: input.slug,
        VERSION: input.version,
        PROJECT_KEY: input.projectKey,
        DIR: `prototypes/${input.slug}/${input.version}`,
        TODAY: todayIsoDate(),
        REQUIREMENTS_CONFIRM_PHRASE,
        CREATE_CONFIRM_PHRASE,
        ITERATE_CONFIRM_PHRASE,
        REFERENCE_PROJECT: platform === 'mobile' ? 'sku-信息填充-pda/v1' : 'rule-config/v1',
    };
}
export function renderCreatePromptFromRaw(template, input) {
    return renderPromptTemplate(template, buildTemplateVars(input));
}
export function renderIteratePromptFromRaw(template, input) {
    return renderPromptTemplate(template, buildTemplateVars(input));
}
