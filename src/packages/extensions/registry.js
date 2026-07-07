const registry = {};
export function registerExtension(id, render) {
    registry[id] = render;
}
export function renderExtension(id) {
    const fn = registry[id];
    return fn ? fn() : null;
}
export function hasExtension(id) {
    return Boolean(registry[id]);
}
