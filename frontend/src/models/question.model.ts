export interface Question {
  questionId: string;
  title: string;
  description: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
  link: string;
}
