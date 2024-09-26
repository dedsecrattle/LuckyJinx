import React, { ReactElement, useEffect, useState } from "react";
import styles from "./QuestionList.module.scss";

export interface Question {
  id: number;
  title: string;
  description: string;
  category: Array<string>;
  complexity: string;
}

const QuestionList = (props: { questionList: Question[]; loading: boolean; error: string | null }): ReactElement => {
  const { questionList, loading, error } = props;
  const [questions, setQuestions] = useState<Question[]>(questionList);
  const [sortKey, setSortKey] = useState<keyof Question>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const complexityOrder = ["Easy", "Medium", "Hard"];
  const getComplexityValue = (complexity: string) => complexityOrder.indexOf(complexity);

  useEffect(() => {
    const dummyQuestions: Question[] = [
      {
        id: 1,
        title: "What is a Binary Search Tree?",
        description:
          "A binary search tree is a data structure that facilitates fast lookup, addition, and removal of items.",
        category: ["Algorithms", "Data Structures"],
        complexity: "Medium",
      },
      {
        id: 2,
        title: "Explain the concept of closures in JavaScript",
        description: "Closures are a way to access variables defined outside of a function's scope.",
        category: ["JavaScript", "Functional Programming"],
        complexity: "Hard",
      },
      {
        id: 3,
        title: "What is polymorphism in OOP?",
        description:
          "Polymorphism is the ability of different objects to respond in different ways to the same method call.",
        category: ["OOP"],
        complexity: "Easy",
      },
      {
        id: 4,
        title: "Reverse a String",
        description: "Write a function that reverses a string. The input string is given as an array of characters.",
        category: ["Strings", "Algorithms"],
        complexity: "Easy",
      },
    ];
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Function to truncate long descriptions
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  const handleSort = (key: keyof Question) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);

    const sortedQuestions = [...questions].sort((a, b) => {
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
              onClick={() => handleSort("id")}
              className={`${styles.clickable} ${sortKey === "id" ? styles[sortOrder] : ""}`}
            >
              ID
            </th>
            <th
              onClick={() => handleSort("title")}
              className={`${styles.clickable} ${sortKey === "title" ? styles[sortOrder] : ""}`}
            >
              Title
            </th>
            <th>Description</th>
            <th>Category</th>
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
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>{question.title}</td>
              <td>{truncateDescription(question.description, 100)}</td>
              <td>
                <div className={styles.tags}>
                  {question.category.map((tag, index) => (
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
