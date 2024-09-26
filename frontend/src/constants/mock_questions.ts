import { Question } from "../models/question.model";

export const mockQuestions: Question[] = [
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
