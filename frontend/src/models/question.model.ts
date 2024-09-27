export type QuestionComplexity = "Easy" | "Medium" | "Hard";

export interface Question {
  questionId: string;
  title: string;
  description: string;
  categories: string[];
  complexity: QuestionComplexity;
  link: string;
}
