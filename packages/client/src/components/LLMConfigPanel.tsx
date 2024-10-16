import React, { useState, useEffect } from 'react';
import { LLMProvider } from '@code-sketch/shared-types';
import axios from 'axios';
import Button from './Button';
import MiniStatus from './MiniStatus';
import useStore from '../stores/store';
import useConfigStore from '../stores/configStore';
import { LLMConfig } from '@code-sketch/shared-types';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-medium)',
    padding: 'var(--spacing-medium)',
  },
  row: {
    display: 'flex',
    gap: 'var(--spacing-medium)',
    alignItems: 'center',
    justifyContent: "right"
  },
  select: {
    flex: 1,
    padding: 'var(--spacing-small)',
    backgroundColor: 'var(--bg-color)',
    border: '2px solid var(--border-color)',
    borderRadius: '5px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
  },
  label: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
    marginRight: 'var(--spacing-small)',
  },
} as const;

interface LLMConfigProps {
  onClose: () => void;
}

const LLMConfigPanel: React.FC<LLMConfigProps> = ({ onClose }) => {
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const { setLLMConfig, llmConfig } = useConfigStore((state) => ({
    setLLMConfig: state.setLLMConfig,
    llmConfig: state.llmConfig
  }));

  // This is a local copy of the config for use within the dialog prior to confirmation of change
  const [tempLLMConfig, setTempLLMConfig] = useState<LLMConfig>({...llmConfig});

  const { miniStatus, setMiniStatus } = useStore(state => ({
    miniStatus: state.miniStatus,
    setMiniStatus: state.setMiniStatus
  }));

  useEffect(() => {
    fetchAvailableModels();
  }, [tempLLMConfig.provider]);

  const fetchAvailableModels = async () => {
    try {
      const response = await axios.get(`/api/available-models?provider=${tempLLMConfig.provider}`);
      const models = response.data.models;
      setAvailableModels(models);
      setTempLLMConfig({ ...tempLLMConfig, model: models[0] });
    } catch (error) {
      console.error('Error fetching available models:', error);
      setAvailableModels([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (tempLLMConfig.provider === LLMProvider.Ollama) {
        setMiniStatus({ message: `Attempting to load ${tempLLMConfig.provider} model: ${tempLLMConfig.model}`, showSpinner: true });
        await axios.post('/api/load-ollama-model', {model: tempLLMConfig.model});
      }

      setLLMConfig(tempLLMConfig);

      if (tempLLMConfig.provider === LLMProvider.Ollama) {
        setMiniStatus({ message: 'Model loaded successfully' });

        setTimeout(() => {
          setMiniStatus(null);
          onClose();
        }, 1000);
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error selecting model:', error);
      if (tempLLMConfig.provider === LLMProvider.Ollama) {
        setMiniStatus({ message: 'Error selecting model', onConfirm: () => {} });
        setTimeout(() => setMiniStatus(null), 1000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <MiniStatus config={miniStatus} />
      <div style={styles.row}>
        <label style={styles.label}>Provider:</label>
        <select
          value={tempLLMConfig.provider}
          onChange={(e) => setTempLLMConfig({ ...tempLLMConfig, provider: e.target.value as LLMProvider })}
          style={styles.select}
        >
          {Object.values(LLMProvider).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div style={styles.row}>
        <label style={styles.label}>Model:</label>
        <select
          value={tempLLMConfig.model}
          onChange={(e) => setTempLLMConfig({ ...tempLLMConfig, model: e.target.value })}
          style={styles.select}
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      <div style={styles.row}>
        <Button style={{marginTop: "5px"}} onClick={handleSubmit}>Confirm</Button>
      </div>
    </form>
  );
};

export default LLMConfigPanel;
