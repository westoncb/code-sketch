import {create} from 'zustand';
import { ContextItem, ResultPanel, MiniStatusConfig } from "../client-types";

const codeSketchTemplate = `<code_sketch>
  [overview]:
  [target_lang]:
  [custom_hints]: {
      comments: terse but fairly complete
      // Insert any additional: 'code_property: desired value'
  }

  <sketch>
      // Your core pseudocode/sketch goes here. Comments will be interpreted as messages to the LLM reading
      // your spec and generating your code.
      //
      // A good approach is to sketch the essential ideas/approaches/structures in your code, adhering to a
      // specific/valid syntax only as much as you desire: the goal is just to communicate your intentions to
      // an LLM.
  </sketch>
</code_sketch>`;

// Define the store state type
interface StoreState {
  sketch: string
  review: string
  code: string
  context: ContextItem[]
  activeResultPanel: ResultPanel
  miniStatus: MiniStatusConfig

  // Actions
  setSketch: (sketch: string) => void
  setReview: (review: string) => void
  setCode: (code: string) => void
  addContextItem: (item: ContextItem) => void
  removeContextItem: (index: number) => void
  updateContextItem: (index: number, item: Partial<ContextItem>) => void
  setActiveResultPanel: (panel: ResultPanel) => void
  setMiniStatus: (config: MiniStatusConfig) => void
}

const useStore = create<StoreState>((set) => ({
  sketch: codeSketchTemplate,
  review: '',
  code: '',
  context: [],
  activeResultPanel: ResultPanel.waiting,
  miniStatus: null,

  // Actions
  setSketch: (sketch) => set({ sketch }),
  setReview: (review) => set({ review }),
  setCode: (code) => set({ code }),
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
