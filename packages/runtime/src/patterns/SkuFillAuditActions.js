import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, PrototypeModal } from '@prototype/ui';
import { reviewTarget } from '@prototype/review';
import { FaIcon } from '@prototype/ui/Icon';
export function SkuFillAuditActions({ onDone }) {
    const [showReturn, setShowReturn] = useState(false);
    const [showComplete, setShowComplete] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex justify-end gap-3 mt-6 pt-4 border-t border-border", children: [_jsx(Button, { variant: "secondary", onClick: () => onDone('已保存修改，工单状态更新为待客服审核'), ...reviewTarget('audit.btn.save', '保存修改'), children: "\u4FDD\u5B58\u4FEE\u6539" }), _jsx(Button, { variant: "secondary", onClick: () => setShowReturn(true), ...reviewTarget('audit.btn.return', '退回'), children: "\u9000\u56DE" }), _jsx(Button, { variant: "primary", onClick: () => setShowComplete(true), ...reviewTarget('audit.btn.complete', '完结'), children: "\u5B8C\u7ED3" })] }), showReturn && (_jsx(PrototypeModal, { title: "\u9000\u56DE\u5DE5\u5355", onClose: () => setShowReturn(false), size: "md", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "block text-sm text-text-secondary", children: ["\u9000\u56DE\u539F\u56E0 ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { className: "w-full border border-border rounded-lg p-3 text-sm", rows: 4, maxLength: 200, placeholder: "\u8BF7\u586B\u5199\u9000\u56DE\u539F\u56E0\uFF08\u5FC5\u586B\uFF0C\u6700\u591A 200 \u5B57\uFF09", value: returnReason, onChange: (e) => setReturnReason(e.target.value), ...reviewTarget('audit.return-reason', '退回原因') }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowReturn(false), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", onClick: () => {
                                        if (!returnReason.trim())
                                            return;
                                        setShowReturn(false);
                                        onDone('工单已退回');
                                    }, ...reviewTarget('audit.btn.confirm-return', '确认退回'), children: "\u786E\u8BA4\u9000\u56DE" })] })] }) })), showComplete && (_jsx(PrototypeModal, { title: "\u786E\u8BA4\u5B8C\u7ED3", onClose: () => setShowComplete(false), size: "md", children: _jsxs("div", { className: "text-center py-4", children: [_jsx(FaIcon, { className: "fas fa-check-circle text-5xl text-green-500 mb-4" }), _jsx("p", { className: "text-base text-text-secondary mb-6", children: "\u5B8C\u7ED3\u540E\u5C06\u5199\u56DE SKU \u57FA\u7840\u6570\u636E\uFF0C\u5DE5\u5355\u4E0D\u53EF\u518D\u4FEE\u6539\u3002\u786E\u5B9A\u5B8C\u7ED3\u5417\uFF1F" }), _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowComplete(false), children: "\u53D6\u6D88" }), _jsx(Button, { variant: "primary", onClick: () => {
                                        setShowComplete(false);
                                        onDone('工单已完结，SKU 信息已写回基础数据');
                                    }, ...reviewTarget('audit.btn.confirm-complete', '确认完结'), children: "\u786E\u8BA4\u5B8C\u7ED3" })] })] }) }))] }));
}
