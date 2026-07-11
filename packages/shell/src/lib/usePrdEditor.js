import { useCallback, useEffect, useState } from 'react';
import { saveProjectPrd } from './prdEditorApi';
export function usePrdEditor(project, onSaved) {
    const sourceText = project.prdText ?? '';
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(sourceText);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        setDraft(sourceText);
        setEditing(false);
        setSaving(false);
        setMessage('');
        setError('');
    }, [project.key, sourceText]);
    const dirty = draft !== sourceText;
    const startEdit = useCallback(() => {
        setEditing(true);
        setMessage('');
        setError('');
    }, []);
    const cancelEdit = useCallback(() => {
        setDraft(sourceText);
        setEditing(false);
        setMessage('');
        setError('');
    }, [sourceText]);
    const save = useCallback(async () => {
        setSaving(true);
        setMessage('');
        setError('');
        try {
            await saveProjectPrd({ projectKey: project.key, text: draft });
            setEditing(false);
            setMessage('已保存');
            onSaved?.();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : '保存失败');
        }
        finally {
            setSaving(false);
        }
    }, [project.key, draft, onSaved]);
    return { editing, draft, setDraft, dirty, saving, message, error, startEdit, cancelEdit, save, sourceText };
}
