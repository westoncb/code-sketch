import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import ollama from 'ollama';
import { LLMProvider, InferenceResult, AnthropicModels, OpenAIModels, LLMConfig } from '@code-sketch/shared-types';

interface OllamaConfig {
  model: string;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

interface OpenAIConfig {
  model: string;
  temperature: number;
  max_tokens: number;
}

interface AnthropicConfig {
  model: string;
  max_tokens: number;
  temperature: number;
}

class LLM {
  private apiKeys: Map<LLMProvider, string>;
  private anthropicClient: Anthropic | null = null;
  private openaiClient: OpenAI | null = null;
  private activeOllamaModel: string | null = null;

  constructor() {
    config(); // Load environment variables
    this.apiKeys = new Map([
      [LLMProvider.OpenAI, process.env.OPENAI_API_KEY || ''],
      [LLMProvider.Anthropic, process.env.ANTHROPIC_API_KEY || ''],
    ]);

    if (this.apiKeys.get(LLMProvider.Anthropic)) {
      this.anthropicClient = new Anthropic({
        apiKey: this.apiKeys.get(LLMProvider.Anthropic),
      });
    }

    if (this.apiKeys.get(LLMProvider.OpenAI)) {
      this.openaiClient = new OpenAI({
        apiKey: this.apiKeys.get(LLMProvider.OpenAI),
      });
    }
  }

  async getAvailableModels(provider: LLMProvider): Promise<string[]> {
    switch (provider) {
      case LLMProvider.Ollama:
        return this.listOllamaModels();
      case LLMProvider.OpenAI:
        return OpenAIModels;
      case LLMProvider.Anthropic:
        return AnthropicModels;
      default:
        throw new Error('Unsupported provider');
    }
  }

  async infer(prompt: string, systemPrompt: string, config: LLMConfig): Promise<InferenceResult> {
    switch (config.provider) {
      case LLMProvider.OpenAI:
        return this.inferOpenAI(prompt, systemPrompt, this.mapToOpenAIConfig(config));
      case LLMProvider.Anthropic:
        return this.inferAnthropic(prompt, systemPrompt, this.mapToAnthropicConfig(config));
      case LLMProvider.Ollama:
        return this.inferOllama(prompt, systemPrompt, this.mapToOllamaConfig(config));
      default:
        throw new Error('Unsupported LLM provider');
    }
  }

  private mapToOpenAIConfig(config: LLMConfig): OpenAIConfig {
    return {
      model: config.model,
      temperature: config.temp,
      max_tokens: config.maxTokens,
    };
  }

  private mapToAnthropicConfig(config: LLMConfig): AnthropicConfig {
    return {
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temp,
    };
  }

  private mapToOllamaConfig(config: LLMConfig): OllamaConfig {
    return {
      model: config.model,
      options: {
        temperature: config.temp,
        num_predict: config.maxTokens,
      },
    };
  }

  private async inferOpenAI(prompt: string, systemPrompt: string, config: OpenAIConfig): Promise<InferenceResult> {
    // Implementation to be added later
    throw new Error('OpenAI inference not implemented');
  }

  private async inferAnthropic(prompt: string, systemPrompt: string, config: AnthropicConfig): Promise<InferenceResult> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized');
    }

    try {
      const message = await this.anthropicClient.messages.create({
        ...config,
        system: systemPrompt,
        messages: [
          { role: 'user', content: prompt }
        ]
      });

      return {
        id: message.id,
        result: message.content[0].type === 'text' ? message.content[0].text : 'Anthropic returned non-text content',
      };
    } catch (error) {
      console.error('Error during Anthropic inference:', error);
      console.error("config:", config, "system: ", systemPrompt, "prompt", prompt);
      throw error;
    }
  }

  private async inferOllama(prompt: string, systemPrompt: string, config: OllamaConfig): Promise<InferenceResult> {
    try {
      const response = await ollama.generate({
        model: config.model,
        prompt,
        system: systemPrompt,
        options: config.options,
        stream: false
      });

      return {
        id: Date.now().toString(),
        result: response.response,
      };
    } catch (error) {
      console.error('Error during Ollama inference:', error);
      throw error;
    }
  }

  async loadOllamaModel(model: string): Promise<void> {
    try {
      await ollama.generate({
        model,
        prompt: '',
      });
      console.log(`Model ${model} loaded successfully.`);
      this.activeOllamaModel = model;
    } catch (error) {
      console.error(`Error loading Ollama model: ${error}`);
      throw error;
    }
  }

  private async listOllamaModels(): Promise<string[]> {
    try {
      const response = await ollama.list();
      return response.models.map(m => m.name);
    } catch (error) {
      console.error(`Error listing Ollama models: ${error}`);
      throw error;
    }
  }

  async unloadOllamaModel(): Promise<void> {
    if (!this.activeOllamaModel) {
      console.log("No active Ollama model to unload.");
      return;
    }

    try {
      await ollama.generate({
        model: this.activeOllamaModel,
        prompt: '',
        keep_alive: '0s',
      });
      console.log(`Model ${this.activeOllamaModel} unloaded successfully.`);
      this.activeOllamaModel = null;
    } catch (error) {
      console.error(`Error unloading Ollama model: ${error}`);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    await this.unloadOllamaModel();
    // Any other cleanup operations can be added here if needed in the future
  }
}

export default LLM;
