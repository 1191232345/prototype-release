import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { getProjectStatus, isLocalPendingDraft, matchProjectSearch, toggleFavorite } from '../lib/projectStore';
import { PLATFORM_ICONS, PLATFORM_LABELS, getProjectPlatform, groupProjectsByPlatform, } from '../lib/projectPlatform';
import { PROJECT_STATUS_LABELS } from '../lib/projectStatus';
import { FaIcon } from '@prototype/ui/Icon';
const SIDEBAR_SECTIONS_KEY = 'prototype-archive-sidebar-sections';
const SIDEBAR_GROUP_KEY = 'prototype-archive-sidebar-group';
const SIDEBAR_SORT_KEY = 'prototype-archive-sidebar-sort';
const SIDEBAR_TAG_FILTER_KEY = 'prototype-archive-sidebar-tag-filter';
const PLATFORM_ORDER = ['pc', 'mobile'];
const DEFAULT_SECTION_EXPANDED = {
    pc: true,
    mobile: false,
};
function loadSectionExpanded() {
    try {
        const raw = localStorage.getItem(SIDEBAR_SECTIONS_KEY);
        if (!raw)
            return { ...DEFAULT_SECTION_EXPANDED };
        const parsed = JSON.parse(raw);
        return {
            pc: parsed.pc ?? DEFAULT_SECTION_EXPANDED.pc,
            mobile: parsed.mobile ?? DEFAULT_SECTION_EXPANDED.mobile,
        };
    }
    catch {
        return { ...DEFAULT_SECTION_EXPANDED };
    }
}
function loadGroupMode() {
    const raw = localStorage.getItem(SIDEBAR_GROUP_KEY);
    return raw === 'tag' ? 'tag' : 'platform';
}
function loadSortMode() {
    const raw = localStorage.getItem(SIDEBAR_SORT_KEY);
    if (raw === 'recent' || raw === 'favorite-first')
        return raw;
    return 'default';
}
function loadTagFilter() {
    try {
        const raw = localStorage.getItem(SIDEBAR_TAG_FILTER_KEY);
        if (!raw)
            return new Set();
        return new Set(JSON.parse(raw));
    }
    catch {
        return new Set();
    }
}
function saveTagFilter(set) {
    localStorage.setItem(SIDEBAR_TAG_FILTER_KEY, JSON.stringify([...set]));
}
export function Sidebar({ projects, selectedKey, search, open, overlay = false, onSearchChange, onSelect, onCreateClick, onSettingsClick, onRefresh, onClose, onLocalChange, onEditProject, onDeleteProject, }) {
    const [groupMode, setGroupMode] = useState(loadGroupMode);
    const [sortMode, setSortMode] = useState(loadSortMode);
    const [tagFilter, setTagFilter] = useState(loadTagFilter);
    const [sectionExpanded, setSectionExpanded] = useState(loadSectionExpanded);
    const [tagSectionsExpanded, setTagSectionsExpanded] = useState({});
    useEffect(() => {
        localStorage.setItem(SIDEBAR_GROUP_KEY, groupMode);
    }, [groupMode]);
    useEffect(() => {
        localStorage.setItem(SIDEBAR_SORT_KEY, sortMode);
    }, [sortMode]);
    useEffect(() => {
        saveTagFilter(tagFilter);
    }, [tagFilter]);
    const allTags = useMemo(() => {
        const set = new Set();
        projects.forEach((p) => p.tags?.forEach((t) => t.trim() && set.add(t.trim())));
        return [...set].sort((a, b) => a.localeCompare(b, 'zh-Hans'));
    }, [projects]);
    const filteredBySearch = useMemo(() => projects.filter((p) => matchProjectSearch(p, search)), [projects, search]);
    const filteredByTags = useMemo(() => {
        if (tagFilter.size === 0)
            return filteredBySearch;
        return filteredBySearch.filter((p) => p.tags?.some((t) => tagFilter.has(t)));
    }, [filteredBySearch, tagFilter]);
    const sorted = useMemo(() => {
        if (sortMode === 'default')
            return filteredByTags;
        const arr = [...filteredByTags];
        if (sortMode === 'recent') {
            arr.sort((a, b) => {
                const ta = a.lastOpenedAt ? Date.parse(a.lastOpenedAt) : 0;
                const tb = b.lastOpenedAt ? Date.parse(b.lastOpenedAt) : 0;
                return tb - ta;
            });
        }
        else if (sortMode === 'favorite-first') {
            arr.sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)));
        }
        return arr;
    }, [filteredByTags, sortMode]);
    const pendingCount = projects.filter((p) => p.status === 'pending').length;
    const noSearchResults = Boolean(search.trim()) && filteredBySearch.length === 0;
    const noTagResults = tagFilter.size > 0 && filteredByTags.length === 0;
    const handleFavoriteToggle = (item) => {
        toggleFavorite(item.key);
        onLocalChange?.();
    };
    const toggleTagFilter = (tag) => {
        setTagFilter((prev) => {
            const next = new Set(prev);
            if (next.has(tag))
                next.delete(tag);
            else
                next.add(tag);
            return next;
        });
    };
    const clearTagFilter = () => setTagFilter(new Set());
    const toggleSection = (platform) => {
        setSectionExpanded((prev) => {
            const next = { ...prev, [platform]: !prev[platform] };
            localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
            return next;
        });
    };
    const toggleTagSection = (tag) => {
        setTagSectionsExpanded((prev) => ({ ...prev, [tag]: !prev[tag] }));
    };
    useEffect(() => {
        if (!selectedKey)
            return;
        const selected = projects.find((p) => p.key === selectedKey);
        if (!selected)
            return;
        if (groupMode === 'platform') {
            const platform = getProjectPlatform(selected);
            setSectionExpanded((prev) => {
                if (prev[platform])
                    return prev;
                const next = { ...prev, [platform]: true };
                localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
                return next;
            });
        }
        else {
            const tags = selected.tags ?? [];
            if (tags.length > 0) {
                setTagSectionsExpanded((prev) => {
                    const next = { ...prev };
                    tags.forEach((t) => { if (!next[t])
                        next[t] = true; });
                    return next;
                });
            }
        }
    }, [selectedKey, projects, groupMode]);
    const effectiveSectionExpanded = useMemo(() => {
        if (!search.trim())
            return sectionExpanded;
        return {
            pc: true,
            mobile: true,
        };
    }, [search, sectionExpanded]);
    const effectiveTagExpanded = useMemo(() => {
        if (!search.trim())
            return tagSectionsExpanded;
        const all = {};
        allTags.forEach((t) => { all[t] = true; });
        return all;
    }, [search, tagSectionsExpanded, allTags]);
    return (_jsxs(_Fragment, { children: [open && (_jsx("button", { type: "button", className: `fixed inset-0 z-40 bg-dark/40 ${overlay ? '' : 'lg:hidden'}`, "aria-label": "\u5173\u95ED\u4FA7\u8FB9\u680F", onClick: onClose })), _jsxs("aside", { className: `
          fixed inset-y-0 left-0 z-50
          w-[min(320px,88vw)] lg:w-[300px] xl:w-[320px]
          shrink-0 bg-white border-r border-border flex flex-col h-full
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${overlay ? '' : 'lg:static lg:translate-x-0'}
        `, children: [_jsxs("div", { className: "px-4 pt-4 pb-3 lg:pt-5 lg:pb-4 shrink-0 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 lg:mb-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-[15px] font-bold text-primary tracking-tight", children: "\u539F\u578B\u5F52\u6863" }), _jsx("p", { className: "text-[11px] text-text-muted mt-0.5 hidden sm:block", children: "Prototype Archive" })] }), _jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [_jsx("button", { type: "button", className: "sidebar-icon-btn", title: "\u53D1\u5E03\u8BBE\u7F6E", onClick: onSettingsClick, children: _jsx(FaIcon, { className: "fas fa-cog" }) }), _jsx("button", { type: "button", className: "sidebar-icon-btn", title: "\u5237\u65B0\u5217\u8868", onClick: onRefresh, children: _jsx(FaIcon, { className: "fas fa-sync-alt" }) }), _jsx("button", { type: "button", className: `sidebar-icon-btn ${overlay ? '' : 'lg:hidden'}`, title: "\u5173\u95ED", onClick: onClose, children: _jsx(FaIcon, { className: "fas fa-times" }) })] })] }), _jsxs("div", { className: "relative flex items-center gap-1.5", children: [_jsxs("div", { className: "relative flex-1 min-w-0", children: [_jsx(FaIcon, { className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none z-[1]", "aria-hidden": true }), _jsx("input", { className: "form-input sidebar-search-input", placeholder: "\u641C\u7D22\u9879\u76EE\u540D\u79F0 / \u6807\u7B7E\u2026", value: search, onChange: (e) => onSearchChange(e.target.value) })] }), _jsx(FilterPopover, { groupMode: groupMode, sortMode: sortMode, allTags: allTags, tagFilter: tagFilter, onGroupChange: setGroupMode, onSortChange: setSortMode, onToggleTag: toggleTagFilter, onClearTags: clearTagFilter })] })] }), _jsx("nav", { className: "flex-1 overflow-y-auto min-h-0 px-3 py-3", children: noSearchResults ? (_jsxs("div", { className: "text-center py-12 px-4", children: [_jsx("div", { className: "w-10 h-10 mx-auto mb-3 rounded-xl bg-surface flex items-center justify-center", children: _jsx(FaIcon, { className: "fas fa-folder-open text-text-muted" }) }), _jsx("p", { className: "text-sm text-text-secondary font-medium", children: "\u65E0\u5339\u914D\u9879\u76EE" }), _jsx("p", { className: "text-xs text-text-muted mt-1", children: "\u5C1D\u8BD5\u8C03\u6574\u641C\u7D22\u5173\u952E\u8BCD" })] })) : noTagResults ? (_jsxs("div", { className: "text-center py-10 px-4", children: [_jsx(FaIcon, { className: "fas fa-tag text-text-muted text-lg mb-2" }), _jsx("p", { className: "text-sm text-text-secondary", children: "\u5F53\u524D\u6807\u7B7E\u4E0B\u65E0\u9879\u76EE" }), _jsx("button", { type: "button", onClick: clearTagFilter, className: "text-xs text-primary hover:underline mt-1", children: "\u6E05\u9664\u6807\u7B7E\u7B5B\u9009" })] })) : (_jsxs("div", { className: "space-y-4", children: [projects.length === 0 && (_jsx("p", { className: "text-xs text-text-muted text-center px-2 pb-1", children: "\u5728 PC / \u79FB\u52A8\u7AEF\u5206\u533A\u70B9\u51FB + \u521B\u5EFA\u9996\u4E2A\u9879\u76EE" })), groupMode === 'platform' ? (PLATFORM_ORDER.map((platform) => {
                                    const grouped = groupProjectsByPlatform(sorted);
                                    return (_jsx(PlatformSection, { platform: platform, items: grouped[platform], selectedKey: selectedKey, expanded: effectiveSectionExpanded[platform], onToggle: () => toggleSection(platform), onSelect: onSelect, onCreateClick: () => onCreateClick(platform), onFavoriteToggle: handleFavoriteToggle, onEditProject: onEditProject, onDeleteProject: onDeleteProject, hideWhenEmpty: Boolean(search.trim()) || tagFilter.size > 0 }, platform));
                                })) : (_jsx(TagGroupedSections, { items: sorted, selectedKey: selectedKey, expandedMap: effectiveTagExpanded, onToggle: toggleTagSection, onSelect: onSelect, onFavoriteToggle: handleFavoriteToggle, onEditProject: onEditProject, onDeleteProject: onDeleteProject }))] })) }), _jsxs("div", { className: "shrink-0 px-4 py-3 border-t border-border-light flex items-center justify-between text-[11px] text-text-muted", children: [_jsxs("span", { children: [sorted.length, " / ", projects.length, " \u9879\u76EE"] }), pendingCount > 0 && (_jsxs("span", { className: "flex items-center gap-1 text-amber-700", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" }), pendingCount, " \u5F85\u521B\u5EFA"] }))] })] })] }));
}
function FilterPopover({ groupMode, sortMode, allTags, tagFilter, onGroupChange, onSortChange, onToggleTag, onClearTags, }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const hasActiveFilter = tagFilter.size > 0 || groupMode !== 'platform' || sortMode !== 'default';
    useEffect(() => {
        if (!open)
            return;
        const close = (e) => {
            if (ref.current?.contains(e.target))
                return;
            setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);
    return (_jsxs("div", { className: "relative shrink-0", ref: ref, children: [_jsxs("button", { type: "button", className: `sidebar-filter-btn ${hasActiveFilter ? 'is-active' : ''}`, title: "\u7B5B\u9009", "aria-label": "\u7B5B\u9009", "aria-expanded": open, onClick: () => setOpen((v) => !v), children: [_jsx(FaIcon, { className: "fas fa-filter text-sm" }), hasActiveFilter && _jsx("span", { className: "sidebar-filter-btn-dot" })] }), open && (_jsxs("div", { className: "sidebar-filter-popover", children: [_jsxs("div", { className: "sidebar-filter-section", children: [_jsx("p", { className: "sidebar-filter-label", children: "\u5206\u7EC4" }), _jsx("div", { className: "flex gap-1.5", children: ['platform', 'tag'].map((m) => (_jsx("button", { type: "button", className: `sidebar-filter-chip ${groupMode === m ? 'is-active' : ''}`, onClick: () => onGroupChange(m), children: m === 'platform' ? '平台' : '标签' }, m))) })] }), _jsxs("div", { className: "sidebar-filter-section", children: [_jsx("p", { className: "sidebar-filter-label", children: "\u6392\u5E8F" }), _jsx("div", { className: "flex gap-1.5 flex-wrap", children: ([
                                    { v: 'default', l: '默认' },
                                    { v: 'recent', l: '最近' },
                                    { v: 'favorite-first', l: '收藏优先' },
                                ]).map((o) => (_jsx("button", { type: "button", className: `sidebar-filter-chip ${sortMode === o.v ? 'is-active' : ''}`, onClick: () => onSortChange(o.v), children: o.l }, o.v))) })] }), allTags.length > 0 && (_jsxs("div", { className: "sidebar-filter-section", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "sidebar-filter-label mb-0", children: "\u6807\u7B7E\u7B5B\u9009" }), tagFilter.size > 0 && (_jsx("button", { type: "button", className: "text-[10px] text-text-muted hover:text-danger transition-colors", onClick: onClearTags, children: "\u6E05\u9664" }))] }), _jsx("div", { className: "flex flex-wrap gap-1", children: allTags.map((tag) => {
                                    const active = tagFilter.has(tag);
                                    return (_jsx("button", { type: "button", className: `sidebar-filter-chip ${active ? 'is-active' : ''}`, onClick: () => onToggleTag(tag), children: tag }, tag));
                                }) })] }))] }))] }));
}
function PlatformSection({ platform, items, selectedKey, expanded, onToggle, onSelect, onCreateClick, onFavoriteToggle, onEditProject, onDeleteProject, hideWhenEmpty, }) {
    if (hideWhenEmpty && items.length === 0)
        return null;
    const sectionId = `sidebar-section-${platform}`;
    return (_jsxs("section", { className: "sidebar-platform-section", children: [_jsxs("div", { className: "sidebar-platform-header", children: [_jsxs("button", { type: "button", className: "sidebar-platform-toggle", "aria-expanded": expanded, "aria-controls": sectionId, onClick: onToggle, children: [_jsx(FaIcon, { className: `fas fa-chevron-${expanded ? 'down' : 'right'} text-[9px] text-text-muted shrink-0` }), _jsxs("span", { className: `sidebar-platform-label sidebar-platform-label--${platform}`, children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]} text-[10px]` }), PLATFORM_LABELS[platform], _jsx("span", { className: "sidebar-platform-count", children: items.length })] })] }), _jsx("button", { type: "button", className: "sidebar-platform-add", title: `新增${PLATFORM_LABELS[platform]}项目`, onClick: (e) => {
                            e.stopPropagation();
                            onCreateClick();
                        }, children: _jsx(FaIcon, { className: "fas fa-plus text-[10px]" }) })] }), expanded ? (_jsx("div", { id: sectionId, className: "sidebar-section-content", children: items.length === 0 ? (_jsx("p", { className: "text-[11px] text-text-muted px-2 py-2", children: "\u6682\u65E0\u9879\u76EE\uFF0C\u70B9\u51FB + \u521B\u5EFA" })) : (_jsx("ul", { className: "space-y-1", children: items.map((item) => (_jsx(ProjectListItem, { item: item, platform: platform, selected: selectedKey === item.key, onSelect: () => onSelect(item.key), onFavoriteToggle: () => onFavoriteToggle(item), onEdit: onEditProject ? () => onEditProject(item.key) : undefined, onDelete: onDeleteProject ? () => onDeleteProject(item.key) : undefined }, item.key))) })) })) : null] }));
}
function TagGroupedSections({ items, selectedKey, expandedMap, onToggle, onSelect, onFavoriteToggle, onEditProject, onDeleteProject, }) {
    const { taggedGroups, untagged, favoriteItems } = useMemo(() => {
        const groups = new Map();
        const untagged = [];
        const favoriteItems = [];
        items.forEach((item) => {
            if (item.favorite)
                favoriteItems.push(item);
            const tags = (item.tags ?? []).map((t) => t.trim()).filter(Boolean);
            if (tags.length === 0) {
                untagged.push(item);
            }
            else {
                tags.forEach((t) => {
                    if (!groups.has(t))
                        groups.set(t, []);
                    groups.get(t).push(item);
                });
            }
        });
        return {
            taggedGroups: [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans')),
            untagged,
            favoriteItems,
        };
    }, [items]);
    if (items.length === 0) {
        return _jsx("p", { className: "text-[11px] text-text-muted px-2 py-2", children: "\u6682\u65E0\u9879\u76EE" });
    }
    return (_jsxs("div", { className: "space-y-3", children: [favoriteItems.length > 0 && (_jsx(TagSection, { tag: "\u2605 \u6536\u85CF", accent: "favorite", items: favoriteItems, selectedKey: selectedKey, expanded: expandedMap['__favorite__'] ?? true, onToggle: () => onToggle('__favorite__'), onSelect: onSelect, onFavoriteToggle: onFavoriteToggle, onEditProject: onEditProject, onDeleteProject: onDeleteProject })), taggedGroups.map(([tag, groupItems]) => (_jsx(TagSection, { tag: tag, items: groupItems, selectedKey: selectedKey, expanded: expandedMap[tag] ?? false, onToggle: () => onToggle(tag), onSelect: onSelect, onFavoriteToggle: onFavoriteToggle, onEditProject: onEditProject, onDeleteProject: onDeleteProject }, tag))), untagged.length > 0 && (_jsx(TagSection, { tag: "\u672A\u5206\u7EC4", items: untagged, selectedKey: selectedKey, expanded: expandedMap['__untagged__'] ?? true, onToggle: () => onToggle('__untagged__'), onSelect: onSelect, onFavoriteToggle: onFavoriteToggle, onEditProject: onEditProject, onDeleteProject: onDeleteProject }))] }));
}
function TagSection({ tag, accent, items, selectedKey, expanded, onToggle, onSelect, onFavoriteToggle, onEditProject, onDeleteProject, }) {
    return (_jsxs("section", { className: "sidebar-platform-section", children: [_jsx("div", { className: "sidebar-platform-header", children: _jsxs("button", { type: "button", className: "sidebar-platform-toggle", "aria-expanded": expanded, onClick: onToggle, children: [_jsx(FaIcon, { className: `fas fa-chevron-${expanded ? 'down' : 'right'} text-[9px] text-text-muted shrink-0` }), _jsxs("span", { className: `sidebar-platform-label ${accent === 'favorite' ? 'sidebar-platform-label--favorite' : 'sidebar-platform-label--tag'}`, children: [_jsx(FaIcon, { className: `fas ${accent === 'favorite' ? 'fa-star' : 'fa-tag'} text-[10px]` }), tag, _jsx("span", { className: "sidebar-platform-count", children: items.length })] })] }) }), expanded ? (_jsx("div", { className: "sidebar-section-content", children: _jsx("ul", { className: "space-y-1", children: items.map((item) => (_jsx(ProjectListItem, { item: item, platform: getProjectPlatform(item), selected: selectedKey === item.key, onSelect: () => onSelect(item.key), onFavoriteToggle: () => onFavoriteToggle(item), onEdit: onEditProject ? () => onEditProject(item.key) : undefined, onDelete: onDeleteProject ? () => onDeleteProject(item.key) : undefined }, `${item.key}-${tag}`))) }) })) : null] }));
}
function ProjectListItem({ item, platform, selected, onSelect, onFavoriteToggle, onEdit, onDelete, }) {
    const isPendingDraft = isLocalPendingDraft(item);
    const isPendingOnDisk = item.status === 'pending' && !item.prompt;
    const errCount = item.specErrors.length + item.metaErrors.length;
    const status = getProjectStatus(item);
    const statusLabel = isPendingDraft
        ? '待创建'
        : isPendingOnDisk
            ? '待完善'
            : PROJECT_STATUS_LABELS[status];
    const statusVariant = isPendingDraft || isPendingOnDisk
        ? 'pending'
        : errCount > 0
            ? 'error'
            : status === 'review'
                ? 'pending'
                : 'normal';
    const tags = (item.tags ?? []).slice(0, 2);
    const moreTagsCount = (item.tags?.length ?? 0) - tags.length;
    return (_jsxs("li", { className: "group/sidebar-item relative", children: [_jsxs("button", { type: "button", onClick: onSelect, className: `sidebar-item group ${selected ? 'selected' : ''}`, children: [_jsx("span", { className: "sidebar-item-bar" }), _jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [_jsx("span", { className: `status-dot status-dot--${statusVariant}`, title: statusLabel }), _jsx("span", { className: `text-sm truncate flex-1 leading-snug ${selected ? 'font-semibold text-dark' : 'font-medium text-dark'}`, children: item.meta.title }), _jsx("span", { role: "button", tabIndex: 0, className: `sidebar-favorite-star ${item.favorite ? 'is-on' : ''}`, title: item.favorite ? '取消收藏' : '收藏置顶', "aria-label": item.favorite ? '取消收藏' : '收藏', onClick: (e) => {
                                    e.stopPropagation();
                                    onFavoriteToggle();
                                }, onKeyDown: (e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onFavoriteToggle();
                                    }
                                }, children: _jsx(FaIcon, { className: "fas fa-star text-[11px]" }) })] }), _jsxs("div", { className: "flex items-center gap-1.5 mt-1 min-w-0 pl-[18px]", children: [_jsxs("p", { className: "text-[11px] truncate flex items-center gap-1.5 text-text-muted", children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]} text-[9px] opacity-70` }), item.key] }), tags.length > 0 && (_jsxs("div", { className: "flex items-center gap-0.5 shrink-0 ml-auto", children: [tags.map((t) => (_jsx("span", { className: "text-[9px] px-1 py-0.5 rounded font-medium truncate max-w-[56px] bg-primary/8 text-primary/80", title: t, children: t }, t))), moreTagsCount > 0 && (_jsxs("span", { className: "text-[9px] text-text-muted", children: ["+", moreTagsCount] }))] }))] })] }), (onEdit || onDelete) && (_jsxs("div", { className: "absolute right-1.5 top-1.5 flex items-center gap-0.5 opacity-0 group-hover/sidebar-item:opacity-100 transition-opacity z-10", children: [onEdit && (_jsx("button", { type: "button", title: "\u7F16\u8F91\u4FE1\u606F", className: "w-6 h-6 rounded-md bg-white/90 backdrop-blur-sm border border-border-light flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm", onClick: (e) => {
                            e.stopPropagation();
                            onEdit();
                        }, children: _jsx(FaIcon, { className: "fas fa-pen text-[10px]" }) })), onDelete && (_jsx("button", { type: "button", title: "\u5220\u9664\u9879\u76EE", className: "w-6 h-6 rounded-md bg-white/90 backdrop-blur-sm border border-border-light flex items-center justify-center hover:bg-danger hover:text-white hover:border-danger transition-colors shadow-sm", onClick: (e) => {
                            e.stopPropagation();
                            onDelete();
                        }, children: _jsx(FaIcon, { className: "fas fa-trash text-[10px]" }) }))] }))] }));
}
