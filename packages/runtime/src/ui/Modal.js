import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createPortal } from 'react-dom';
import { usePrototypeStageHost } from '@prototype/runtime/contexts/PrototypeStageContext';
import { FaIcon } from '@prototype/ui/Icon';
const sizeClass = {
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
};
const containedSizeClass = {
    md: 'max-w-sm sm:max-w-md',
    lg: 'max-w-lg sm:max-w-xl',
    xl: 'max-w-xl sm:max-w-2xl',
};
export function Modal({ title, children, onClose, size = 'md', contained = false }) {
    const stageHost = usePrototypeStageHost();
    const panelSize = contained ? containedSizeClass[size] : sizeClass[size];
    const panelMaxHeight = contained ? 'max-h-[calc(100%-1.5rem)]' : 'max-h-[90vh]';
    const modal = (_jsx("div", { className: contained ? 'modal-backdrop-contained' : 'modal-backdrop', onClick: onClose, children: _jsxs("div", { className: `modal-panel bg-white rounded-2xl ${panelSize} w-full ${panelMaxHeight} overflow-hidden flex flex-col shadow-card`, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "px-4 sm:px-6 py-3 sm:py-4 border-b border-border-light flex justify-between items-center gap-3 shrink-0", children: [_jsx("h3", { className: "text-base font-bold text-dark truncate", children: title }), _jsx("button", { type: "button", onClick: onClose, className: "icon-btn w-8 h-8 text-text-muted hover:text-dark", "aria-label": "\u5173\u95ED", children: _jsx(FaIcon, { className: "fas fa-times" }) })] }), _jsx("div", { className: "flex-1 min-h-0 overflow-y-auto p-4 sm:p-6", children: children })] }) }));
    if (contained && !stageHost)
        return null;
    if (contained && stageHost) {
        return createPortal(modal, stageHost);
    }
    return modal;
}
export function PrototypeModal(props) {
    return _jsx(Modal, { ...props, contained: true });
}
