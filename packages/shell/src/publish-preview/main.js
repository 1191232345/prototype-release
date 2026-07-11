import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SplitReviewPanel } from '../app/SplitReviewPanel';
import { loadPublishedProject } from './loadPublishedProject';
import '../vendor/localAssets';
import '../index.css';
import { FaIcon } from '@prototype/ui/Icon';
function PublishPreviewApp() {
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        loadPublishedProject()
            .then((item) => {
            document.title = `${item.meta.title || item.meta.project} · ${item.meta.version} · 原型预览`;
            setProject(item);
        })
            .catch((err) => {
            setError(err instanceof Error ? err.message : '加载失败');
        });
    }, []);
    useEffect(() => {
        if (!project)
            return;
        document.getElementById('publish-preview-boot')?.remove();
    }, [project]);
    if (error) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-surface p-8", children: _jsxs("div", { className: "text-center max-w-md", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle text-3xl text-danger mb-4" }), _jsx("p", { className: "font-semibold text-dark", children: "\u65E0\u6CD5\u52A0\u8F7D\u539F\u578B" }), _jsx("p", { className: "text-sm text-text-muted mt-2", children: error })] }) }));
    }
    if (!project) {
        return (_jsxs("div", { className: "h-screen flex flex-col min-h-0 overflow-hidden bg-surface", children: [_jsx("div", { className: "shrink-0 border-b border-primary-dark/30 bg-primary text-white px-4 py-2.5", children: _jsx("p", { className: "text-sm font-semibold", children: "ELSA \u00B7 \u539F\u578B\u9884\u89C8" }) }), _jsx("div", { className: "flex-1 flex items-center justify-center", children: _jsxs("p", { className: "text-sm text-text-muted", children: [_jsx(FaIcon, { className: "fas fa-spinner fa-spin mr-2" }), "\u52A0\u8F7D\u539F\u578B\u2026"] }) })] }));
    }
    return (_jsx("div", { className: "h-screen flex flex-col min-h-0 overflow-hidden", children: _jsx(SplitReviewPanel, { project: project, chrome: "publish" }) }));
}
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(PublishPreviewApp, {}) }));
