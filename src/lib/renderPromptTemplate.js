export function renderPromptTemplate(template, vars) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}
export function todayIsoDate() {
    return new Date().toISOString().slice(0, 10);
}
