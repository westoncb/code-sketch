import React, { useState, useEffect } from 'react';
import { LLMProvider } from '@code-sketch/shared-types';
import axios from 'axios';
import Button from './Button';
import MiniStatus from './MiniStatus';
import useStore from '../stores/store';
import useConfigStore, {LLMConfig} from '../stores/configStore';

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

  const setLLMConfig = useConfigStore((state) => state.setLLMConfig);
  const llmConfig = useConfigStore((state) => state.llmConfig);
  const { miniStatus, setMiniStatus } = useStore(state => ({
    miniStatus: state.miniStatus,
    setMiniStatus: state.setMiniStatus
  }));

  useEffect(() => {
    fetchAvailableModels();
  }, [llmConfig.provider]);

  const fetchAvailableModels = async () => {
    try {
      const response = await axios.get(`/api/available-models?provider=${llmConfig.provider}`);
      const models = response.data.models;
      setAvailableModels(models);
      if (!models.includes(llmConfig.modelName)) {
        setLLMConfig({ ...llmConfig, modelName: models[0] || '' });
      }
    } catch (error) {
      console.error('Error fetching available models:', error);
      setAvailableModels([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (llmConfig.provider === LLMProvider.Ollama) {
        setMiniStatus({ message: `Attempting to load ${llmConfig.provider} model: ${llmConfig.modelName}`, showSpinner: true });
      }

      // need to do this with what was in local storage (if anything) on first run
      await axios.post('/api/select-model', llmConfig);

      setLLMConfig(llmConfig);

      if (llmConfig.provider === LLMProvider.Ollama) {
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
      if (llmConfig.provider === LLMProvider.Ollama) {
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
          value={llmConfig.provider}
          onChange={(e) => setLLMConfig({ ...llmConfig, provider: e.target.value as LLMProvider })}
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
          value={llmConfig.modelName}
          onChange={(e) => setLLMConfig({ ...llmConfig, modelName: e.target.value })}
          style={styles.select}
        >
          {availableModels.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>
      <div style={styles.row}>
        <Button onClick={handleSubmit}>Confirm</Button>
      </div>
    </form>
  );
};

export default LLMConfigPanel;
