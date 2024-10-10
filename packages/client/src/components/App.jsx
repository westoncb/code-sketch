import React, { useState } from 'react';
import TabBar from './TabBar';
import Sketch from './Sketch';
import Review from './Review';
import Code from './Code';
import ModalDialog from './ModalDialog';
import '../styles/global.css';

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '95%',
    height: '95%',
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
  const [isConfigVisible, setIsConfigVisible] = useState(false);

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
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConfigClick={() => setIsConfigVisible(true)}
      />
      <div style={styles.contentContainer}>
        {renderContent()}
      </div>
      <ModalDialog
        title="LLM Configuration"
        visible={isConfigVisible}
        onClose={() => setIsConfigVisible(false)}
      >
        <p>This is a placeholder for LLM configuration settings.</p>
        <p>You can add form elements or other content here.</p>
      </ModalDialog>
    </div>
  );
}

export default App;
