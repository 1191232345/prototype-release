import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { FaIcon } from '@prototype/ui/Icon';
export class PatternErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { error: null }
        });
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        console.error(`Pattern "${this.props.pattern}" render error:`, error, info.componentStack);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pattern !== this.props.pattern && this.state.error) {
            this.setState({ error: null });
        }
    }
    render() {
        if (this.state.error) {
            return (_jsxs("div", { className: "p-8 text-center text-danger", children: [_jsx(FaIcon, { className: "fas fa-exclamation-circle text-2xl mb-2" }), _jsxs("p", { className: "font-medium", children: ["Pattern \u6E32\u67D3\u5931\u8D25\uFF1A", this.props.pattern] }), _jsx("p", { className: "text-sm text-text-muted mt-2", children: this.state.error.message })] }));
        }
        return this.props.children;
    }
}
