import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { copyText } from '../lib/utils';
import { FaIcon } from '@prototype/ui/Icon';
export function ProjectToolbar({ project, immersive = false, publishConfigured = false, publishing = false, onMenuClick, onEdit, onDelete, onIterate, onPublish, }) {
    if (!project) {
        return (_jsx("header", { className: "shrink-0 bg-white border-b border-border-light relative z-30", children: _jsxs("div", { className: "min-h-10 flex items-center gap-2 px-3 sm:px-5 py-2", children: [_jsx("button", { type: "button", className: `toolbar-icon-btn shrink-0 ${immersive ? '' : 'lg:hidden'}`, title: "\u6253\u5F00\u9879\u76EE\u5217\u8868", onClick: onMenuClick, children: _jsx(FaIcon, { className: "fas fa-bars" }) }), _jsx("p", { className: "text-sm text-text-muted", children: "\u2190 \u9009\u62E9\u9879\u76EE\u5F00\u59CB\u9884\u89C8" })] }) }));
    }
    const isPending = project.status === 'pending';
    return (_jsx("header", { className: "shrink-0 bg-white border-b border-border-light relative z-30", children: _jsxs("div", { className: "px-3 sm:px-5 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3", children: [_jsxs("div", { className: "flex items-center gap-1 min-w-0 flex-1", children: [_jsx("button", { type: "button", className: `toolbar-icon-btn shrink-0 -ml-1 ${immersive ? '' : 'lg:hidden'}`, title: "\u6253\u5F00\u9879\u76EE\u5217\u8868", onClick: onMenuClick, children: _jsx(FaIcon, { className: "fas fa-bars" }) }), !isPending ? (_jsx("p", { className: "text-sm font-semibold text-dark truncate max-w-[120px] sm:max-w-[240px] mr-1 shrink-0 hidden lg:block", children: project.meta.title })) : (_jsxs("p", { className: "text-xs sm:text-sm text-amber-700 truncate flex-1", children: [_jsx(FaIcon, { className: "fas fa-hourglass-half mr-1 opacity-70" }), _jsx("span", { className: "hidden sm:inline", children: "\u5F85\u521B\u5EFA \u00B7 \u590D\u5236 Prompt \u540E\u5728 Cursor \u4E2D\u5B8C\u6210\u5F52\u6863" }), _jsx("span", { className: "sm:hidden", children: "\u5F85\u521B\u5EFA" })] }))] }), _jsx(ProjectActions, { project: project, isPending: isPending, publishConfigured: publishConfigured, publishing: publishing, onEdit: onEdit, onDelete: onDelete, onIterate: onIterate, onPublish: onPublish })] }) }));
}
function ProjectActions({ project, isPending, publishConfigured, publishing, onEdit, onDelete, onIterate, onPublish, }) {
    const [copied, setCopied] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef(null);
    useEffect(() => {
        if (!moreOpen)
            return;
        const close = (e) => {
            const target = e.target;
            if (moreRef.current?.contains(target))
                return;
            setMoreOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [moreOpen]);
    if (isPending) {
        const handleCopy = async () => {
            if (!project.prompt)
                return;
            setCopied(await copyText(project.prompt));
            setTimeout(() => setCopied(false), 2000);
        };
        return (_jsxs("div", { className: "flex items-center gap-1 shrink-0 self-end sm:self-auto", children: [_jsxs("button", { type: "button", className: "btn btn-primary py-1.5 px-2.5 sm:px-3 text-sm", onClick: handleCopy, children: [_jsx(FaIcon, { className: "fas fa-copy sm:mr-1.5" }), _jsx("span", { className: "hidden sm:inline", children: copied ? '已复制' : '复制启动 Prompt' })] }), _jsx(MoreMenu, { menuRef: moreRef, open: moreOpen, onToggle: () => setMoreOpen((v) => !v), items: [
                        { icon: 'fa-edit', label: '编辑信息', onClick: onEdit },
                        { icon: 'fa-trash', label: '删除项目', danger: true, onClick: onDelete },
                    ] })] }));
    }
    return (_jsxs("div", { className: "flex items-center gap-1 shrink-0 self-end sm:self-auto", children: [onPublish && (_jsxs("button", { type: "button", className: "btn btn-secondary py-1.5 px-2.5 sm:px-3 text-sm gap-1.5", disabled: !publishConfigured || publishing, title: publishConfigured
                    ? '查看或更新预览链接（内容未变更时不会重复上传）'
                    : '请先在侧边栏设置中配置远程服务器', onClick: onPublish, children: [_jsx(FaIcon, { className: `fas ${publishing ? 'fa-spinner fa-spin' : 'fa-link'}` }), _jsx("span", { className: "hidden sm:inline", children: publishing ? '加载中…' : '预览链接' })] })), _jsxs("button", { type: "button", className: "btn btn-primary py-1.5 px-2.5 sm:px-3 text-sm gap-1.5", onClick: onIterate, children: [_jsx(FaIcon, { className: "fas fa-code-branch" }), _jsx("span", { className: "hidden sm:inline", children: "\u8FED\u4EE3\u539F\u578B" })] }), _jsx(MoreMenu, { menuRef: moreRef, open: moreOpen, onToggle: () => setMoreOpen((v) => !v), items: [
                    { icon: 'fa-edit', label: '编辑信息', onClick: onEdit },
                    { icon: 'fa-trash', label: '删除项目', danger: true, onClick: onDelete },
                ] })] }));
}
const MoreMenu = ({ menuRef, open, onToggle, items, }) => (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsx("button", { type: "button", className: "toolbar-icon-btn", title: "\u66F4\u591A\u64CD\u4F5C", "aria-label": "\u66F4\u591A\u64CD\u4F5C", "aria-expanded": open, "aria-haspopup": "menu", onClick: onToggle, children: _jsx(FaIcon, { className: "fas fa-ellipsis-h" }) }), open && (_jsx(ActionMenu, { children: items.map((item) => (_jsx("button", { type: "button", onClick: () => {
                    onToggle();
                    item.onClick();
                }, className: `w-full text-left px-3.5 py-2.5 hover:bg-hover transition-colors ${item.danger ? 'text-red-600' : ''}`, children: _jsxs("span", { className: "text-sm flex items-center gap-2 font-medium", children: [_jsx(FaIcon, { className: `fas ${item.icon} text-xs w-4 text-center ${item.danger ? '' : 'text-text-muted'}` }), item.label] }) }, item.label))) }))] }));
function ActionMenu({ children }) {
    return (_jsx("div", { role: "menu", className: "absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-card border border-border-light py-1.5 z-40", children: children }));
}
