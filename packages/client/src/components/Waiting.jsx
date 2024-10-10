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
  return (
    <div style={styles.container}>
      <div style={styles.patternContainer}>
        {[...Array(80)].map((_, index) => (
          <div key={index} style={styles.stripe}></div>
        ))}
      </div>
    </div>
  );
}

export default Waiting;
