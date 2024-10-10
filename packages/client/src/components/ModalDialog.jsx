import React, { useEffect, useRef } from 'react';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: 'var(--panel-bg)',
    border: '2px solid var(--border-color)',
    boxShadow: 'var(--box-shadow)',
    width: '80%',
    maxWidth: '600px',
    maxHeight: '80%',
    display: 'flex',
    flexDirection: 'column',
  },
  titleBar: {
    backgroundColor: 'var(--tab-inactive-bg)',
    color: 'var(--text-color)',
    padding: 'var(--spacing-medium)',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid var(--border-color)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-color)',
    fontSize: '1.2em',
    cursor: 'pointer',
  },
  content: {
    padding: 'var(--spacing-large)',
    overflowY: 'auto',
  },
};

function ModalDialog({ title, visible, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div style={styles.titleBar}>
          <span>{title}</span>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default ModalDialog;
