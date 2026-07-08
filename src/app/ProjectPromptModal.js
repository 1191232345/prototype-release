import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Modal } from '@prototype/ui';
import { PromptFormStep } from './PromptModalSteps';
import { createProjectOnDisk } from '../lib/createProject';
import { generateProjectPrompt } from '../lib/generateProjectPrompt';
import { slugExists } from '../lib/projectStore';
import { PLATFORM_LABELS } from '../lib/projectPlatform';
import { copyText, slugify } from '../lib/utils';
export function ProjectPromptModal({ open, platform, onClose, onDone }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        if (!open)
            return;
        setName('');
        setError('');
        setSubmitting(false);
    }, [open, platform]);
    const handleClose = () => {
        if (submitting)
            return;
        setName('');
        setError('');
        onClose();
    };
    const handleSubmit = async () => {
        if (submitting)
            return;
        if (!name.trim()) {
            setError('请填写项目名称');
            return;
        }
        const slug = slugify(name.trim());
        if (slugExists(slug)) {
            setError(`目录 slug「${slug}」已被占用，请修改项目名称`);
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const created = await createProjectOnDisk({
                name: name.trim(),
                slug,
                platform,
                version: 'v1',
            });
            if (!created.ok) {
                setError(created.error ?? '创建项目目录失败');
                return;
            }
            const projectKey = created.projectKey ?? `${slug}/v1`;
            const prompt = generateProjectPrompt({ name: name.trim(), slug, version: 'v1' }, platform);
            const promptCopied = await copyText(prompt);
            onDone({ projectKey, promptCopied });
            setName('');
            setError('');
            onClose();
        }
        finally {
            setSubmitting(false);
        }
    };
    if (!open)
        return null;
    return (_jsx(Modal, { title: `新增${PLATFORM_LABELS[platform]}项目`, onClose: handleClose, size: "md", children: _jsx(PromptFormStep, { platform: platform, name: name, error: error, submitting: submitting, onNameChange: setName, onSubmit: handleSubmit, onCancel: handleClose }) }));
}
