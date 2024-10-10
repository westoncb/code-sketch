import React, { useState } from 'react';
import Sketch from './Sketch';
import Review from './Review';
import Code from './Code';
import Waiting from './Waiting';

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    gap: '20px',
  },
  panel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--panel-bg)',
    border: '2px solid var(--border-color)',
    boxShadow: 'var(--box-shadow)',
    borderRadius: '5px',
    overflow: 'hidden',
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
  const [rightView, setRightView] = useState('waiting');

  const handleSketchAction = (action) => {
    if (action === 'check') {
      setRightView('review');
    } else if (action === 'generate') {
      setRightView('code');
    }
  };

  const getRightContent = () => {
    switch (rightView) {
      case 'review':
        return <Review />;
      case 'code':
        return <Code />;
      default:
        return <Waiting />;
    }
  };

  const getRightTitle = () => {
    switch (rightView) {
      case 'review':
        return 'Review';
      case 'code':
        return 'Code';
      default:
        return 'Ready to check or generate';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <div style={styles.title}>Sketch</div>
        <div style={styles.content}>
          <Sketch onAction={handleSketchAction} />
        </div>
      </div>
      <div style={styles.panel}>
        <div style={styles.title}>{getRightTitle()}</div>
        <div style={styles.content}>
          {getRightContent()}
        </div>
      </div>
    </div>
  );
}

export default DualView;
