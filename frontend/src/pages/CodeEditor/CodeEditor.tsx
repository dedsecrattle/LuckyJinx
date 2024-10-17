import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Editor } from "@monaco-editor/react";
import { Button, Chip, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import "./CodeEditor.scss";
import Footer from "../../components/Footer/Footer";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface QuestionData {
  title: string;
  difficulty: string;
  topic: string;
  url: string;
  description: string;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

const App: React.FC = () => {
  const [code, setCode] = useState<string>("# Write your solution here\ndef twoSums(nums, target):\n");
  const [language, setLanguage] = useState<string>("python");
  const [isVideoHovered, setIsVideoHovered] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const currentUser = "Bob";

  // Question data
  const questionData: QuestionData = {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    url: "https://leetcode.com/problems/two-sum/description/",
    description:
      "### Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
  };

  // Chat history data
  const chatHistory: ChatMessage[] = [
    {
      sender: "Alice",
      message: "Hi Bob, did you understand the question?",
      timestamp: new Date("2023-10-15T10:00:00"),
    },
    {
      sender: "Bob",
      message: "Yes, I think so. We need to find two numbers that add up to the target.",
      timestamp: new Date("2023-10-15T10:01:00"),
    },
    {
      sender: "Alice",
      message: "Exactly! Do you have any idea how to approach it?",
      timestamp: new Date("2023-10-15T10:02:00"),
    },
    {
      sender: "Bob",
      message: "Maybe we can use a hash map to store the numbers.",
      timestamp: new Date("2023-10-15T10:03:00"),
    },
  ];

  return (
    <div className="app-container">
      <Navbar />

      <div className="container">
        <div className="top-section">
          <Typography variant="h3" className="question-title">
            {questionData.title}
          </Typography>

          <div className="details">
            <Chip label={`Difficulty: ${questionData.difficulty}`} className="detail-chip light-grey-chip" />
            <Chip label={`Topic: ${questionData.topic}`} className="detail-chip light-grey-chip" />
            <Chip
              label={`URL: ${questionData.url}`}
              className="detail-chip light-grey-chip"
              clickable
              onClick={() => window.open(questionData.url, "_blank")}
              icon={<OpenInNewIcon style={{ color: "#caff33" }} />}
            />
          </div>
        </div>

        {/* Editors section */}
        <div className="editors">
          {/* Left Side: Markdown Editor */}
          <div className="left-side">
            <MDEditor.Markdown source={questionData.description} className="md-editor" />
          </div>

          {/* Right Side: Code Editor */}
          <div className="right-side">
            <div className="header">
              <select className="language-select" onChange={handleLanguageChange}>
                <option value="python">Python</option>
                <option value="java">Java</option>
                {/* <option value="cpp">C++</option> */}
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

        <div className="bottom-section">
          {/* Right Side: Chatbox */}
          <div className="chatbox">
            <div className="chatbox-container">
              <div className="chat-messages">
                {chatHistory.map((chat, index) => {
                  const isOutgoing = chat.sender === currentUser;
                  return (
                    <div
                      key={index}
                      className={`chat-message ${isOutgoing ? "chat-message-right" : "chat-message-left"}`}
                    >
                      <div className="message-sender">{chat.sender}</div>
                      <div className="message-content">{chat.message}</div>
                      <div className="message-timestamp">{chat.timestamp.toLocaleTimeString()}</div>
                    </div>
                  );
                })}
              </div>
              {/* Input area for new messages */}
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." className="chat-input-field" />
                <Button variant="contained" size="small" className="chat-send-button">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Call Floating Window */}
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
              Hangout
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default App;
