import { config } from 'dotenv';
import { exec, spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import {
  LLMProvider,
  BaseConfig,
  OpenAIConfig,
  AnthropicConfig,
  OllamaConfig,
  LLMConfig,
  InferenceResult,
} from "@code-sketch/shared-types";
import axios from 'axios';

const execAsync = promisify(exec);

interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

class LLM {
  private apiKeys: Map<LLMProvider, string>;
  private activeProvider: LLMProvider | null = null;
  private activeModel: string | null = null;
  private activeInferences: Map<string, Promise<InferenceResult>> = new Map();
  private readonly ollamaApiUrl = 'http://localhost:11434/api';

  constructor() {
    config(); // Load environment variables
    this.apiKeys = new Map([
      [LLMProvider.OpenAI, process.env.OPENAI_API_KEY || ''],
      [LLMProvider.Anthropic, process.env.ANTHROPIC_API_KEY || ''],
    ]);
  }

  async infer<T extends LLMProvider>(
    prompt: string,
    systemPrompt: string,
    config: Partial<LLMConfig<T>> = {}
  ): Promise<InferenceResult> {
    if (!this.activeProvider || !this.activeModel) {
      throw new Error('No LLM provider or model selected');
    }

    const inferenceId = Date.now().toString();
    const inferencePromise = this.runInference(prompt, systemPrompt, config as LLMConfig<T>);
    this.activeInferences.set(inferenceId, inferencePromise);

    const result = await inferencePromise;
    this.activeInferences.delete(inferenceId);
    return result;
  }

  private async runInference<T extends LLMProvider>(
    prompt: string,
    systemPrompt: string,
    config: LLMConfig<T>
  ): Promise<InferenceResult> {
    // Implementation depends on the active provider
    switch (this.activeProvider) {
      case LLMProvider.OpenAI:
        return this.inferOpenAI(prompt, systemPrompt, config as OpenAIConfig);
      case LLMProvider.Anthropic:
        return this.inferAnthropic(prompt, systemPrompt, config as AnthropicConfig);
      case LLMProvider.Ollama:
        return this.inferOllama(prompt, systemPrompt, config as OllamaConfig);
      default:
        throw new Error('Unsupported LLM provider');
    }
  }

  private async inferOpenAI(prompt: string, systemPrompt: string, config: OpenAIConfig): Promise<InferenceResult> {
    // OpenAI API implementation goes here
    throw new Error('OpenAI inference not implemented');
  }

  private async inferAnthropic(prompt: string, systemPrompt: string, config: AnthropicConfig): Promise<InferenceResult> {
    // Anthropic API implementation goes here
    throw new Error('Anthropic inference not implemented');
  }

  private async inferOllama(prompt: string, systemPrompt: string, config: OllamaConfig): Promise<InferenceResult> {
    try {
      const { stdout } = await execAsync(`echo "${prompt}" | ollama run ${config.model}`);
      return { id: Date.now().toString(), result: stdout };
    } catch (error) {
      return { id: Date.now().toString(), error: (error as Error).message };
    }
  }

    async selectLLM(provider: LLMProvider, modelName: string): Promise<boolean> {
        try {
          if (provider === LLMProvider.Ollama) {
            // Check if the model is available locally
            const isAvailable = await this.isModelAvailableLocally(modelName);
            if (!isAvailable) {
              throw new Error(`Model ${modelName} is not available locally. Please download it first.`);
            }

            // Set the active provider and model
            this.activeProvider = provider;
            this.activeModel = modelName;
            console.log(`Selected model: ${modelName}`);

            console.log(await this.generateText("yo yo whaddup whaddup!"));

            // Load the model
            await this.loadModel(modelName);

            return true;
          } else {
            throw new Error(`Provider ${provider} is not supported.`);
          }
        } catch (error) {
          console.error(`Error selecting LLM: ${error}`);
          return false;
        }
      }

      private async isModelAvailableLocally(modelName: string): Promise<boolean> {
        try {
          const tagsResponse = await axios.get(`${this.ollamaApiUrl}/tags`);
          const availableModels = tagsResponse.data.models;

          if (availableModels.includes(modelName)) {
            return true;
          }

          await axios.post(`${this.ollamaApiUrl}/show`, { name: modelName });
          return true;
        } catch (error) {
          return false;
        }
      }

      private async loadModel(modelName: string): Promise<void> {
        try {
          // Use a simple prompt to load the model
          const response = await axios.post<GenerateResponse>(`${this.ollamaApiUrl}/generate`, {
            model: modelName,
            prompt: "Hello",
            stream: false
          });

          if (response.data.done) {
            console.log(`Model ${modelName} loaded successfully.`);
          } else {
            throw new Error(`Failed to load model ${modelName}`);
          }
        } catch (error) {
          console.error(`Error loading model: ${error}`);
          throw error;
        }
      }

      async generateText(prompt: string): Promise<string> {
        if (!this.activeProvider || !this.activeModel) {
          throw new Error("No active LLM selected. Call selectLLM first.");
        }

        if (this.activeProvider !== LLMProvider.Ollama) {
          throw new Error("Only Ollama is supported for now");
        }

        try {
          const response = await axios.post<GenerateResponse>(`${this.ollamaApiUrl}/generate`, {
            model: this.activeModel,
            prompt: prompt,
            stream: false
          });

          return response.data.response;
        } catch (error) {
          console.error(`Error generating text: ${error}`);
          throw error;
        }
      }

      async listModels(): Promise<string[]> {
        try {
          const response = await axios.get(`${this.ollamaApiUrl}/tags`);
          return response.data.models;
        } catch (error) {
          console.error(`Error listing models: ${error}`);
          throw error;
        }
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
}

export default LLM;
