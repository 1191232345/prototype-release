import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Button, Modal } from '@prototype/ui';
import { fetchConfig, saveConfig } from '../lib/configApi';
import { deriveGithubPagesBaseUrl } from '../lib/githubUtils';
const TABS = [
    { id: 'server', label: '远程服务器' },
    { id: 'github', label: 'GitHub 发布' },
];
function toFormValues(config) {
    return {
        publishTarget: config.publishTarget,
        githubRepoUrl: config.githubRepoUrl,
        githubBranch: config.githubBranch || 'main',
        githubRepoPath: config.githubRepoPath || 'prototypes',
        githubPagesBaseUrl: config.githubPagesBaseUrl,
        githubAccessToken: config.githubTokenMasked,
        serverUploadUrl: config.serverUploadUrl,
        serverPreviewBaseUrl: config.serverPreviewBaseUrl,
        serverRepoPath: config.serverRepoPath || 'prototype',
        serverAccessToken: config.serverTokenMasked,
    };
}
export function SettingsModal({ open, onClose, onSaved }) {
    const [tab, setTab] = useState('server');
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        if (!open)
            return;
        setTab('server');
        setMessage('');
        setError('');
        setLoading(true);
        void (async () => {
            try {
                const config = await fetchConfig();
                setForm(toFormValues(config));
                setTab(config.publishTarget === 'github' ? 'github' : 'server');
            }
            catch (err) {
                setError(err instanceof Error ? err.message : '加载配置失败');
            }
            finally {
                setLoading(false);
            }
        })();
    }, [open]);
    if (!open)
        return null;
    const patch = (key, value) => {
        setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    };
    const handleSave = async () => {
        if (!form)
            return;
        setSaving(true);
        setMessage('');
        setError('');
        try {
            const payload = { ...form, publishTarget: tab };
            if (!payload.githubPagesBaseUrl.trim() && payload.githubRepoUrl.trim()) {
                payload.githubPagesBaseUrl = deriveGithubPagesBaseUrl(payload.githubRepoUrl);
            }
            const saved = await saveConfig(payload);
            setForm(toFormValues(saved));
            setMessage(saved.publishConfigured ? '配置已保存，可提交预览' : '配置已保存');
            onSaved?.(saved);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '保存失败');
        }
        finally {
            setSaving(false);
        }
    };
    const suggestedGithubPages = form?.githubRepoUrl ? deriveGithubPagesBaseUrl(form.githubRepoUrl) : '';
    return (_jsx(Modal, { title: "\u53D1\u5E03\u8BBE\u7F6E", onClose: () => !saving && onClose(), size: "lg", children: _jsxs("div", { className: "space-y-4", children: [_jsx("nav", { className: "flex gap-1 border-b border-border-light pb-2", children: TABS.map((item) => (_jsx("button", { type: "button", className: `tab-item ${tab === item.id ? 'active' : ''}`, onClick: () => setTab(item.id), children: item.label }, item.id))) }), loading ? (_jsx("p", { className: "text-sm text-text-muted", children: "\u52A0\u8F7D\u4E2D\u2026" })) : !form ? (_jsx("p", { className: "text-sm text-red-600", children: error || '无法加载配置' })) : tab === 'server' ? (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-text-secondary", children: "\u5C06\u9879\u76EE\u6253\u5305\u4E0A\u4F20\u5230\u8FDC\u7A0B Node \u670D\u52A1\u5668\uFF0C\u63D0\u4EA4\u540E\u7ACB\u5373\u83B7\u5F97\u53EF\u5206\u4EAB\u7684\u9884\u89C8\u94FE\u63A5\u3002" }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u4E0A\u4F20\u5730\u5740" }), _jsx("input", { className: "form-input", value: form.serverUploadUrl, onChange: (e) => patch('serverUploadUrl', e.target.value), placeholder: "http://139.196.105.207:3000/upload" })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u9884\u89C8\u524D\u7F00" }), _jsx("input", { className: "form-input", value: form.serverPreviewBaseUrl, onChange: (e) => patch('serverPreviewBaseUrl', e.target.value), placeholder: "http://139.196.105.207:3000/" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u9759\u6001\u76EE\u5F55" }), _jsx("input", { className: "form-input", value: form.serverRepoPath, onChange: (e) => patch('serverRepoPath', e.target.value), placeholder: "prototype" })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Access Token" }), _jsx("input", { className: "form-input", type: "password", value: form.serverAccessToken, onChange: (e) => patch('serverAccessToken', e.target.value), placeholder: "\u670D\u52A1\u5668\u9274\u6743 Token" })] })] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-text-secondary", children: "\u63A8\u9001\u5230 GitHub / Gitee \u4ED3\u5E93\uFF0C\u901A\u8FC7 Pages \u63D0\u4F9B\u5728\u7EBF\u9884\u89C8\u3002" }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u4ED3\u5E93\u5730\u5740" }), _jsx("input", { className: "form-input", value: form.githubRepoUrl, onChange: (e) => patch('githubRepoUrl', e.target.value), placeholder: "https://github.com/owner/repo.git" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u5206\u652F" }), _jsx("input", { className: "form-input", value: form.githubBranch, onChange: (e) => patch('githubBranch', e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "\u4ED3\u5E93\u5B50\u76EE\u5F55" }), _jsx("input", { className: "form-input", value: form.githubRepoPath, onChange: (e) => patch('githubRepoPath', e.target.value) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Pages \u9884\u89C8\u524D\u7F00" }), _jsx("input", { className: "form-input", value: form.githubPagesBaseUrl, onChange: (e) => patch('githubPagesBaseUrl', e.target.value), placeholder: suggestedGithubPages || 'https://owner.github.io/repo/' })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Personal Access Token" }), _jsx("input", { className: "form-input", type: "password", value: form.githubAccessToken, onChange: (e) => patch('githubAccessToken', e.target.value) })] })] })), message && _jsx("p", { className: "text-sm text-emerald-700", children: message }), error && _jsx("p", { className: "text-sm text-red-600", children: error }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { variant: "secondary", onClick: onClose, disabled: saving, children: "\u53D6\u6D88" }), _jsx(Button, { onClick: () => void handleSave(), disabled: saving || loading || !form, children: saving ? '保存中…' : '保存' })] })] }) }));
}
