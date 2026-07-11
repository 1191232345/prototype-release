import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from './Icon';
export function Button({ variant = 'primary', icon, children, className = '', ...rest }) {
    const cls = variant === 'primary'
        ? 'btn btn-primary'
        : variant === 'danger'
            ? 'btn btn-secondary text-red-600 border-red-200 hover:bg-red-50'
            : 'btn btn-secondary';
    return (_jsxs("button", { className: `${cls} ${className}`, ...rest, children: [icon && _jsx(Icon, { icon: icon, className: "mr-2" }), children] }));
}
