import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const Ctx = createContext(null);
export function FlowNavProvider({ value, children, }) {
    return _jsx(Ctx.Provider, { value: value, children: children });
}
export function useFlowNav() {
    return useContext(Ctx);
}
