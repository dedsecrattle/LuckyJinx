import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL_ENDPOINT = 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat'; // Replace with your model's endpoint

// Generic function to query Hugging Face model
const queryModel = async (payload: any) => {
  try {
    const response = await axios.post(MODEL_ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const err = error as any;
    console.error('Error querying Hugging Face model:', err.response?.data || err.message);
    throw error;
  }
};

// Function to get hint based on questionId
export const getHint = async (questionId: string): Promise<string> => {
  // You might need to fetch question details from your question service
  // For simplicity, let's assume you have the question text
  console.log('Fetching hint for questionIdxxxxx:', questionId);
  const questionText = await fetchQuestionText(questionId); // Implement this function as needed
  console.log('Fetched question text:', questionText);
  const prompt = `Provide a helpful hint for the following programming question:\n\n${questionText}`;
  console.log('Hint prompt:', prompt);
  const result = await queryModel({ inputs: prompt });
  console.log('Hint result:', result);
  
  // Parse the response based on Hugging Face's API
  return result.generated_text || 'No hint available.';
};

// Function to get code complexity analysis
export const getCodeComplexity = async (code: string): Promise<string> => {
  const prompt = `Analyze the complexity of the following code and provide a detailed explanation:\n\n${code}`;

  const result = await queryModel({ inputs: prompt });

  return result.generated_text || 'No analysis available.';
};

// Function to get model answer based on questionId and language
export const getModelAnswer = async (questionId: string, language: string): Promise<string> => {
  // Fetch question details as needed
  const questionText = await fetchQuestionText(questionId); // Implement this function as needed

  const prompt = `Provide a sample solution in ${language} for the following programming question:\n\n${questionText}`;

  const result = await queryModel({ inputs: prompt });

  return result.generated_text || 'No model answer available.';
};

// Placeholder function to fetch question text
const fetchQuestionText = async (questionId: string): Promise<string> => {
  // Implement API call to your question service to get the question text
  // For example:
  try {
    // QUESTION_SERVICE_URL=http://question:3002/
    const response = await axios.get(`http://question:3002/${questionId}`);
    console.log('Fetched question text:', response.data.description);
    return response.data.description;
  } catch (error) {
    console.error('Error fetching question text:', error);
    throw new Error('Failed to fetch question text.');
  }
};
