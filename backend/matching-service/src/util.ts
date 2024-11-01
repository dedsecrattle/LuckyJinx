import axios from "axios";
const fetchRandomQuestion = async (complexity: string, categories: string) => {
  const response = await axios.post("http://question:3002/random", {
    complexity,
    categories,
  });
  return response.data;
};

export { fetchRandomQuestion };
