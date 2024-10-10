import React from 'react';
import Button from './Button';

const styles = {
  tabBar: {
    display: 'flex',
    padding: 'var(--spacing-medium) var(--spacing-medium) 0',
    borderBottom: '2px solid var(--border-color)',
  },
  tab: {
    padding: 'var(--spacing-medium) var(--spacing-large)',
    marginRight: 'var(--spacing-small)',
    border: '2px solid var(--border-color)',
    borderBottom: 'none',
    borderRadius: 'var(--tab-border-radius)',
    backgroundColor: 'var(--tab-inactive-bg)',
    color: 'var(--text-color)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-speed)',
  },
  activeTab: {
    backgroundColor: 'var(--tab-active-bg)',
    borderBottomColor: 'var(--tab-active-bg)',
    position: 'relative',
    top: '2px',
  },
  configButton: {
    marginLeft: 'auto',
    marginBottom: "var(--spacing-medium)",
  },
};

function TabBar({ activeTab, setActiveTab, onConfigClick }) {
  const tabs = ['sketch', 'review', 'code'];

  return (
    <div style={styles.tabBar}>
      {tabs.map((tab) => (
        <div
          key={tab}
          style={{
            ...styles.tab,
            ...(activeTab === tab ? styles.activeTab : {}),
          }}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
      <Button style={styles.configButton} onClick={onConfigClick}>
        LLM Config
      </Button>
    </div>
  );
}

export default TabBar;
