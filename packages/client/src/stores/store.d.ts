import { ContextItem, ResultPanel, MiniStatusConfig } from "../client-types";
interface StoreState {
    sketch: string;
    review: string;
    code: string;
    context: ContextItem[];
    activeResultPanel: ResultPanel;
    miniStatus: MiniStatusConfig;
    setSketch: (sketch: string) => void;
    setReview: (review: string) => void;
    setCode: (code: string) => void;
    addContextItem: (item: ContextItem) => void;
    removeContextItem: (index: number) => void;
    updateContextItem: (index: number, item: Partial<ContextItem>) => void;
    setActiveResultPanel: (panel: ResultPanel) => void;
    setMiniStatus: (config: MiniStatusConfig) => void;
}
declare const useStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StoreState>>;
export default useStore;
