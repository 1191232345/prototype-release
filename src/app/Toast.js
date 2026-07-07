import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaIcon } from '@prototype/ui/Icon';
export function Toast({ message }) {
    return (_jsx("div", { className: "fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 toast-enter", children: _jsxs("div", { className: "flex items-start gap-3 px-4 py-3 bg-dark text-white text-sm rounded-xl shadow-card sm:max-w-sm ml-auto", children: [_jsx("div", { className: "w-5 h-5 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5", children: _jsx(FaIcon, { className: "fas fa-check text-success text-[10px]" }) }), _jsx("span", { className: "leading-relaxed", children: message })] }) }));
}
