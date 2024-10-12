import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface LLMConfig {
  modelName: string;
  provider: string;
}

interface ConfigStore {
  llmConfig: LLMConfig | null;
  setLLMConfig: (config: LLMConfig) => void;
  clearLLMConfig: () => void;
}

const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      llmConfig: null,
      setLLMConfig: (config: LLMConfig) => set({ llmConfig: config }),
      clearLLMConfig: () => set({ llmConfig: null }),
    }),
    {
      name: 'llm-config-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useConfigStore
