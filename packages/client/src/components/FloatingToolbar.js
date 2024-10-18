import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Button from './Button';
import useConfigStore from '../stores/configStore';
const styles = {
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-medium)',
        padding: 'var(--spacing-medium)',
        backgroundColor: 'var(--panel-bg)',
        border: '2px solid var(--border-color)',
        borderRadius: '5px',
        boxShadow: 'var(--box-shadow)',
        pointerEvents: 'auto',
        marginBottom: '5px'
    },
    llmStatus: {
        fontSize: 'var(--font-size-medium)',
        backgroundColor: "#f2848480",
        border: 'solid 1px black',
        borderRadius: '3px',
        padding: "5px",
        color: 'var(--text-color)',
        fontWeight: 'bold',
        opacity: 0.7,
        transition: 'opacity var(--transition-speed)',
    },
    llmStatusActive: {
        opacity: 1,
        backgroundColor: "#c1edff80",
        borderRadius: "3px",
        padding: "5px",
        border: "none"
    },
    helpButton: {
        marginLeft: '2rem',
    },
};
function FloatingToolbar({ onConfigClick, onHelpClick }) {
    const llmConfig = useConfigStore((state) => state.llmConfig);
    const { provider, model } = llmConfig || {};
    const isLLMSelected = provider && model;
    const llmStatusText = isLLMSelected ? `${provider} - ${model}` : '<no llm selected>';
    return (_jsxs("div", { style: styles.toolbar, children: [_jsx(Button, { onClick: onConfigClick, children: "LLM Config" }), _jsxs("span", { style: {
                    ...styles.llmStatus,
                    ...(isLLMSelected ? styles.llmStatusActive : {}),
                }, children: ["<", llmStatusText, ">"] })] }));
}
export default FloatingToolbar;
