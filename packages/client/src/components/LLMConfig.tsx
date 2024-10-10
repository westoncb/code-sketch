import React, { useState } from 'react';
import { LLMProvider } from '@code-sketch/shared-types';
import axios from 'axios';
import Button from './Button'; // Assuming this is the path to your Button component
import StatusLoadingIndicator from './StatusLoadingIndicator'

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
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
  input: {
    flex: 2,
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
};

const LLMConfig: React.FC = ({}) => {
  const [provider, setProvider] = useState<LLMProvider>(LLMProvider.OpenAI);
  const [modelName, setModelName] = useState('');
  const [status, setStatus] = useState<(string | null)>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SUBMITTING")
    e.preventDefault();
    setStatus('Selecting model...');
    try {
      const response = await axios.post('/api/select-model', {
        provider,
        modelName
      });
      setStatus(null);
      console.log("RESPONSE", response);
    } catch (error) {
      setStatus('Error selecting model');
      console.error('Error selecting model:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <StatusLoadingIndicator status={status}/>
      <div style={styles.row}>
        <label style={styles.label}>Provider:</label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as LLMProvider)}
          style={styles.select}
        >
          {Object.values(LLMProvider).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div style={styles.row}>
        <label style={styles.label}>Model:</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Enter model name"
          style={styles.input}
        />
      </div>
      <div style={styles.row}>
        <Button onClick={handleSubmit}>Confirm</Button>
      </div>
    </form>
  );
};

export default LLMConfig;
