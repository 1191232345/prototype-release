import { useCallback, useState } from 'react';
import { serializeSection } from '@prototype/runtime/serializeSection';
import { saveProjectPrd } from './prdEditorApi';
export function useSectionEditor(onSaved) {
    const [editingKey, setEditingKey] = useState(null);
    const [draft, setDraft] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const startEdit = useCallback((section) => {
        setDraft(JSON.parse(JSON.stringify(section)));
        setEditingKey(section.anchorId ?? section.title);
        setMessage('');
        setError('');
    }, []);
    const cancelEdit = useCallback(() => {
        setEditingKey(null);
        setDraft(null);
        setMessage('');
        setError('');
    }, []);
    const updateDraft = useCallback((updater) => {
        setDraft((prev) => {
            if (!prev)
                return prev;
            const next = JSON.parse(JSON.stringify(prev));
            updater(next);
            return next;
        });
    }, []);
    const save = useCallback(async (project, originalText, section) => {
        if (!draft)
            return;
        setSaving(true);
        setMessage('');
        setError('');
        try {
            const serializedLines = serializeSection(draft);
            const originalLines = originalText.replace(/\r\n/g, '\n').split('\n');
            const before = originalLines.slice(0, section.startLine);
            const after = originalLines.slice(section.endLine + 1);
            const newText = [...before, ...serializedLines, ...after].join('\n');
            await saveProjectPrd({ projectKey: project.key, text: newText });
            setEditingKey(null);
            setDraft(null);
            setMessage('已保存');
            onSaved?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '保存失败');
        }
        finally {
            setSaving(false);
        }
    }, [draft, onSaved]);
    return { editingKey, draft, saving, message, error, startEdit, cancelEdit, updateDraft, save };
}
