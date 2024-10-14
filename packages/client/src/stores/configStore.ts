import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios, { AxiosError } from 'axios'

export interface LLMConfig {
  modelName: string;
  provider: string;
}

interface ConfigStore {
  llmConfig: LLMConfig | null;
  setLLMConfig: (config: LLMConfig) => Promise<void>;
  clearLLMConfig: () => Promise<void>;
  syncConfigToServer: () => Promise<boolean>;
}

const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      llmConfig: null,
      setLLMConfig: async (config: LLMConfig) => {
        set({ llmConfig: config });
        await get().syncConfigToServer();
      },
      clearLLMConfig: async () => {
        set({ llmConfig: null });
        await get().syncConfigToServer();
      },
      syncConfigToServer: async () => {
        const currentConfig = get().llmConfig;
        try {
          const response = await axios.post('/api/select-model', currentConfig);

          if (response.status === 200) {
            return true;
          } else {
            console.warn('Unexpected response from server:', response.status);
            return false;
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error('Error syncing config with server:', axiosError.message);
            if (axiosError.response) {
              console.error('Server responded with:', axiosError.response.data);
            }
          } else {
            console.error('Unexpected error during config sync:', error);
          }
          return false;
        }
      },
    }),
    {
      name: 'llm-config-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useConfigStore
