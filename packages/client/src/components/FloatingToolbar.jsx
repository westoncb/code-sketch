import React from 'react';
import Button from './Button';

const styles = {
  toolbar: {
    display: 'flex',
    gap: 'var(--spacing-medium)',
    padding: 'var(--spacing-small)',
    backgroundColor: 'var(--panel-bg)',
    border: '2px solid var(--border-color)',
    borderRadius: '5px',
    boxShadow: 'var(--box-shadow)',
    pointerEvents: 'auto', // Re-enable pointer events
  },
};

function FloatingToolbar({ onConfigClick, onHelpClick }) {
  return (
    <div style={styles.toolbar}>
      <Button onClick={onConfigClick}>LLM Config</Button>
      <Button onClick={onHelpClick}>Help</Button>
    </div>
  );
}

export default FloatingToolbar;
