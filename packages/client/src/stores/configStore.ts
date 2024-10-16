import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios, { AxiosError } from 'axios'
import { LLMConfig, LLMProvider } from '@code-sketch/shared-types'

interface ConfigStore {
  llmConfig: LLMConfig | null;
  setLLMConfig: (config: LLMConfig) => Promise<void>;
  clearLLMConfig: () => Promise<void>;
}

const defaultLLMConfigVals: LLMConfig = {
  model: "none", provider: LLMProvider.Anthropic, temp: 0.5, maxTokens: 4096
};

const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      llmConfig: null,
      setLLMConfig: async (config: LLMConfig) => {
        set({ llmConfig: {...defaultLLMConfigVals, ...config} });
      },
      clearLLMConfig: async () => {
        set({ llmConfig: null });
      },
    }),
    {
      name: 'llm-config-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useConfigStore
