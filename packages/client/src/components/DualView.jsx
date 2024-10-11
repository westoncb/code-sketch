import React, { useState } from 'react';
import Sketch from './Sketch';
import Review from './Review';
import Code from './Code';
import Waiting from './Waiting';
import useStore from '../store';
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
  const activeResultPanel = useStore(state => state.activeResultPanel)
  const miniStatus = useStore(state => state.miniStatus);

  const getRightContent = () => {
    switch (activeResultPanel) {
      case ResultPanel.review:
        return <Review />;
      case ResultPanel.code:
        return <Code/>;
      default:
        return <Waiting />;
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

  return (
    <div style={styles.container}>
      {miniStatus?.displayRegion === "center" &&
        <MiniStatus config={miniStatus}/>
      }
      <div style={styles.panel}>
        {miniStatus?.displayRegion === "left" &&
          <MiniStatus config={miniStatus}/>
        }
        <div style={styles.title}>Sketch</div>
        <div style={styles.content}>
          <Sketch/>
        </div>
      </div>
      <div style={styles.panel}>
        {miniStatus?.displayRegion === "right" &&
          <MiniStatus config={miniStatus}/>
        }
        <div style={styles.title}>{getRightTitle()}</div>
        <div style={styles.content}>
          {getRightContent()}
        </div>
      </div>
    </div>
  );
}

export default DualView;
