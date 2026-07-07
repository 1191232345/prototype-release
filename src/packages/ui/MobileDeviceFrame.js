import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const MOBILE_SCREEN_WIDTH = 390;
export const MOBILE_SCREEN_HEIGHT = 844;
const BEZEL = 8;
const STATUS_BAR_HEIGHT = 28;
const HOME_INDICATOR_HEIGHT = 20;
export function MobileDeviceFrame({ children, className = '' }) {
    const shellStyle = {
        width: MOBILE_SCREEN_WIDTH + BEZEL * 2,
        height: MOBILE_SCREEN_HEIGHT + BEZEL * 2,
    };
    const screenStyle = {
        width: MOBILE_SCREEN_WIDTH,
        height: MOBILE_SCREEN_HEIGHT,
    };
    return (_jsx("div", { className: `flex justify-center items-start py-6 px-2 bg-neutral-200/80 ${className}`, children: _jsx("div", { className: "relative shrink-0 grow-0 bg-neutral-900 rounded-[2.25rem] shadow-2xl", style: { ...shellStyle, padding: BEZEL }, 'data-mobile-frame': true, children: _jsxs("div", { className: "relative flex flex-col bg-white rounded-[1.75rem] overflow-hidden", style: screenStyle, children: [_jsx("div", { className: "shrink-0 bg-primary flex items-end justify-center pb-1", style: { height: STATUS_BAR_HEIGHT }, children: _jsx("div", { className: "w-[88px] h-[22px] bg-neutral-900 rounded-full", "aria-hidden": true }) }), _jsx("div", { className: "flex-1 min-h-0 overflow-hidden flex flex-col", children: children }), _jsx("div", { className: "shrink-0 flex items-center justify-center pb-1", style: { height: HOME_INDICATOR_HEIGHT }, "aria-hidden": true, children: _jsx("div", { className: "w-28 h-1 bg-neutral-300 rounded-full" }) })] }) }) }));
}
