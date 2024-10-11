import express from 'express';
import asyncHandler from 'express-async-handler';
import { LLMProvider } from '@code-sketch/shared-types';
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

app.post('/api/select-model', asyncHandler(async (req, res) => {
  const { provider, modelName } = req.body;
  const success = await llm.selectLLM(provider as LLMProvider, modelName);
  if (success) {
    res.json({ message: 'Model selected successfully' });
  } else {
    res.status(500).json({ error: 'Failed to select model' });
  }
}));

app.post('/api/infer', asyncHandler(async (req, res) => {
  const { prompt, systemPrompt} = req.body;
  const result = await llm.infer(prompt, systemPrompt);
  res.json(result);
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await llm.cleanup();
  process.exit();
});

export default app;
