import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { renderSpec } from './index';
import { FlowNavProvider } from './FlowContext';
export function FlowRenderer({ flow, requirementsText, onPageChange }) {
    const [currentPage, setCurrentPage] = useState(flow.entry);
    const [params, setParams] = useState({});
    useEffect(() => {
        setCurrentPage(flow.entry);
        setParams({});
    }, [flow.entry]);
    useEffect(() => {
        onPageChange?.(currentPage);
    }, [currentPage, onPageChange]);
    const pageLabels = {};
    Object.entries(flow.pages).forEach(([id, page]) => {
        pageLabels[id] = page.title ?? id;
    });
    const navigate = (page, nextParams) => {
        if (!flow.pages[page])
            return;
        setCurrentPage(page);
        setParams(nextParams ?? {});
    };
    const pageDef = flow.pages[currentPage];
    const pageSpec = {
        ...pageDef,
        header: pageDef.header ?? flow.header,
    };
    if (currentPage === 'list' && flow.pages.task?.details && !pageSpec.details) {
        pageSpec.details = flow.pages.task.details;
    }
    if (currentPage === 'pda-list' && flow.pages.pda?.details && !pageSpec.details) {
        pageSpec.details = flow.pages.pda.details;
    }
    return (_jsx(FlowNavProvider, { value: { navigate, params, currentPage, pageLabels, requirementsText }, children: renderSpec(pageSpec) }));
}
