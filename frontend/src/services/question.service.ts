import axios from "axios";
import { Question, QuestionComplexity } from "../models/question.model";
import { verifyNewQuestion } from "../util/question.helper";

export default class QuestionService {
  static async getQuestions(): Promise<Question[]> {
    const response = await axios.get("/api/questions");
    return response.data;
  }

  static async addQuestion(
    id: number,
    title: string,
    description: string,
    categoriesString: string,
    complexity: QuestionComplexity,
    link: string,
  ): Promise<any> {
    const body = verifyNewQuestion(id, title, description, categoriesString, complexity, link);
    const response = await axios.post("/api/questions", body);
    return response.data;
  }

  static async editQuestion(
    id: number,
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

  static async deleteQuestion(id: number): Promise<any> {
    const response = await axios.delete(`/api/questions/${id}`);
    return response.data;
  }
}
