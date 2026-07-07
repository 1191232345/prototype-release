import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { getProjectStatus, matchProjectSearch } from '../lib/projectStore';
import { PLATFORM_ICONS, PLATFORM_LABELS, getProjectPlatform, groupProjectsByPlatform, } from '../lib/projectPlatform';
import { PROJECT_STATUS_LABELS } from '../lib/projectStatus';
import { FaIcon } from '@prototype/ui/Icon';
const PLATFORM_ORDER = ['pc', 'mobile'];
const DEFAULT_SECTION_EXPANDED = {
    pc: true,
    mobile: false,
};
const SIDEBAR_SECTIONS_KEY = 'prototype-archive-sidebar-sections';
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
export function Sidebar({ projects, selectedKey, search, open, overlay = false, onSearchChange, onSelect, onCreateClick, onSettingsClick, onRefresh, onClose, }) {
    const filtered = useMemo(() => projects.filter((p) => matchProjectSearch(p, search)), [projects, search]);
    const grouped = useMemo(() => groupProjectsByPlatform(filtered), [filtered]);
    const pendingCount = projects.filter((p) => p.status === 'pending').length;
    const isEmpty = filtered.length === 0;
    const [sectionExpanded, setSectionExpanded] = useState(loadSectionExpanded);
    const toggleSection = (platform) => {
        setSectionExpanded((prev) => {
            const next = { ...prev, [platform]: !prev[platform] };
            localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
            return next;
        });
    };
    useEffect(() => {
        if (!selectedKey)
            return;
        const selected = projects.find((p) => p.key === selectedKey);
        if (!selected)
            return;
        const platform = getProjectPlatform(selected);
        setSectionExpanded((prev) => {
            if (prev[platform])
                return prev;
            const next = { ...prev, [platform]: true };
            localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(next));
            return next;
        });
    }, [selectedKey, projects]);
    const effectiveExpanded = useMemo(() => {
        if (!search.trim())
            return sectionExpanded;
        return {
            pc: grouped.pc.length > 0 ? true : sectionExpanded.pc,
            mobile: grouped.mobile.length > 0 ? true : sectionExpanded.mobile,
        };
    }, [search, sectionExpanded, grouped]);
    return (_jsxs(_Fragment, { children: [open && (_jsx("button", { type: "button", className: `fixed inset-0 z-40 bg-dark/40 ${overlay ? '' : 'lg:hidden'}`, "aria-label": "\u5173\u95ED\u4FA7\u8FB9\u680F", onClick: onClose })), _jsxs("aside", { className: `
          fixed inset-y-0 left-0 z-50
          w-[min(320px,88vw)] lg:w-[300px] xl:w-[320px]
          shrink-0 bg-white border-r border-border flex flex-col h-full
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${overlay ? '' : 'lg:static lg:translate-x-0'}
        `, children: [_jsxs("div", { className: "px-4 pt-4 pb-3 lg:pt-5 lg:pb-4 shrink-0 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 lg:mb-4", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h1", { className: "text-[15px] font-bold text-primary tracking-tight", children: "\u539F\u578B\u5F52\u6863" }), _jsx("p", { className: "text-[11px] text-text-muted mt-0.5 hidden sm:block", children: "Prototype Archive" })] }), _jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [_jsx("button", { type: "button", className: "sidebar-icon-btn", title: "\u53D1\u5E03\u8BBE\u7F6E", onClick: onSettingsClick, children: _jsx(FaIcon, { className: "fas fa-cog" }) }), _jsx("button", { type: "button", className: "sidebar-icon-btn", title: "\u5237\u65B0\u5217\u8868", onClick: onRefresh, children: _jsx(FaIcon, { className: "fas fa-sync-alt" }) }), _jsx("button", { type: "button", className: `sidebar-icon-btn ${overlay ? '' : 'lg:hidden'}`, title: "\u5173\u95ED", onClick: onClose, children: _jsx(FaIcon, { className: "fas fa-times" }) })] })] }), _jsxs("div", { className: "relative", children: [_jsx(FaIcon, { className: "fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none z-[1]", "aria-hidden": true }), _jsx("input", { className: "form-input sidebar-search-input", placeholder: "\u641C\u7D22\u9879\u76EE...", value: search, onChange: (e) => onSearchChange(e.target.value) })] })] }), _jsx("nav", { className: "flex-1 overflow-y-auto min-h-0 px-3 py-3", children: isEmpty ? (_jsxs("div", { className: "text-center py-12 px-4", children: [_jsx("div", { className: "w-10 h-10 mx-auto mb-3 rounded-xl bg-surface flex items-center justify-center", children: _jsx(FaIcon, { className: "fas fa-folder-open text-text-muted" }) }), _jsx("p", { className: "text-sm text-text-secondary font-medium", children: search ? '无匹配项目' : '暂无项目' }), _jsx("p", { className: "text-xs text-text-muted mt-1", children: search ? '尝试调整搜索关键词' : '在下方分区点击 + 创建项目' })] })) : (_jsx("div", { className: "space-y-4", children: PLATFORM_ORDER.map((platform) => (_jsx(PlatformSection, { platform: platform, items: grouped[platform], selectedKey: selectedKey, expanded: effectiveExpanded[platform], onToggle: () => toggleSection(platform), onSelect: onSelect, onCreateClick: () => onCreateClick(platform), hideWhenEmpty: Boolean(search.trim()) }, platform))) })) }), _jsxs("div", { className: "shrink-0 px-4 py-3 border-t border-border-light flex items-center justify-between text-[11px] text-text-muted", children: [_jsxs("span", { children: [filtered.length, " / ", projects.length, " \u9879\u76EE"] }), pendingCount > 0 && (_jsxs("span", { className: "flex items-center gap-1 text-amber-700", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" }), pendingCount, " \u5F85\u521B\u5EFA"] }))] })] })] }));
}
function PlatformSection({ platform, items, selectedKey, expanded, onToggle, onSelect, onCreateClick, hideWhenEmpty, }) {
    if (hideWhenEmpty && items.length === 0)
        return null;
    const sectionId = `sidebar-section-${platform}`;
    return (_jsxs("section", { className: "sidebar-platform-section", children: [_jsxs("div", { className: "sidebar-platform-header", children: [_jsxs("button", { type: "button", className: "sidebar-platform-toggle", "aria-expanded": expanded, "aria-controls": sectionId, onClick: onToggle, children: [_jsx(FaIcon, { className: `fas fa-chevron-${expanded ? 'down' : 'right'} text-[9px] text-text-muted shrink-0` }), _jsxs("span", { className: `sidebar-platform-label sidebar-platform-label--${platform}`, children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]} text-[10px]` }), PLATFORM_LABELS[platform], _jsx("span", { className: "sidebar-platform-count", children: items.length })] })] }), _jsx("button", { type: "button", className: "sidebar-platform-add", title: `新增${PLATFORM_LABELS[platform]}项目`, onClick: (e) => {
                            e.stopPropagation();
                            onCreateClick();
                        }, children: _jsx(FaIcon, { className: "fas fa-plus text-[10px]" }) })] }), expanded ? (_jsx("div", { id: sectionId, children: items.length === 0 ? (_jsx("p", { className: "text-[11px] text-text-muted px-2 py-2", children: "\u6682\u65E0\u9879\u76EE\uFF0C\u70B9\u51FB + \u521B\u5EFA" })) : (_jsx("ul", { className: "space-y-1", children: items.map((item) => (_jsx(ProjectListItem, { item: item, platform: platform, selected: selectedKey === item.key, onSelect: () => onSelect(item.key) }, item.key))) })) })) : null] }));
}
function ProjectListItem({ item, platform, selected, onSelect, }) {
    const isPending = item.status === 'pending';
    const errCount = item.specErrors.length + item.metaErrors.length;
    const status = getProjectStatus(item);
    const statusLabel = isPending ? '待创建' : PROJECT_STATUS_LABELS[status];
    const statusStyle = isPending
        ? 'bg-amber-100/80 text-amber-800'
        : errCount > 0
            ? 'bg-red-100/80 text-red-700'
            : status === 'approved'
                ? 'bg-emerald-100/80 text-emerald-700'
                : status === 'review'
                    ? 'bg-sky-100/80 text-sky-700'
                    : 'bg-stone-100/80 text-stone-600';
    return (_jsx("li", { children: _jsxs("button", { type: "button", onClick: onSelect, className: `sidebar-item group ${selected ? 'selected' : ''}`, children: [_jsxs("div", { className: "flex items-start justify-between gap-2 min-w-0", children: [_jsx("span", { className: `text-sm truncate flex-1 leading-snug ${selected ? 'font-semibold' : 'font-medium text-dark'}`, children: item.meta.title }), _jsx("span", { className: `shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${selected ? 'bg-white/20 text-white' : statusStyle}`, children: errCount > 0 && !isPending ? `${errCount}错` : statusLabel })] }), _jsxs("p", { className: `text-[11px] mt-1 truncate flex items-center gap-1.5 ${selected ? 'text-white/60' : 'text-text-muted'}`, children: [_jsx(FaIcon, { className: `fas ${PLATFORM_ICONS[platform]} text-[9px] opacity-70` }), item.key] })] }) }));
}
