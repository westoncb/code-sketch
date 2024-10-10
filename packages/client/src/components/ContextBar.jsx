import React, { useRef, useEffect } from 'react';
import Button from './Button';

const styles = {
  contextBar: {
    display: 'flex',
    alignItems: 'center',
    padding: 'var(--spacing-medium)',
    borderTop: '2px solid var(--border-color)',
  },
  title: {
    marginRight: 'var(--spacing-medium)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  addButton: {
    marginRight: 'var(--spacing-medium)',
    minWidth: 'auto',
    padding: '2px 6px',
  },
  contextItemsContainer: {
    display: 'flex',
    overflowX: 'auto',
    flexGrow: 1,
    gap: 'var(--spacing-small)',
    paddingBottom: 'var(--spacing-small)', // Space for the scrollbar
  },
  contextItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--tab-inactive-bg)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-color)',
    padding: '2px 6px',
    borderRadius: '3px',
    whiteSpace: 'nowrap',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-color)',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0 0 0 4px',
    marginLeft: '4px',
  },
};

function ContextBar() {
  const contextItems = ['Context 1', 'Context 2', 'Context 3', 'Context 4', 'Context 5']; // Mock data
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div style={styles.contextBar}>
      <span style={styles.title}>context:</span>
      <Button style={styles.addButton} onClick={() => console.log('Add context')}>+</Button>
      <div style={styles.contextItemsContainer} ref={scrollContainerRef}>
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
