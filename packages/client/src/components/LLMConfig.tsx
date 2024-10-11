import React, { useState, useEffect } from 'react';
import { LLMProvider } from '@code-sketch/shared-types';
import axios from 'axios';
import Button from './Button';
import MiniStatus from './MiniStatus';
import useStore from '../store';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-medium)',
    padding: 'var(--spacing-medium)',
  } as React.CSSProperties,
  row: {
    display: 'flex',
    gap: 'var(--spacing-medium)',
    alignItems: 'center',
  } as React.CSSProperties,
  select: {
    flex: 1,
    padding: 'var(--spacing-small)',
    backgroundColor: 'var(--bg-color)',
    border: '2px solid var(--border-color)',
    borderRadius: '5px',
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
  } as React.CSSProperties,
  label: {
    fontFamily: 'var(--font-family)',
    fontSize: 'var(--font-size-normal)',
    color: 'var(--text-color)',
    marginRight: 'var(--spacing-small)',
  } as React.CSSProperties,
};

const LLMConfig: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [provider, setProvider] = useState<LLMProvider>(LLMProvider.Anthropic);
  const [modelName, setModelName] = useState('');
  const { miniStatus, setMiniStatus } = useStore(state => ({
    miniStatus: state.miniStatus,
    setMiniStatus: state.setMiniStatus
  }));
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableModels();
  }, [provider]);

  const fetchAvailableModels = async () => {
    try {
      const response = await axios.get(`/api/available-models?provider=${provider}`);
      const models = response.data.models;
      setModelName(models[0]);
      setAvailableModels(models);
    } catch (error) {
      console.error('Error fetching available models:', error);
      setAvailableModels([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let response;
      switch (provider) {
        case LLMProvider.Ollama:
          setMiniStatus({message: `Attempting to load ${provider} model: ${modelName}`, showSpinner: true});
          response = await axios.post('/api/select-model', { provider, modelName });
          setMiniStatus({message: 'Model loaded successfully'});
          setTimeout(() => {
            setMiniStatus(null);
            onClose(); // Close the LLMConfig dialog
          }, 1000);
          break;
        case LLMProvider.OpenAI:
          // Placeholder for OpenAI logic
          console.log('OpenAI model selection not implemented');
          onClose();
          break;
        case LLMProvider.Anthropic:
          // Placeholder for Anthropic logic
          response = await axios.post('/api/select-model', { provider, modelName });
          onClose();
          break;
        default:
          throw new Error('Unsupported provider');
      }
    } catch (error) {
      setMiniStatus({message: 'Error selecting model', onConfirm: () => {}});
      console.error('Error selecting model:', error);
      setTimeout(() => setMiniStatus(null), 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <MiniStatus config={miniStatus}/>
      <div style={styles.row}>
        <label style={styles.label}>Provider:</label>
        <select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value as LLMProvider);
          }}
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
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
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

export default LLMConfig;
