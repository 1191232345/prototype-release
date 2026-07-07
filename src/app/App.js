import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sidebar } from './Layout';
import { PreviewPanel } from './PreviewPanel';
import { ProjectToolbar } from './ProjectToolbar';
import { ProjectPromptModal } from './ProjectPromptModal';
import { EditProjectModal } from './EditProjectModal';
import { DeleteProjectModal } from './DeleteProjectModal';
import { SettingsModal } from './SettingsModal';
import { PublishResultModal } from './PublishResultModal';
import { Toast } from './Toast';
import { copyIteratePrompt } from '../lib/copyIteratePrompt';
import { countValidationErrors, invalidateProjectsCache, loadProjectDetail, loadProjectsWithReconcile } from '../data/prototypes';
import { fetchConfig, fetchPublishStatus, publishProjectPreview, } from '../lib/configApi';
const DEV_POLL_MS = 3000;
export function App() {
    const [listRefreshKey, setListRefreshKey] = useState(0);
    const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
    const [search, setSearch] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const archivedNotifiedRef = useRef(new Set());
    const validateNotifiedRef = useRef(false);
    const { projects, newlyArchived } = useMemo(() => loadProjectsWithReconcile(), [listRefreshKey]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [createPlatform, setCreatePlatform] = useState('pc');
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showPublishResult, setShowPublishResult] = useState(false);
    const [publishConfig, setPublishConfig] = useState(null);
    const [publishing, setPublishing] = useState(false);
    const [publishLoading, setPublishLoading] = useState(false);
    const [publishResult, setPublishResult] = useState(null);
    const [publishStatus, setPublishStatus] = useState(null);
    const immersive = true;
    const effectiveKey = selectedKey ?? projects[0]?.key ?? null;
    const selected = projects.find((p) => p.key === effectiveKey) ?? null;
    const [previewProject, setPreviewProject] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const previewItem = previewProject ?? selected;
    const hasPending = projects.some((p) => p.status === 'pending');
    const handleListRefresh = useCallback(() => {
        invalidateProjectsCache();
        setListRefreshKey((k) => k + 1);
        setPreviewRefreshKey((k) => k + 1);
    }, []);
    const showToast = useCallback((message, ms = 4000) => {
        setToast(message);
        const timer = setTimeout(() => setToast(null), ms);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        void fetchConfig()
            .then(setPublishConfig)
            .catch(() => setPublishConfig(null));
    }, []);
    useEffect(() => {
        const fresh = newlyArchived.filter((a) => !archivedNotifiedRef.current.has(a.key));
        if (fresh.length === 0)
            return;
        fresh.forEach((a) => archivedNotifiedRef.current.add(a.key));
        const label = fresh.map((a) => a.title).join('、');
        return showToast(`项目已归档：${label}`);
    }, [newlyArchived, showToast]);
    useEffect(() => {
        if (!hasPending)
            return;
        const id = setInterval(handleListRefresh, DEV_POLL_MS);
        return () => clearInterval(id);
    }, [hasPending, handleListRefresh]);
    useEffect(() => {
        if (!effectiveKey) {
            setPreviewProject(null);
            setDetailLoading(false);
            return;
        }
        const listed = projects.find((p) => p.key === effectiveKey);
        if (!listed || listed.status === 'pending') {
            setPreviewProject(listed ?? null);
            setDetailLoading(false);
            return;
        }
        let cancelled = false;
        setDetailLoading(true);
        void loadProjectDetail(effectiveKey).then((detail) => {
            if (!cancelled) {
                setPreviewProject(detail);
                setDetailLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [effectiveKey, listRefreshKey, previewRefreshKey, projects]);
    useEffect(() => {
        if (!import.meta.hot)
            return;
        const refresh = () => {
            invalidateProjectsCache();
            handleListRefresh();
        };
        import.meta.hot.accept('../data/prototypes.js', refresh);
        import.meta.hot.accept('../data/prototypeGlob.js', refresh);
    }, [handleListRefresh]);
    useEffect(() => {
        if (!import.meta.env.DEV || validateNotifiedRef.current)
            return;
        const errCount = countValidationErrors(projects);
        if (errCount > 0) {
            validateNotifiedRef.current = true;
            showToast(`发现 ${errCount} 个 Meta 校验问题`, 6000);
        }
    }, [projects, showToast]);
    useEffect(() => {
        if (!sidebarOpen)
            return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [sidebarOpen]);
    const handlePromptDone = useCallback((projectKey) => {
        handleListRefresh();
        if (projectKey)
            setSelectedKey(projectKey);
    }, [handleListRefresh]);
    const handleIterate = useCallback(async () => {
        if (!selected || selected.status === 'pending')
            return;
        const ok = await copyIteratePrompt(selected);
        showToast(ok ? '迭代 Prompt 已复制（迭代须同步 PRD）' : '复制失败，请重试', 3500);
    }, [selected, showToast]);
    const recordToResult = useCallback((record) => ({
        previewUrl: record.previewUrl,
        prdPreviewUrl: record.prdPreviewUrl,
        requirementsPreviewUrl: record.requirementsPreviewUrl,
        uploadId: record.uploadId,
        commit: record.commit,
        pagesDeployMessage: record.pagesDeployMessage,
        publishedAt: record.publishedAt,
        contentHash: record.contentHash,
        skipped: true,
    }), []);
    const handleOpenPublish = useCallback(async () => {
        if (!selected || selected.status === 'pending' || publishLoading || publishing)
            return;
        if (!publishConfig?.publishConfigured) {
            setShowSettings(true);
            showToast('请先在设置中配置远程服务器', 3500);
            return;
        }
        setPublishLoading(true);
        try {
            const status = await fetchPublishStatus(selected.key, publishConfig.publishTarget);
            setPublishStatus(status);
            setPublishResult(status.record ? recordToResult(status.record) : null);
            setShowPublishResult(true);
        }
        catch (err) {
            showToast(err instanceof Error ? err.message : '读取发布状态失败', 5000);
        }
        finally {
            setPublishLoading(false);
        }
    }, [selected, publishLoading, publishing, publishConfig, showToast, recordToResult]);
    const handlePublish = useCallback(async (force = false) => {
        if (!selected || selected.status === 'pending' || publishing || !publishConfig?.publishConfigured) {
            return;
        }
        setPublishing(true);
        try {
            const result = await publishProjectPreview({
                projectKey: selected.key,
                title: selected.meta.title,
                target: publishConfig.publishTarget,
                force,
            });
            const status = await fetchPublishStatus(selected.key, publishConfig.publishTarget);
            setPublishStatus(status);
            setPublishResult(result);
            showToast(result.skipped ? '远程已是最新，未重复上传' : force ? '已强制重新发布' : '预览发布成功', 3000);
        }
        catch (err) {
            showToast(err instanceof Error ? err.message : '发布预览失败', 5000);
        }
        finally {
            setPublishing(false);
        }
    }, [selected, publishing, publishConfig, showToast]);
    return (_jsxs("div", { className: "h-screen flex overflow-hidden bg-surface", children: [_jsx(Sidebar, { projects: projects, selectedKey: effectiveKey, search: search, open: sidebarOpen, overlay: immersive, onSearchChange: setSearch, onSelect: (key) => {
                    setSelectedKey(key);
                    setSidebarOpen(false);
                }, onCreateClick: (platform) => {
                    setCreatePlatform(platform);
                    setShowCreate(true);
                    setSidebarOpen(false);
                }, onSettingsClick: () => {
                    setShowSettings(true);
                    setSidebarOpen(false);
                }, onRefresh: handleListRefresh, onClose: () => setSidebarOpen(false) }), _jsxs("main", { className: "flex-1 flex flex-col min-w-0 h-full w-full", children: [_jsx(ProjectToolbar, { project: selected, onMenuClick: () => setSidebarOpen(true), immersive: immersive, publishConfigured: Boolean(publishConfig?.publishConfigured), publishing: publishLoading || publishing, onEdit: () => setShowEdit(true), onDelete: () => setShowDelete(true), onIterate: () => void handleIterate(), onPublish: () => void handleOpenPublish() }), _jsx(PreviewPanel, { project: previewItem, loading: detailLoading })] }), _jsx(ProjectPromptModal, { open: showCreate, platform: createPlatform, onClose: () => setShowCreate(false), onDone: handlePromptDone }), _jsx(EditProjectModal, { project: selected, open: showEdit, onClose: () => setShowEdit(false), onSaved: (key) => {
                    handleListRefresh();
                    setSelectedKey(key);
                    showToast('项目信息已更新', 3000);
                } }), _jsx(DeleteProjectModal, { project: selected, open: showDelete, onClose: () => setShowDelete(false), onDeleted: (message) => {
                    handleListRefresh();
                    setSelectedKey(null);
                    showToast(message, 3000);
                } }), _jsx(SettingsModal, { open: showSettings, onClose: () => setShowSettings(false), onSaved: (config) => setPublishConfig(config) }), _jsx(PublishResultModal, { open: showPublishResult, status: publishStatus, result: publishResult, publishing: publishing, onClose: () => setShowPublishResult(false), onPublish: (force) => void handlePublish(force) }), toast && _jsx(Toast, { message: toast })] }));
}
