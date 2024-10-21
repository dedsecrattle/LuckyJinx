import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Editor } from "@monaco-editor/react";
import { Button, Chip, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Chatbox from "../../components/Chatbox/Chatbox";
import TestCases from "../../components/TestCases/TestCases";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChatIcon from "@mui/icons-material/Chat";
import "./CodeEditor.scss";

interface QuestionData {
  title: string;
  difficulty: string;
  topic: string;
  url: string;
  description: string;
}

interface TestCase {
  number: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isSubmitted?: boolean;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>(
    "# Write your solution here\ndef twoSums(nums, target):\n"
  );
  const [language, setLanguage] = useState<string>("python");
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const questionData: QuestionData = {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    url: "https://leetcode.com/problems/two-sum/description/",
    description:
      "### Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
  };

  // Default test cases 
  const defaultTestCases: TestCase[] = [
    {
      number: 1,
      input: "nums = [2,7,11,15], target = 9",
      expectedOutput: "[0,1]",
      actualOutput: "[0,1]",
    },
    {
      number: 2,
      input: "nums = [3,2,4], target = 6",
      expectedOutput: "[1,2]",
      actualOutput: "[1,2]",
    },
    {
      number: 3,
      input: "nums = [3,3], target = 6",
      expectedOutput: "[0,1]",
      actualOutput: "[0,1]",
    },
  ];

  const [userTestCases, setUserTestCases] = useState<TestCase[]>([]);

  // Function to add a new test case
  const addTestCase = () => {
    if (userTestCases.length >= 5) {
      alert("You can only add up to 5 test cases.");
      return;
    }
    setUserTestCases([
      ...userTestCases,
      {
        number: defaultTestCases.length + userTestCases.length + 1,
        input: "",
        expectedOutput: "",
        actualOutput: "",
        isSubmitted: false,
      },
    ]);
  };

  const updateTestCase = (
    index: number,
    field: "input" | "expectedOutput",
    value: string
  ) => {
    const updatedTestCases = [...userTestCases];
    updatedTestCases[index][field] = value;
    setUserTestCases(updatedTestCases);
  };

  const submitTestCase = (index: number) => {
    const updatedTestCases = [...userTestCases];
    if (
      updatedTestCases[index].input.trim() === "" ||
      updatedTestCases[index].expectedOutput.trim() === ""
    ) {
      alert("Please fill in both input and expected output.");
      return;
    }
    updatedTestCases[index].isSubmitted = true;
    setUserTestCases(updatedTestCases);
  };

  const deleteTestCase = (index: number) => {
    const updatedTestCases = [...userTestCases];
    updatedTestCases.splice(index, 1);
    updatedTestCases.forEach((testCase, idx) => {
      testCase.number = defaultTestCases.length + idx + 1;
    });
    setUserTestCases(updatedTestCases);
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="container">
        <div className="top-section">
          <Typography variant="h3" className="question-title">
            {questionData.title}
          </Typography>

          <div className="details">
            <Chip
              label={`Difficulty: ${questionData.difficulty}`}
              className="detail-chip light-grey-chip"
            />
            <Chip
              label={`Topic: ${questionData.topic}`}
              className="detail-chip light-grey-chip"
            />
            <Chip
              label={`URL: ${questionData.url}`}
              className="detail-chip light-grey-chip"
              clickable
              onClick={() => window.open(questionData.url, "_blank")}
              icon={<OpenInNewIcon style={{ color: "#caff33" }} />}
            />
          </div>
        </div>

        <div className="editors">
          {/* Left Side: Markdown Editor */}
          <div className="left-side">
            <MDEditor.Markdown
              source={questionData.description}
              className="md-editor"
            />
          </div>

          {/* Right Side: Code Editor */}
          <div className="right-side">
            <div className="header">
              <select
                className="language-select"
                onChange={handleLanguageChange}
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <Button variant="contained" size="small" className="submit-button">
                Run code
              </Button>
            </div>

            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              className="code-editor"
            />
          </div>
        </div>

        <TestCases
          defaultTestCases={defaultTestCases}
          userTestCases={userTestCases}
          addTestCase={addTestCase}
          updateTestCase={updateTestCase}
          submitTestCase={submitTestCase}
          deleteTestCase={deleteTestCase}
        />
      </div>

      {!isChatboxExpanded && (
        <div className="chatbox-icon" onClick={() => setIsChatboxExpanded(true)}>
          <ChatIcon style={{ fontSize: "2rem", color: "#fff" }} />
        </div>
      )}

      {isChatboxExpanded && (
        <Chatbox onClose={() => setIsChatboxExpanded(false)} />
      )}

      <div
        className="video-call"
        onMouseEnter={() => setIsVideoHovered(true)}
        onMouseLeave={() => setIsVideoHovered(false)}
      >
        <div className="video-placeholder">
          <Typography variant="h6" className="placeholder-text">
            Video Call Placeholder
          </Typography>
          {isVideoHovered && (
            <Button variant="contained" className="hangout-button">
              Hang Up
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
