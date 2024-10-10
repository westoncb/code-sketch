export enum LLMProvider {
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
  Ollama = "Ollama",
}

export interface BaseConfig {
  maxTokens?: number;
  temperature?: number;
}

export interface OpenAIConfig extends BaseConfig {
  model: string;
}

export interface AnthropicConfig extends BaseConfig {
  model: string;
}

export interface OllamaConfig extends BaseConfig {
  model: string;
}

export type LLMConfig<T extends LLMProvider> = T extends LLMProvider.OpenAI
  ? OpenAIConfig
  : T extends LLMProvider.Anthropic
    ? AnthropicConfig
    : T extends LLMProvider.Ollama
      ? OllamaConfig
      : never;

export interface InferenceResult {
  id: string;
  result?: string;
  error?: string;
}
