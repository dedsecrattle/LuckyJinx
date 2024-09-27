import { ReactElement, useEffect, useState } from "react";
import { Button, IconButton, Typography } from "@mui/material";
import { DeleteForever, EditNote, OpenInNew } from "@mui/icons-material";
import { useMainDialog } from "../../contexts/MainDialogContext";
import styles from "./QuestionList.module.scss";
import { Question, QuestionComplexity } from "../../models/question.model";
import QuestionDialog from "../QuestionDialog/QuestionDialog";
import QuestionService from "../../services/question.service";

const QuestionList = (): ReactElement => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<keyof Question>("questionId");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const complexityOrder = ["Easy", "Medium", "Hard"];
  const getComplexityValue = (complexity: string) => complexityOrder.indexOf(complexity);

  const { setTitle, setContent, openDialog } = useMainDialog();

  const [isAddNew, setIsAddNew] = useState<boolean>(true);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState<boolean>(false);
  const [newQuestionId, setNewQuestionId] = useState<string>("");
  const [newQuestionTitle, setNewQuestionTitle] = useState<string>("");
  const [newQuestionDescription, setNewQuestionDescription] = useState<string>("");
  const [newQuestionCategories, setNewQuestionCategories] = useState<string[]>([]);
  const [newQuestionComplexity, setNewQuestionComplexity] = useState<QuestionComplexity>("Easy");
  const [newQuestionLink, setNewQuestionLink] = useState<string>("");

  const openQuestionDialog = (question: Question | null) => {
    setIsAddNew(!question);
    setNewQuestionId(question?.questionId ?? "");
    setNewQuestionTitle(question?.title ?? "");
    setNewQuestionDescription(question?.description ?? "");
    setNewQuestionCategories(question?.categories ?? []);
    setNewQuestionComplexity(question?.complexity ?? "Easy");
    setNewQuestionLink(question?.link ?? "");

    setIsQuestionDialogOpen(true);
  };

  const showQuestionDetails = (question: Question) => () => {
    setTitle(question.title);
    setContent(question.description);
    openDialog();
  };

  useEffect(() => {
    const dummyQuestions: Question[] = [
      {
        questionId: "1",
        title: "What is a Binary Search Tree?",
        description: "A binary search tree is a data structure for fast lookup, addition, and removal of items.",
        categories: ["Algorithms", "Data Structures"],
        complexity: "Medium",
        link: "#",
      },
      {
        questionId: "2",
        title: "Explain closures in JavaScript.",
        description: "Closures allow functions to access variables from an outer scope.",
        categories: ["JavaScript", "Functional Programming"],
        complexity: "Hard",
        link: "#",
      },
      {
        questionId: "3",
        title: "What is polymorphism in OOP?",
        description: "Polymorphism allows different objects to respond in various ways to the same method call.",
        categories: ["OOP"],
        complexity: "Easy",
        link: "#",
      },
      {
        questionId: "4",
        title: "Reverse a String",
        description: "Write a function that reverses a string, given as an array of characters.",
        categories: ["Strings", "Algorithms"],
        complexity: "Easy",
        link: "#",
      },
    ];

    setQuestions(dummyQuestions);
    setLoading(false);
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading questions...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
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
      <Typography variant="h4" align="center" gutterBottom>
        Question Repository
      </Typography>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.questionId}>
              <td>{question.questionId}</td>
              <td>
                <Button className={styles.questiontitle} onClick={showQuestionDetails(question)}>
                  {question.title}
                </Button>
                <a href={question.link} target="_blank" rel="noreferrer">
                  <IconButton>
                    <OpenInNew className={styles.questionlinkicon} color="primary" />
                  </IconButton>
                </a>
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
              <td className={styles.actions}>
                <IconButton onClick={() => openQuestionDialog(question)}>
                  <EditNote />
                </IconButton>
                <IconButton className={styles.questiondeleteicon} onClick={() => {}}>
                  <DeleteForever />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button color="primary" variant="contained" onClick={() => openQuestionDialog(null)}>
        Add question
      </Button>
      <QuestionDialog
        isAddNew={isAddNew}
        isOpen={isQuestionDialogOpen}
        id={newQuestionId}
        title={newQuestionTitle}
        description={newQuestionDescription}
        categories={newQuestionCategories}
        complexity={newQuestionComplexity}
        link={newQuestionLink}
        setIsOpen={setIsQuestionDialogOpen}
        setId={setNewQuestionId}
        setTitle={setNewQuestionTitle}
        setDescription={setNewQuestionDescription}
        setCategories={setNewQuestionCategories}
        setComplexity={setNewQuestionComplexity}
        setLink={setNewQuestionLink}
      />
    </div>
  );
};

export default QuestionList;