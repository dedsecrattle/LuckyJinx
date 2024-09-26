//import axios from "axios";
import { Question } from "../models/question.model";
import { mockQuestions } from "../constants/mock_questions";

export default class QuestionService {
  static async getQuestions(): Promise<Question[]> {
    try {
      //   const response = await axios.get("/api/questions");
      //   return response.data;
      return mockQuestions;
    } catch (error) {
      throw new Error("Failed to fetch questions");
    }
  }
}
