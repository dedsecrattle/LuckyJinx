import axios from "axios";
import { Question, QuestionComplexity } from "../models/question.model";
import { QuestionValidationError, verifyNewQuestion } from "../util/question.helper";
//import { mockQuestions } from "../constants/mock_questions";

export default class QuestionService {
  static async getQuestions(): Promise<Question[]> {
    try {
      const response = await axios.get("/api/questions");
      return response.data;
      // return mockQuestions;
    } catch (error) {
      throw new Error("Failed to fetch questions");
    }
  }

  static async addQuestion(
    id: string,
    title: string,
    description: string,
    categoriesString: string,
    complexity: QuestionComplexity,
    link: string,
  ): Promise<any> {
    try {
      const body = verifyNewQuestion(id, title, description, categoriesString, complexity, link);
      const response = await axios.post("/api/questions", body);
      return response.data;
    } catch (error) {
      if (error instanceof QuestionValidationError) {
        throw error;
      }
      throw new Error("Failed to add question");
    }
  }

  static async editQuestion(
    id: string,
    title: string,
    description: string,
    categoriesString: string,
    complexity: QuestionComplexity,
    link: string,
  ): Promise<any> {
    const body = verifyNewQuestion(id, title, description, categoriesString, complexity, link);
    const response = await axios.put(`/api/questions/${id}`, body);
    return response.data;
  }

  static async deleteQuestion(id: string): Promise<any> {
    try {
      const response = await axios.delete(`/api/questions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to add question");
    }
  }
}
