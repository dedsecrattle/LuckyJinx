import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./QuestionList.module.scss";

interface Question {
  id: number;
  title: string;
  description: string;
  category: Array<string>;
  complexity: string;
}

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   // Fetch data from the backend REST API
  //   axios.get("/api/questions")
  //     .then(response => {
  //       setQuestions(response.data);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       setError("Failed to fetch questions");
  //       setLoading(false);
  //     });
  // }, []);

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
    ];

    // dummy questions
    setQuestions(dummyQuestions);
  }, []);

  // if (loading) {
  //   return <p>Loading questions...</p>;
  // }

  // if (error) {
  //   return <p>{error}</p>;
  // }

  // Function to truncate long descriptions
  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <div className={styles.container}>
      <h1>Question Repository</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Complexity</th>
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
