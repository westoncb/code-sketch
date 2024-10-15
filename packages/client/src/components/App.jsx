import React, { useState, useEffect } from 'react';
import DualView from './DualView';
import FloatingToolbar from './FloatingToolbar';
import ModalDialog from './ModalDialog';
import '../styles/global.css';
import LLMConfigPanel from './LLMConfigPanel';
import useConfigStore from '../stores/configStore';

const styles = {
  appContainer: {
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--bg-color)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    width: '98%',
    height: '95%',
    display: 'flex',
    flexDirection: 'column',
  },
  floatingToolbarWrapper: {
    marginBottom: '10px', // Gap between toolbar and DualView
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  },
  dualViewWrapper: {
    flex: 1,
    overflow: 'hidden', // Ensure DualView doesn't cause scrolling
  },
};

function App() {
  const [isConfigVisible, setIsConfigVisible] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const { syncConfigToServer } = useConfigStore();

  useEffect(() => {
    syncConfigToServer();
  }, []);

  return (
    <div style={styles.appContainer}>
      <div style={styles.content}>
        <div style={styles.floatingToolbarWrapper}>
          <FloatingToolbar
            onConfigClick={() => setIsConfigVisible(true)}
            onHelpClick={() => setIsHelpVisible(true)}
          />
        </div>
        <div style={styles.dualViewWrapper}>
          <DualView />
        </div>
      </div>
      <ModalDialog
        title="LLM Configuration"
        visible={isConfigVisible}
        onClose={() => setIsConfigVisible(false)}
      >
        <LLMConfigPanel onClose={() => setIsConfigVisible(false)}/>
      </ModalDialog>
      <ModalDialog
        title="Help"
        visible={isHelpVisible}
        onClose={() => setIsHelpVisible(false)}
      >
        <p>This is a placeholder for help content.</p>
      </ModalDialog>
    </div>
  );
}

export default App;
