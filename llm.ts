import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

enum LLMProvider {
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
}

type OpenAIConfig = {
  model: string;
  temperature?: number;
  max_tokens?: number;
};

type AnthropicConfig = {
  model: string;
  temperature?: number;
  max_tokens_to_sample?: number;
};

type LLMConfig = {
  [LLMProvider.OpenAI]?: OpenAIConfig;
  [LLMProvider.Anthropic]?: AnthropicConfig;
};

type InferenceResult = {
  id: string;
  result?: string;
  error?: Error;
};

class LLM {
  private apiKeys: Map<LLMProvider, string>;
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private activeInferences: Map<string, Promise<InferenceResult>> = new Map();
  private errorInferences: Map<string, InferenceResult> = new Map();

  constructor(apiKeys: Map<LLMProvider, string>) {
    this.apiKeys = apiKeys;
    this.initializeClients();
  }

  private initializeClients() {
    if (this.apiKeys.has(LLMProvider.OpenAI)) {
      this.openai = new OpenAI({
        apiKey: this.apiKeys.get(LLMProvider.OpenAI)!,
      });
    }
    if (this.apiKeys.has(LLMProvider.Anthropic)) {
      this.anthropic = new Anthropic({
        apiKey: this.apiKeys.get(LLMProvider.Anthropic)!,
      });
    }
  }

  async infer(
    prompt: string,
    systemPrompt: string,
    config: Partial<LLMConfig> = {},
  ): Promise<InferenceResult> {
    const id = Math.random().toString(36).substring(7);
    const inferencePromise = this.runInference(
      id,
      prompt,
      systemPrompt,
      config,
    );
    this.activeInferences.set(id, inferencePromise);

    try {
      const result = await inferencePromise;
      this.activeInferences.delete(id);
      return result;
    } catch (error) {
      const errorResult: InferenceResult = { id, error: error as Error };
      this.errorInferences.set(id, errorResult);
      this.activeInferences.delete(id);
      return errorResult;
    }
  }

  private async runInference(
    id: string,
    prompt: string,
    systemPrompt: string,
    config: Partial<LLMConfig>,
  ): Promise<InferenceResult> {
    if (config[LLMProvider.OpenAI] && this.openai) {
      return this.runOpenAIInference(
        id,
        prompt,
        systemPrompt,
        config[LLMProvider.OpenAI],
      );
    } else if (config[LLMProvider.Anthropic] && this.anthropic) {
      return this.runAnthropicInference(
        id,
        prompt,
        systemPrompt,
        config[LLMProvider.Anthropic],
      );
    } else {
      throw new Error("No valid LLM provider configuration found");
    }
  }

  private async runOpenAIInference(
    id: string,
    prompt: string,
    systemPrompt: string,
    config: Partial<OpenAIConfig>,
  ): Promise<InferenceResult> {
    const response = await this.openai!.chat.completions.create({
      model: config.model || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: config.temperature ?? 0.7,
      max_tokens: config.max_tokens,
    });

    return { id, result: response.choices[0].message.content || "" };
  }

  private async runAnthropicInference(
    id: string,
    prompt: string,
    systemPrompt: string,
    config: Partial<AnthropicConfig>,
  ): Promise<InferenceResult> {
    const response = await this.anthropic!.completions.create({
      model: config.model || "claude-2",
      prompt: `${systemPrompt}\n\nHuman: ${prompt}\n\nAssistant:`,
      temperature: config.temperature ?? 0.7,
      max_tokens_to_sample: config.max_tokens_to_sample,
    });

    return { id, result: response.completion };
  }

  getActiveInferences(): Promise<InferenceResult>[] {
    return Array.from(this.activeInferences.values());
  }

  getErrorInferences(): InferenceResult[] {
    return Array.from(this.errorInferences.values());
  }

  removeErrorInference(id: string): boolean {
    return this.errorInferences.delete(id);
  }

  cancelInference(id: string): boolean {
    const inference = this.activeInferences.get(id);
    if (inference) {
      this.activeInferences.delete(id);
      return true;
    }
    return false;
  }

  async restartInference(id: string): Promise<InferenceResult | null> {
    const errorInference = this.errorInferences.get(id);
    if (errorInference) {
      this.errorInferences.delete(id);
      return this.infer(errorInference.error!.message, "", {});
    }
    return null;
  }
}

export { LLM, LLMProvider, LLMConfig, InferenceResult };
