import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Modal } from '@prototype/ui';
import { PromptFormStep } from './PromptModalSteps';
import { createProjectOnDisk } from '../lib/createProject';
import { generateProjectPrompt } from '../lib/prompt';
import { PLATFORM_LABELS } from '../lib/projectPlatform';
import { copyText, validateProjectName } from '../lib/utils';
export function ProjectPromptModal({ open, platform, onClose, onDone }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const prevOpenRef = useRef(false);
    useEffect(() => {
        if (open && !prevOpenRef.current) {
            setName('');
            setError('');
            setSubmitting(false);
        }
        prevOpenRef.current = open;
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
        const validated = validateProjectName(name);
        if (!validated.ok) {
            setError(validated.error);
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            const created = await createProjectOnDisk({
                name: validated.name,
                platform,
                version: 'v1',
            });
            if (!created.ok || !created.projectKey || !created.projectFolder) {
                setError(created.error ?? '创建项目目录失败');
                return;
            }
            const prompt = generateProjectPrompt({
                name: validated.name,
                slug: created.projectFolder,
                version: 'v1',
            }, platform);
            const promptCopied = await copyText(prompt);
            onDone({ projectKey: created.projectKey, promptCopied });
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
