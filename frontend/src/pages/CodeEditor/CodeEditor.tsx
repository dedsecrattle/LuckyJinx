import React, { useState, useEffect, useRef, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button, Chip, Typography } from "@mui/material";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Chatbox from "../../components/Chatbox/Chatbox";
import VideoCall from "../../components/VideoCall/VideoCall";
import TestCases from "../../components/TestCases/TestCases";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ChatIcon from "@mui/icons-material/Chat";
import io, { Socket } from "socket.io-client";
import "./CodeEditor.scss";
import { useParams } from "react-router-dom";

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
  const [code, setCode] = useState<string>("# Write your solution here\ndef twoSums(nums, target):\n");
  const [language, setLanguage] = useState<string>("python");
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false);
  const [isVideoCallExpanded, setIsVideoCallExpanded] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const editorRef: React.MutableRefObject<EditorView | null> = useRef(null);
  const { roomNumber } = useParams();

  useEffect(() => {
    if (editorRef.current) return; // Prevent re-assignment if already set

    const editor = new EditorView({
      doc: code,
      extensions: [languageExtensions[language as "python" | "javascript"]],
      parent: document.querySelector(".code-editor")!,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    if (!roomNumber) return;
    const token = localStorage.getItem("jwt-token");
    const socket = io("http://localhost:3005", {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_request", { room_id: roomNumber });
    });

    socket.on("join_request", (data: any) => {
      if (data.code) {
        setCode(data.code);
      }
    });

    // Handle real-time code updates
    socket.on("code_updated", (newCode: string) => {
      setCode(newCode);
      if (editorRef.current) {
        const editor = editorRef.current;
        editor.dispatch({
          changes: { from: 0, to: editor.state.doc.length, insert: newCode },
        });
      }
    });

    // Handle cursor updates
    socket.on("cursor_updated", (data: any) => {
      // Implement cursor position indicator for other users here
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [roomNumber]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    socketRef.current?.emit("code_updated", { code: value });
  };

  const handleCursorChange = (viewUpdate: any) => {
    const cursorPosition = viewUpdate.state.selection.main.head;
    socketRef.current?.emit("cursor_updated", { cursor_position: cursorPosition });
  };

  const questionData: QuestionData = {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    url: "https://leetcode.com/problems/two-sum/description/",
    description:
      "### Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
  };

  const defaultTestCases: TestCase[] = [
    { number: 1, input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", actualOutput: "[0,1]" },
    { number: 2, input: "nums = [3,2,4], target = 6", expectedOutput: "[1,2]", actualOutput: "[1,2]" },
    { number: 3, input: "nums = [3,3], target = 6", expectedOutput: "[0,1]", actualOutput: "[0,1]" },
  ];

  const [userTestCases, setUserTestCases] = useState<TestCase[]>([]);

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

  const languageExtensions = {
    python: python(),
    javascript: javascript(),
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="container">
        <div className="top-section">
          <Typography variant="h3" className="question-title">
            {questionData.title} @ {roomNumber}
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

        <div className="editors">
          <div className="left-side">
            <MDEditor.Markdown source={questionData.description} className="md-editor" />
          </div>

          <div className="right-side">
            <div className="header">
              <select className="language-select" onChange={handleLanguageChange} value={language}>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
              <Button variant="contained" size="small" className="submit-button">
                Run code
              </Button>
            </div>
            <CodeMirror
              value={code}
              height="500px"
              style={{ fontSize: "1rem" }}
              extensions={[languageExtensions[language as "python" | "javascript"]]}
              onChange={handleCodeChange}
              onUpdate={(viewUpdate) => handleCursorChange(viewUpdate)}
              className="code-editor"
              theme={okaidia}
            />
          </div>
        </div>
        {/* <TestCases defaultTestCases={defaultTestCases} userTestCases={userTestCases} addTestCase={addTestCase} /> */}
      </div>

      {!isChatboxExpanded && (
        <div className="chatbox-icon" onClick={() => setIsChatboxExpanded(true)}>
          <ChatIcon style={{ fontSize: "2rem", color: "#fff" }} />
        </div>
      )}

      {isChatboxExpanded && <Chatbox onClose={() => setIsChatboxExpanded(false)} />}

      {!isVideoCallExpanded && (
        <div className="video-call-icon" onClick={() => setIsVideoCallExpanded(true)}>
          <VideoCallIcon style={{ fontSize: "2rem", color: "#fff" }} />
        </div>
      )}

      {isVideoCallExpanded && <VideoCall onClose={() => setIsVideoCallExpanded(false)} />}

      <Footer />
    </div>
  );
};

export default App;
