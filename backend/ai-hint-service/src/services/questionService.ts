import axios from 'axios';

const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost/api/questions';

export const fetchQuestionById = async (questionId: Number): Promise<any> => {
  try {
    const response = await axios.get(`${QUESTION_SERVICE_URL}/${questionId}`);
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
};
