import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, InferenceResult, AnthropicModels, OpenAIModels } from '@code-sketch/shared-types';
import axios from 'axios';

class LLM {
  private apiKeys: Map<LLMProvider, string>;
  private activeProvider: LLMProvider | null = null;
  private activeModel: string | null = null;
  private activeInferences: Map<string, Promise<InferenceResult>> = new Map();
  private readonly ollamaApiUrl = 'http://localhost:11434/api';
  private anthropicClient: Anthropic | null = null;

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
  }

  async getAvailableModels(provider: LLMProvider): Promise<string[]> {
    switch (provider) {
      case LLMProvider.Ollama:
        return this.listModels();
      case LLMProvider.OpenAI:
        return OpenAIModels;
      case LLMProvider.Anthropic:
        return AnthropicModels;
      default:
        throw new Error('Unsupported provider');
    }
  }

  async infer(prompt: string, systemPrompt: string): Promise<InferenceResult> {
    if (!this.activeProvider || !this.activeModel) {
      throw new Error('No LLM provider or model selected');
    }

    const inferenceId = Date.now().toString();
    const inferencePromise = this.runInference(prompt, systemPrompt);
    this.activeInferences.set(inferenceId, inferencePromise);

    const result = await inferencePromise;
    this.activeInferences.delete(inferenceId);
    return result;
  }

  private async runInference(prompt: string, systemPrompt: string): Promise<InferenceResult> {
    switch (this.activeProvider) {
      case LLMProvider.OpenAI:
        return this.inferOpenAI(prompt, systemPrompt);
      case LLMProvider.Anthropic:
        return this.inferAnthropic(prompt, systemPrompt);
      case LLMProvider.Ollama:
        return this.inferOllama(prompt, systemPrompt);
      default:
        throw new Error('Unsupported LLM provider');
    }
  }

  private async inferOpenAI(prompt: string, systemPrompt: string): Promise<InferenceResult> {
    // OpenAI API implementation goes here
    throw new Error('OpenAI inference not implemented');
  }

  private async inferAnthropic(prompt: string, systemPrompt: string): Promise<InferenceResult> {
    if (!this.anthropicClient) {
      throw new Error('Anthropic client not initialized');
    }

    try {
      const message = await this.anthropicClient.messages.create({
        model: this.activeModel as Anthropic.MessageCreateParams['model'],
        max_tokens: 4096,
        messages: [
          { role: 'user', content: systemPrompt + "\n\n" + prompt }
        ],
        temperature: 0.7,
      });

      return {
        id: message.id,
        result: message.content[0].type === 'text' ? message.content[0].text : '',
      };
    } catch (error) {
      console.error('Error during Anthropic inference:', error);
      throw error;
    }
  }

  private async inferOllama(prompt: string, systemPrompt: string): Promise<InferenceResult> {
    try {
      const response = await axios.post<{ response: string }>(`${this.ollamaApiUrl}/generate`, {
        model: this.activeModel,
        prompt: `${systemPrompt}\n\n${prompt}`,
        stream: false
      });

      return {
        id: Date.now().toString(),
        result: response.data.response,
      };
    } catch (error) {
      console.error('Error during Ollama inference:', error);
      throw error;
    }
  }

  async selectLLM(provider: LLMProvider, modelName: string): Promise<boolean> {
    try {
      const availableModels = await this.getAvailableModels(provider);
      if (!availableModels.includes(modelName)) {
        throw new Error(`Model ${modelName} is not available for ${provider}.`);
      }

      this.activeProvider = provider;
      this.activeModel = modelName;
      console.log(`Selected ${provider} model: ${modelName}`);

      return true;
    } catch (error) {
      console.error(`Error selecting LLM: ${error}`);
      return false;
    }
  }

  getSelectedLLM() {
    return {
      provider: this.activeProvider,
      modelName: this.activeModel
    }
  }

  private async listModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.ollamaApiUrl}/tags`);
      return response.data.models.map(m => m.name);
    } catch (error) {
      console.error(`Error listing models: ${error}`);
      throw error;
    }
  }

  getActiveInferences(): Promise<InferenceResult>[] {
    return Array.from(this.activeInferences.values());
  }

  async getErrorInferences(): Promise<InferenceResult[]> {
    const results = await Promise.all(Array.from(this.activeInferences.values()));
    return results.filter(inference => inference.error !== undefined);
  }

  removeErrorInference(id: string): void {
    this.activeInferences.delete(id);
  }

  async unloadModel(): Promise<void> {
    if (!this.activeModel) {
      console.log("No active model to unload.");
      return;
    }

    try {
      await axios.delete(`${this.ollamaApiUrl}/delete`, {
        data: { name: this.activeModel }
      });
      console.log(`Model ${this.activeModel} unloaded successfully.`);
      this.activeModel = null;
      this.activeProvider = null;
    } catch (error) {
      console.error(`Error unloading model: ${error}`);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    await this.unloadModel();
  }
}

export default LLM;
