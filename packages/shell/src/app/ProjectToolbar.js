import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { copyText } from '../lib/utils';
import { openChangelogDocInNewTab } from '../lib/openChangelogDoc';
import { openRequirementsDocInNewTab } from '../lib/openRequirementsDoc';
import { isLocalPendingDraft } from '../lib/projectStore';
import { FaIcon } from '@prototype/ui/Icon';
export function ProjectToolbar({ project, immersive = false, onMenuClick, }) {
    if (!project) {
        return (_jsx("header", { className: "shrink-0 bg-white border-b border-border-light relative z-30", children: _jsxs("div", { className: "min-h-10 flex items-center gap-2 px-3 sm:px-5 py-2", children: [_jsx("button", { type: "button", className: `toolbar-icon-btn shrink-0 ${immersive ? '' : 'lg:hidden'}`, title: "\u6253\u5F00\u9879\u76EE\u5217\u8868", onClick: onMenuClick, children: _jsx(FaIcon, { className: "fas fa-bars" }) }), _jsx("p", { className: "text-sm text-text-muted", children: "\u2190 \u9009\u62E9\u9879\u76EE\u5F00\u59CB\u9884\u89C8" })] }) }));
    }
    const isPendingDraft = isLocalPendingDraft(project);
    const isPendingOnDisk = project.status === 'pending' && !project.prompt;
    const hasRequirements = Boolean(project.requirementsText?.trim());
    const hasChangelog = Boolean(project.changelogText?.trim());
    return (_jsx("header", { className: "shrink-0 bg-white border-b border-border-light relative z-30", children: _jsxs("div", { className: "px-3 sm:px-4 py-2 flex items-center gap-2", children: [_jsx("button", { type: "button", className: `toolbar-icon-btn shrink-0 -ml-1 ${immersive ? '' : 'lg:hidden'}`, title: "\u6253\u5F00\u9879\u76EE\u5217\u8868", onClick: onMenuClick, children: _jsx(FaIcon, { className: "fas fa-bars" }) }), _jsx("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: !isPendingDraft && !isPendingOnDisk ? (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm font-semibold text-dark truncate max-w-[120px] sm:max-w-[200px] shrink-0", children: project.meta.title }), _jsx("span", { className: "text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-muted text-text-muted shrink-0", children: project.meta.version })] })) : isPendingDraft ? (_jsxs("p", { className: "text-xs sm:text-sm text-amber-700 truncate flex-1", children: [_jsx(FaIcon, { className: "fas fa-hourglass-half mr-1 opacity-70" }), _jsx("span", { className: "hidden sm:inline", children: "\u5F85\u521B\u5EFA \u00B7 \u590D\u5236 Prompt \u540E\u5728 Cursor \u4E2D\u5B8C\u6210\u5F52\u6863" }), _jsx("span", { className: "sm:hidden", children: "\u5F85\u521B\u5EFA" })] })) : (_jsxs("p", { className: "text-xs sm:text-sm text-amber-700 truncate flex-1", children: [_jsx(FaIcon, { className: "fas fa-triangle-exclamation mr-1 opacity-70" }), _jsx("span", { className: "hidden sm:inline", children: "\u5F85\u5B8C\u5584 \u00B7 \u8865\u5168 Spec \u540E\u53EF\u53D1\u5E03\u9884\u89C8" }), _jsx("span", { className: "sm:hidden", children: "\u5F85\u5B8C\u5584" })] })) }), isPendingDraft ? (_jsx(PendingDraftActions, { project: project })) : (_jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [hasRequirements && (_jsxs("button", { type: "button", className: "btn btn-secondary py-1.5 px-2.5 text-sm gap-1.5", onClick: () => openRequirementsDocInNewTab(`需求文档 - ${project.meta.title}`, project.requirementsText, {
                                title: project.meta.title,
                                version: project.meta.version,
                                author: project.meta.author,
                                createdAt: project.meta.createdAt,
                                status: project.meta.status,
                                changeSummary: project.meta.changeSummary,
                            }), children: [_jsx(FaIcon, { className: "fas fa-file-alt" }), _jsx("span", { children: "\u9700\u6C42\u6587\u6863" })] })), hasChangelog && (_jsxs("button", { type: "button", className: "btn btn-secondary py-1.5 px-2.5 text-sm gap-1.5", onClick: () => openChangelogDocInNewTab(`变更记录 - ${project.meta.title}`, project.changelogText), children: [_jsx(FaIcon, { className: "fas fa-history" }), _jsx("span", { children: "\u53D8\u66F4\u8BB0\u5F55" })] }))] }))] }) }));
}
function PendingDraftActions({ project }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        if (!project.prompt)
            return;
        setCopied(await copyText(project.prompt));
        setTimeout(() => setCopied(false), 2000);
    };
    return (_jsx("div", { className: "flex items-center gap-1 shrink-0", children: _jsxs("button", { type: "button", className: "btn btn-primary py-1.5 px-2.5 sm:px-3 text-sm", onClick: handleCopy, children: [_jsx(FaIcon, { className: "fas fa-copy sm:mr-1.5" }), _jsx("span", { className: "hidden sm:inline", children: copied ? '已复制' : '复制启动 Prompt' })] }) }));
}
