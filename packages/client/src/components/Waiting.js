import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const styles = {
    container: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-color)',
        overflow: 'hidden',
    },
    patternContainer: {
        width: '400%',
        height: '400%',
        transform: 'rotate(45deg)',
    },
    stripe: {
        height: '20px',
        marginBottom: '20px',
        backgroundColor: 'var(--panel-bg)',
        opacity: 0.5,
    },
};
function Waiting() {
    return (_jsx("div", { style: styles.container, children: _jsx("div", { style: styles.patternContainer, children: [...Array(80)].map((_, index) => (_jsx("div", { style: styles.stripe }, index))) }) }));
}
export default Waiting;
