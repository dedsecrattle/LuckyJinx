import express from 'express';
import { getHint, getCodeComplexity, getModelAnswer } from '../services/hintService.js';

const router = express.Router();

// Endpoint to get hint for a question
router.get('/hint/:questionId', async (req, res) => {
  const { questionId } = req.params;
  try {
    const hint = await getHint(questionId);
    res.json({ hint });
  } catch (error) {
    console.error('Error fetching hint:', error);
    res.status(500).json({ error: 'Failed to fetch hint.' });
  }
});

// Endpoint to get code complexity analysis
router.post('/code-complexity', async (req, res) => {
  const { code } = req.body;
  try {
    const complexity = await getCodeComplexity(code);
    res.json({ complexity });
  } catch (error) {
    console.error('Error fetching code complexity:', error);
    res.status(500).json({ error: 'Failed to fetch code complexity analysis.' });
  }
});

// Endpoint to get model answer
router.post('/model-answer', async (req, res) => {
  const { questionId, language } = req.body;
  try {
    const answer = await getModelAnswer(questionId, language);
    res.json({ answer });
  } catch (error) {
    console.error('Error fetching model answer:', error);
    res.status(500).json({ error: 'Failed to fetch model answer.' });
  }
});

export { router };
