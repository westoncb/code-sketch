import express from 'express';
import { LLMProvider } from '@code-sketch/shared-types';
import LLM from './LLM';

const app = express();
const llm = new LLM();

app.use(express.json());

app.post('/api/select-model', async (req, res) => {
  try {
    const { provider, modelName } = req.body;
    const success = await llm.selectLLM(provider as LLMProvider, modelName);
    if (success) {
      res.json({ message: 'Model selected successfully' });
    } else {
      res.status(500).json({ error: 'Failed to select model' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

app.post('/infer', async (req, res) => {
  try {
    const { prompt, systemPrompt, config } = req.body;
    const result = await llm.infer(prompt, systemPrompt, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  // I don't think this works..
  await llm.cleanup();
  process.exit();
});
