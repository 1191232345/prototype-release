import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const PrototypeChromeContext = createContext(null);
export function PrototypeChromeProvider({ hidePageHeader = false, children, }) {
    return (_jsx(PrototypeChromeContext.Provider, { value: { hidePageHeader }, children: children }));
}
export function usePrototypeChrome() {
    return useContext(PrototypeChromeContext);
}
