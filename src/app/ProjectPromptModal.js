import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Modal } from '@prototype/ui';
import { PromptFormStep, PromptSuccessStep } from './PromptModalSteps';
import { createPendingProject, slugExists } from '../lib/projectStore';
import { PLATFORM_LABELS } from '../lib/projectPlatform';
import { copyText, slugify } from '../lib/utils';
export function ProjectPromptModal({ open, platform, onClose, onDone }) {
    const [step, setStep] = useState('form');
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (!open)
            return;
        setStep('form');
        setName('');
        setError('');
    }, [open, platform]);
    const reset = () => {
        setStep('form');
        setName('');
        setPrompt('');
        setCopied(false);
        setError('');
    };
    const handleClose = () => {
        reset();
        onClose();
    };
    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('请填写项目名称');
            return;
        }
        const slug = slugify(name.trim());
        if (slugExists(slug)) {
            setError(`目录 slug「${slug}」已被占用，请修改项目名称`);
            return;
        }
        const draft = createPendingProject(name.trim(), platform);
        setPrompt(draft.prompt);
        setCopied(await copyText(draft.prompt));
        setStep('success');
        onDone(draft.id);
    };
    if (!open)
        return null;
    const platformLabel = PLATFORM_LABELS[platform];
    const title = step === 'form' ? `新增${platformLabel}项目` : `${platformLabel} Prompt 已生成`;
    return (_jsx(Modal, { title: title, onClose: handleClose, size: step === 'success' ? 'xl' : 'md', children: step === 'form' ? (_jsx(PromptFormStep, { platform: platform, name: name, error: error, onNameChange: setName, onSubmit: handleSubmit, onCancel: handleClose })) : (_jsx(PromptSuccessStep, { platform: platform, prompt: prompt, copied: copied, onCopyAgain: async () => setCopied(await copyText(prompt)), onClose: handleClose })) }));
}
