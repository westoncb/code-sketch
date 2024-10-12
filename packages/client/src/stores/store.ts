import {create} from 'zustand';
import { AnthropicModels, LLMConfig, LLMProvider } from "@code-sketch/shared-types";
import { ContextItem, ResultPanel, MiniStatusConfig } from "../client-types";

// Define the store state type
interface StoreState {
  sketch: string
  review: string
  code: string
  llmConfig: LLMConfig
  context: ContextItem[]
  activeResultPanel: ResultPanel
  miniStatus: MiniStatusConfig

  // Actions
  setSketch: (sketch: string) => void
  setReview: (review: string) => void
  setCode: (code: string) => void
  setLLMConfig: (config: Partial<LLMConfig>) => void
  addContextItem: (item: ContextItem) => void
  removeContextItem: (index: number) => void
  updateContextItem: (index: number, item: Partial<ContextItem>) => void
  setActiveResultPanel: (panel: ResultPanel) => void
  setMiniStatus: (config: MiniStatusConfig) => void
}

const useStore = create<StoreState>((set) => ({
  sketch: '',
  review: '',
  code: '',
  llmConfig: {
    provider: LLMProvider.Anthropic,
    model: AnthropicModels[0],
  },
  context: [],
  activeResultPanel: ResultPanel.waiting,
  miniStatus: null,

  // Actions
  setSketch: (sketch) => set({ sketch }),
  setReview: (review) => set({ review }),
  setCode: (code) => set({ code }),
  setLLMConfig: (config) => set((state) => ({
    llmConfig: { ...state.llmConfig, ...config }
  })),
  addContextItem: (item) => set((state) => ({
    context: [...state.context, item]
  })),
  removeContextItem: (index) => set((state) => ({
    context: state.context.filter((_, i) => i !== index)
  })),
  updateContextItem: (index, item) => set((state) => ({
    context: state.context.map((contextItem, i) =>
      i === index ? { ...contextItem, ...item } : contextItem
    )
  })),
  setActiveResultPanel: (panel) => {
    console.log("setting that active result panel", panel);
    set({ activeResultPanel: panel })
  },
  setMiniStatus: (config) => {
    if (config) {
      const defaults = { displayRegion: null, showSpinner: false, message: "", onConfirm: null };
      set((state) => ({miniStatus: {...defaults, ...config}}))
    } else {
      set((state) => ({ miniStatus: null }))
    }
  }
}))

export default useStore
