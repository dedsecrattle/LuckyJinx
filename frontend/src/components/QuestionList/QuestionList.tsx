import { ReactElement, useEffect, useState } from "react";
import styles from "./QuestionList.module.scss";
import { Question } from "../../models/question.model";
import QuestionService from "../../services/question.service";
import { useMainDialog } from "../../contexts/MainDialogContext";
import { Button } from "@mui/material";

const QuestionList = (): ReactElement => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<keyof Question>("questionId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const complexityOrder = ["Easy", "Medium", "Hard"];
  const getComplexityValue = (complexity: string) => complexityOrder.indexOf(complexity);

  const { setTitle, setContent, openDialog } = useMainDialog();

  const showQuestionDetails = (question: Question) => () => {
    setTitle(question.title);
    setContent(question.description);
    openDialog();
  };

  const fetchQuestions = async () => {
    try {
      const response = await QuestionService.getQuestions();
      setQuestions(response);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch questions");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleSort = (key: keyof Question) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);

    const sortedQuestions = [...questions].sort((a, b) => {
      if (key === "questionId") {
        const aId = parseInt(a[key]);
        const bId = parseInt(b[key]);
        return order === "asc" ? aId - bId : bId - aId;
      }

      if (key === "complexity") {
        const aValue = getComplexityValue(a.complexity);
        const bValue = getComplexityValue(b.complexity);
        return order === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (a[key] < b[key]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

    setQuestions(sortedQuestions);
  };

  return (
    <div className={styles.container}>
      <h1>Question Repository</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th
              onClick={() => handleSort("questionId")}
              className={`${styles.clickable} ${sortKey === "questionId" ? styles[sortOrder] : ""}`}
            >
              ID
            </th>
            <th
              onClick={() => handleSort("title")}
              className={`${styles.clickable} ${sortKey === "title" ? styles[sortOrder] : ""}`}
            >
              Title
            </th>
            <th>Categories</th>
            <th
              onClick={() => handleSort("complexity")}
              className={`${styles.clickable} ${sortKey === "complexity" ? styles[sortOrder] : ""}`}
            >
              Complexity
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.questionId}>
              <td>{question.questionId}</td>
              <td>
                <Button className={`${styles.questiontitle}`} onClick={showQuestionDetails(question)}>
                  {question.title}
                </Button>
              </td>
              <td>
                <div className={styles.tags}>
                  {question.categories.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className={styles.complexity}>{question.complexity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionList;
