import React, { useState } from 'react';
import TabBar from './TabBar';
import Sketch from './Sketch';
import Review from './Review';
import Code from './Code';
import '../styles/global.css';

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 'var(--app-width)',
    height: 'var(--app-height)',
    backgroundColor: 'var(--panel-bg)',
    boxShadow: 'var(--box-shadow)',
    border: '2px solid var(--border-color)',
    color: 'var(--text-color)',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
};

function App() {
  const [activeTab, setActiveTab] = useState('sketch');

  const renderContent = () => {
    switch(activeTab) {
      case 'sketch':
        return <Sketch />;
      case 'review':
        return <Review />;
      case 'code':
        return <Code />;
      default:
        return <Sketch />;
    }
  };

  return (
    <div style={styles.appContainer}>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={styles.contentContainer}>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
