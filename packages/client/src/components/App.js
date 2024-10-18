import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import DualView from './DualView';
import FloatingToolbar from './FloatingToolbar';
import ModalDialog from './ModalDialog';
import '../styles/global.css';
import LLMConfigPanel from './LLMConfigPanel';
const styles = {
    appContainer: {
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--bg-color)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    content: {
        width: '98%',
        height: '95%',
        display: 'flex',
        flexDirection: 'column',
    },
    floatingToolbarWrapper: {
        marginBottom: '10px', // Gap between toolbar and DualView
        height: '40px',
        display: 'flex',
        alignItems: 'center',
    },
    dualViewWrapper: {
        flex: 1,
        overflow: 'hidden', // Ensure DualView doesn't cause scrolling
    },
};
function App() {
    const [isConfigVisible, setIsConfigVisible] = useState(false);
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    return (_jsxs("div", { style: styles.appContainer, children: [_jsxs("div", { style: styles.content, children: [_jsx("div", { style: styles.floatingToolbarWrapper, children: _jsx(FloatingToolbar, { onConfigClick: () => setIsConfigVisible(true), onHelpClick: () => setIsHelpVisible(true) }) }), _jsx("div", { style: styles.dualViewWrapper, children: _jsx(DualView, {}) })] }), _jsx(ModalDialog, { title: "LLM Configuration", visible: isConfigVisible, onClose: () => setIsConfigVisible(false), children: _jsx(LLMConfigPanel, { onClose: () => setIsConfigVisible(false) }) }), _jsx(ModalDialog, { title: "Help", visible: isHelpVisible, onClose: () => setIsHelpVisible(false), children: _jsx("p", { children: "This is a placeholder for help content." }) })] }));
}
export default App;
