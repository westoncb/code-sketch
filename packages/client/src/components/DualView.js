import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import Sketch from './Sketch';
import SketchReview from './Review';
import Code from './Code';
import Waiting from './Waiting';
import useStore from '../stores/store';
import MiniStatus from './MiniStatus';
import { ResultPanel } from '../client-types';
const styles = {
    container: {
        display: 'flex',
        height: '100%',
        gap: '20px',
    },
    panel: {
        flex: 1,
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--panel-bg)',
        border: '2px solid var(--border-color)',
        boxShadow: 'var(--box-shadow)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: "5px",
        marginRight: "5px"
    },
    title: {
        padding: 'var(--spacing-medium)',
        backgroundColor: 'var(--tab-inactive-bg)',
        color: 'var(--text-color)',
        fontWeight: 'bold',
        borderBottom: '2px solid var(--border-color)',
    },
    content: {
        flex: 1,
        overflow: 'auto',
    },
};
function DualView() {
    const activeResultPanel = useStore(state => state.activeResultPanel);
    const miniStatus = useStore(state => state.miniStatus);
    const getRightContent = () => {
        switch (activeResultPanel) {
            case ResultPanel.review:
                return _jsx(SketchReview, {});
            case ResultPanel.code:
                return _jsx(Code, {});
            default:
                return _jsx(Waiting, {});
        }
    };
    const getRightTitle = () => {
        switch (activeResultPanel) {
            case ResultPanel.review:
                return 'Review';
            case ResultPanel.code:
                return 'Code';
            default:
                return 'Ready to check or generate';
        }
    };
    return (_jsxs("div", { style: styles.container, children: [miniStatus?.displayRegion === "center" &&
                _jsx(MiniStatus, { config: miniStatus }), _jsxs("div", { style: styles.panel, children: [miniStatus?.displayRegion === "left" &&
                        _jsx(MiniStatus, { config: miniStatus }), _jsx("div", { style: styles.title, children: "Sketch" }), _jsx("div", { style: styles.content, children: _jsx(Sketch, {}) })] }), _jsxs("div", { style: styles.panel, children: [miniStatus?.displayRegion === "right" &&
                        _jsx(MiniStatus, { config: miniStatus }), _jsx("div", { style: styles.title, children: getRightTitle() }), _jsx("div", { style: styles.content, children: getRightContent() })] })] }));
}
export default DualView;
