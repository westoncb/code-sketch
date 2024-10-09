import React from 'react';
import Button from './Button';

const styles = {
  contextBar: {
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--spacing-medium)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 'var(--spacing-small)',
  },
  title: {
    marginRight: 'var(--spacing-medium)',
    fontWeight: 'bold',
  },
  contextItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-small)',
  },
  contextItem: {
    position: 'relative',
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    padding: 'var(--spacing-small) var(--spacing-medium) var(--spacing-small) var(--spacing-small)',
    borderRadius: '3px',
  },
  closeButton: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'none',
    border: 'none',
    color: 'var(--button-text)',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '0',
  },
};

function ContextBar() {
  // This is just mock data for now
  const contextItems = ['Context 1', 'Context 2', 'Context 3'];

  return (
    <div style={styles.contextBar}>
      <div style={styles.header}>
        <span style={styles.title}>context:</span>
        <Button onClick={() => console.log('Add context')}>+</Button>
      </div>
      <div style={styles.contextItems}>
        {contextItems.map((item, index) => (
          <div key={index} style={styles.contextItem}>
            {item}
            <button
              style={styles.closeButton}
              onClick={() => console.log(`Remove ${item}`)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContextBar;
