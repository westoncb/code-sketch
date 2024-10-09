import React from 'react';

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
    padding: 'var(--spacing-small) var(--spacing-medium)',
    border: '2px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-color)',
    cursor: 'pointer',
  },
};

function TabBar({ activeTab, setActiveTab }) {
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
      <button style={styles.configButton} onClick={() => console.log('LLM Config')}>
        LLM Config
      </button>
    </div>
  );
}

export default TabBar;
