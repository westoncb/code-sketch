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
      // Your core pseudocode/sketch goes here. Comments will be  interpreted as messages to the LLM reading
      // your spec and generating your code.
      //
      // A good approach is to sketch the essential ideas/approaches/structures in your code, adhering to a
      // specific/valid syntax only as much as you desire: the goal is just to communicate your intentions to
      // an LLM.
  </sketch>
</code_sketch>`;

const testSketch = `<code_sketch>
  [purpose]: to act as an abstraction over a variety of possible LLM 'services,' which might be network APIs like OpenAI or Anthropic or OpenRouter, or might be some method of invoking an LLM locally—perhaps through a shell command invoking Ollama.
  [target_lang]: Typescript
  [custom_hints]: {
      comments: terse but fairly complete
      styleInspiration: react core source code
  }


  <sketch>
      // general note: should be stateful on whether user has selected, OpenAI, Anthropic, or Ollama, in addition to the selected model. If the user wants to use Ollama we should start it up by using "ollama run \${ model_name }" so it's ready to go by inference time. Should use node's "child - process" system for Ollama interaction.

      class LLM {
          // insert: enum for LLM providers; choose appropriate name. Should include entries for OpenAI, and Anthropic
          // insert: BaseConfig, OpenAIConfig, AnthropicConfig, and OllamaConfig types
          // insert: an "InferenceResult" type, has an id, result, and indicates error vs success

          constructor() {
              // should build up an API keys map by reading from a .env file where we have an entry for OpenAI and one for Anthropic; ollama doesn't require a key
          }

          infer(prompt, systemPrompt, config: LLMConfig /*not sure how to handle this type-wise since the type depends on the selected provider.. maybe we should have something like LLMConfig<Provider> ?*/) {
              // the config param should have sensible defaults when user doesn't explicitly define something
          }

          selectLLM(provider, model)
                        getActiveInferences() // should return an array of Promise<InferenceResult> for each still-running inference
                        getErrorInferences()
                        removeErrorInference(id)
                        cancelInference(id)
                        restartInference(id)
                    }
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
  sketch: testSketch,
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
