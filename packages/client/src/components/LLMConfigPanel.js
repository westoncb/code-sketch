import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { LLMProvider } from '@code-sketch/shared-types';
import axios from 'axios';
import Button from './Button';
import MiniStatus from './MiniStatus';
import useStore from '../stores/store';
import useConfigStore from '../stores/configStore';
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
};
const LLMConfigPanel = ({ onClose }) => {
    const [availableModels, setAvailableModels] = useState([]);
    const { setLLMConfig, llmConfig } = useConfigStore((state) => ({
        setLLMConfig: state.setLLMConfig,
        llmConfig: state.llmConfig
    }));
    // This is a local copy of the config for use within the dialog prior to confirmation of change
    const [tempLLMConfig, setTempLLMConfig] = useState({ ...llmConfig });
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
        }
        catch (error) {
            console.error('Error fetching available models:', error);
            setAvailableModels([]);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (tempLLMConfig.provider === LLMProvider.Ollama) {
                setMiniStatus({ message: `Attempting to load ${tempLLMConfig.provider} model: ${tempLLMConfig.model}`, showSpinner: true });
                await axios.post('/api/load-ollama-model', { model: tempLLMConfig.model });
            }
            setLLMConfig(tempLLMConfig);
            if (tempLLMConfig.provider === LLMProvider.Ollama) {
                setMiniStatus({ message: 'Model loaded successfully' });
                setTimeout(() => {
                    setMiniStatus(null);
                    onClose();
                }, 1000);
            }
            else {
                onClose();
            }
        }
        catch (error) {
            console.error('Error selecting model:', error);
            if (tempLLMConfig.provider === LLMProvider.Ollama) {
                setMiniStatus({ message: 'Error selecting model', onConfirm: () => { } });
                setTimeout(() => setMiniStatus(null), 1000);
            }
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, style: styles.form, children: [_jsx(MiniStatus, { config: miniStatus }), _jsxs("div", { style: styles.row, children: [_jsx("label", { style: styles.label, children: "Provider:" }), _jsx("select", { value: tempLLMConfig.provider, onChange: (e) => setTempLLMConfig({ ...tempLLMConfig, provider: e.target.value }), style: styles.select, children: Object.values(LLMProvider).map((p) => (_jsx("option", { value: p, children: p }, p))) })] }), _jsxs("div", { style: styles.row, children: [_jsx("label", { style: styles.label, children: "Model:" }), _jsx("select", { value: tempLLMConfig.model, onChange: (e) => setTempLLMConfig({ ...tempLLMConfig, model: e.target.value }), style: styles.select, children: availableModels.map((model) => (_jsx("option", { value: model, children: model }, model))) })] }), _jsx("div", { style: styles.row, children: _jsx(Button, { style: { marginTop: "5px" }, onClick: handleSubmit, children: "Confirm" }) })] }));
};
export default LLMConfigPanel;
