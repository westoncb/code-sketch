export enum LLMProvider {
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
  Ollama = "Ollama",
}

export interface LLMConfig {
  provider: LLMProvider,
  model: string
  temp: number
  maxTokens: number
}

export interface InferenceResult {
  id: string;
  result?: string;
  error?: string;
}

export const AnthropicModels = [
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20240229',
  'claude-3-haiku-20240307',
  'claude-3-sonnet-20240229'
];

export type AnthropicModel = typeof AnthropicModels[number];


export const OpenAIModels = ['gpt-4o', 'gpt-4o-mini', 'gpt-4', 'gpt-4-turbo', 'o1-mini', 'o1-preview'];

export type OpenAIModel = typeof OpenAIModels[number];
