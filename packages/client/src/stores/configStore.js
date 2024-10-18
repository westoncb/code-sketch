import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LLMProvider } from '@code-sketch/shared-types';
const defaultLLMConfigVals = {
    model: undefined, provider: LLMProvider.Anthropic, temp: 0.5, maxTokens: 4096
};
const useConfigStore = create()(persist((set, get) => ({
    llmConfig: defaultLLMConfigVals,
    setLLMConfig: async (config) => {
        set({ llmConfig: { ...defaultLLMConfigVals, ...config } });
    },
    clearLLMConfig: async () => {
        set({ llmConfig: null });
    },
}), {
    name: 'llm-config-storage',
    storage: createJSONStorage(() => localStorage),
}));
export default useConfigStore;
