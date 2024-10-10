import React from 'react';

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(196, 207, 161, 0.0)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: "none",
  },
  popup: {
    backgroundColor: 'var(--panel-bg)',
    border: '2px solid var(--border-color)',
    boxShadow: 'var(--box-shadow)',
    borderRadius: '5px',
    padding: 'var(--spacing-large)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-medium)',
  },
  loadingIndicator: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border-color)',
    borderTop: '4px solid var(--bg-color)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  statusText: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
    textAlign: 'center',
    maxWidth: '200px',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

const LoadingIndicator = ({ status }) => {
  if (status === null) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.loadingIndicator} />
        {status && <div style={styles.statusText}>{status}</div>}
      </div>
    </div>
  );
};

export default LoadingIndicator;
