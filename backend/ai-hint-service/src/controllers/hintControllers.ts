import { Request, Response } from 'express';
import { fetchQuestionById } from '../services/questionService.js'; 
import { getHintFromOpenAI, getComplexityAnalysisFromOpenAI, getModelAnswerFromOpenAI } from '../services/openaiService.js';

// GET /api/ai-hint/hint/:questionId
export const getHint = async (req: Request, res: Response) => {
  const { questionId } = req.params;

  try {
    const question = await fetchQuestionById(Number(questionId));
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    console.log('Question:', question);

    const hint = await getHintFromOpenAI(question.description);
    res.status(200).json({ hint });
  } catch (error) {
    console.error('Error fetching hint:', error);
    res.status(500).json({ error: 'Failed to fetch hint.' });
  }
};

// POST /api/ai-hint/complexity
export const getComplexityAnalysis = async (req: Request, res: Response) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required.' });
  }

  try {
    // Get complexity analysis from OpenAI
    const analysis = await getComplexityAnalysisFromOpenAI(code, language);
    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error fetching complexity analysis:', error);
    res.status(500).json({ error: 'Failed to fetch complexity analysis.' });
  }
};

// GET /api/ai-hint/model-answer/:questionId
export const getModelAnswer = async (req: Request, res: Response) => {
  const { questionId } = req.params;

  try {
    // Fetch question details if needed
    const question = await fetchQuestionById(Number(questionId));
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    // Get model answer from OpenAI
    const modelAnswer = await getModelAnswerFromOpenAI(question.description, question.language);
    res.status(200).json({ modelAnswer });
  } catch (error) {
    console.error('Error fetching model answer:', error);
    res.status(500).json({ error: 'Failed to fetch model answer.' });
  }
};
