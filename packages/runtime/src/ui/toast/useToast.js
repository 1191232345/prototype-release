import { useCallback, useEffect, useRef, useState } from 'react';
const DEFAULT_DURATION_MS = 2500;
export function useToast(durationMs = DEFAULT_DURATION_MS) {
    const [message, setMessage] = useState(null);
    const timerRef = useRef(undefined);
    useEffect(() => () => {
        if (timerRef.current)
            clearTimeout(timerRef.current);
    }, []);
    const showToast = useCallback((text, ms = durationMs) => {
        if (timerRef.current)
            clearTimeout(timerRef.current);
        setMessage(text);
        timerRef.current = setTimeout(() => setMessage(null), ms);
    }, [durationMs]);
    const clearToast = useCallback(() => {
        if (timerRef.current)
            clearTimeout(timerRef.current);
        setMessage(null);
    }, []);
    return { toastMessage: message, showToast, clearToast };
}
