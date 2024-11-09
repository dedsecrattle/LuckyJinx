import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// console.log('Environment Variables:', process.env);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in the environment variables.');
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${OPENAI_API_KEY}`,
};

export const getHintFromOpenAI = async (questionDescription: string): Promise<string> => {
  const prompt = `Provide a helpful hint for solving the following programming problem:\n\n${questionDescription}\n\nHint:`;

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.5,
    },
    { headers }
  );

  const hint = response.data.choices[0].message.content.trim();
  return hint;
};

export const getComplexityAnalysisFromOpenAI = async (code: string, language: string): Promise<string> => {
  const prompt = `Analyze the following ${language} code for its time and space complexity. Provide a detailed explanation.\n\nCode:\n${code}\n\nAnalysis:`;

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.5,
    },
    { headers }
  );

  const analysis = response.data.choices[0].message.content.trim();
  return analysis;
};

export const getModelAnswerFromOpenAI = async (questionDescription: string, language: string): Promise<string> => {
  const prompt = `Provide a correct and efficient ${language} solution for the following programming problem:\n\n${questionDescription}\n\nSolution:`;

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.3,
    },
    { headers }
  );

  const modelAnswer = response.data.choices[0].message.content.trim();
  return modelAnswer;
};
