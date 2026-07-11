import { jsx as _jsx } from "react/jsx-runtime";
const STYLE_MAP = {
    待仓库处理: 'bg-gray-100 text-gray-700',
    待盘点: 'bg-amber-100 text-amber-800',
    待客服审核: 'bg-blue-100 text-blue-800',
    待审核: 'bg-blue-100 text-blue-800',
    已退回: 'bg-amber-100 text-amber-800',
    驳回: 'bg-red-100 text-red-700 font-bold',
    已完结: 'bg-green-100 text-green-800',
    已完成: 'bg-green-100 text-green-800',
};
export function SkuFillStatusBadge({ label }) {
    const cls = STYLE_MAP[label] ?? 'bg-gray-100 text-gray-600';
    return (_jsx("span", { className: `inline-flex px-2 py-1 rounded-full text-xs font-semibold ${cls}`, children: label }));
}
