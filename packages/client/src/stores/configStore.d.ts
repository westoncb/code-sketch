import { LLMConfig } from '@code-sketch/shared-types';
interface ConfigStore {
    llmConfig: LLMConfig | null;
    setLLMConfig: (config: LLMConfig) => Promise<void>;
    clearLLMConfig: () => Promise<void>;
}
declare const useConfigStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<ConfigStore>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<ConfigStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: ConfigStore) => void) => () => void;
        onFinishHydration: (fn: (state: ConfigStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<ConfigStore, unknown>>;
    };
}>;
export default useConfigStore;
