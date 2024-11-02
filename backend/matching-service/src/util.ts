import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();
const fetchRandomQuestion = async (complexity: string, categories: string) => {
  const response = await axios.post(`${process.env.QUESTION_SERVICE}/random`, {
    complexity,
    categories,
  });
  return response.data;
};

export { fetchRandomQuestion };
