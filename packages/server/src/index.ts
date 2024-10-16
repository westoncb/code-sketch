import express from 'express';
import asyncHandler from 'express-async-handler';
import { LLMProvider, LLMConfig } from '@code-sketch/shared-types';
import LLM from './LLM.js';

const app = express();
const llm = new LLM();

app.use(express.json());

app.get('/api/available-models', asyncHandler(async (req, res) => {
  const provider = req.query.provider as string;
  if (!provider || !Object.values(LLMProvider).includes(provider as LLMProvider)) {
    res.status(400).json({ error: 'Invalid provider' });
    return;
  }
  const models = await llm.getAvailableModels(provider as LLMProvider);
  res.json({ models });
}));

app.post('/api/load-ollama-model', asyncHandler(async (req, res) => {
  const { model } = req.body;
  if (!model) {
    res.status(400).json({ error: 'Model name is required' });
    return;
  }
  try {
    await llm.loadOllamaModel(model);
    res.json({ message: 'Ollama model loaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load Ollama model', details: error.message });
  }
}));

app.post('/api/infer', asyncHandler(async (req, res) => {
  const { prompt, systemPrompt="", config } = req.body;
  if (!prompt || !config) {
    const wereNull = [];
    if (!prompt) wereNull.push("prompt");
    if (!config) wereNull.push("config");

    res.status(400).json({ error: 'prompt, systemPrompt, and config are required; null items:' + JSON.stringify(wereNull) });
    return;
  }
  try {
    const result = await llm.infer(prompt, systemPrompt, config as LLMConfig);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Inference failed', details: error.message });
    console.error("Config used: ", config);
  }
}));

app.use((error, req, res, next) => {
  if (res.headersSent) {
    console.log('Headers already sent, passing to default error handler');
    return next(error);
  }

  const responseBody = {
    error: error.message || 'An unexpected error occurred'
  };

  res.status(500).json(responseBody);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await llm.cleanup();
  process.exit();
});

export default app;
