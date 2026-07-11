import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const PrototypeStageContext = createContext(null);
export function PrototypeStageProvider({ host, children, }) {
    return _jsx(PrototypeStageContext.Provider, { value: host, children: children });
}
export function usePrototypeStageHost() {
    return useContext(PrototypeStageContext);
}
