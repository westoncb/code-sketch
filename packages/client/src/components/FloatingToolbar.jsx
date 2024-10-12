import React from 'react';
import Button from './Button';
import useConfigStore from '../stores/configStore';

const styles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-medium)',
    padding: 'var(--spacing-small)',
    backgroundColor: 'var(--panel-bg)',
    border: '2px solid var(--border-color)',
    borderRadius: '5px',
    boxShadow: 'var(--box-shadow)',
    pointerEvents: 'auto',
  },
  llmStatus: {
    fontSize: 'var(--font-size-small)',
    color: 'var(--text-color)',
    opacity: 0.7,
    transition: 'opacity var(--transition-speed)',
  },
  llmStatusActive: {
    opacity: 1,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: "3px",
    padding: "5px",
    fontWeight: "bold"
  },
  helpButton: {
    marginLeft: '2rem',
  },
};

function FloatingToolbar({ onConfigClick, onHelpClick }) {
  const llmConfig = useConfigStore((state) => state.llmConfig);

  const { provider, modelName } = llmConfig || {};
  const isLLMSelected = provider && modelName;
  const llmStatusText = isLLMSelected ? `${provider} - ${modelName}` : '<no llm selected>';

  return (
    <div style={styles.toolbar}>
      <Button onClick={onConfigClick}>LLM Config</Button>
      <span
        style={{
          ...styles.llmStatus,
          ...(isLLMSelected ? styles.llmStatusActive : {}),
        }}
      >
        {"<"}{llmStatusText}{">"}
      </span>
      <Button onClick={onHelpClick} style={styles.helpButton}>Help</Button>
    </div>
  );
}

export default FloatingToolbar;
