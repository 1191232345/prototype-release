import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaIcon } from '@prototype/ui/Icon';
const MAP = {
    生效中: { cls: 'bg-green-100 text-green-800', icon: 'fas fa-play-circle' },
    待生效: { cls: 'bg-blue-100 text-blue-800', icon: 'fas fa-clock' },
    已过期: { cls: 'bg-gray-100 text-gray-600', icon: 'fas fa-history' },
    未发布: { cls: 'bg-gray-50 text-text-muted', icon: 'fas fa-minus-circle' },
};
export function EffectiveStatusBadge({ label }) {
    const cfg = MAP[label] ?? MAP['未发布'];
    return (_jsxs("span", { className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.cls}`, children: [_jsx(FaIcon, { className: `${cfg.icon} mr-1` }), label] }));
}
