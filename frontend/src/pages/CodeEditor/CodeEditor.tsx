import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button, Chip, Typography } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Chatbox from "../../components/Chatbox/Chatbox";
import VideoCall from "../../components/VideoCall/VideoCall";
import TestCases from "../../components/TestCases/TestCases";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { autocompletion } from "@codemirror/autocomplete";
import ChatIcon from "@mui/icons-material/Chat";
import io, { Socket } from "socket.io-client";
import "./CodeEditor.scss";
import { useParams } from "react-router-dom";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import { RangeSetBuilder, Extension } from "@codemirror/state";

const WEBSOCKET_URL = "http://localhost:3005" as string;
console.log("URL: ", WEBSOCKET_URL);

// Define Language Type
type Language = "python" | "cpp" | "javascript" | "java";

// CursorWidget
class CursorWidget extends WidgetType {
  color: string;

  constructor(color: string) {
    super();
    this.color = color;
  }

  toDOM() {
    const cursor = document.createElement("span");
    cursor.style.borderLeft = `2px solid ${this.color}`;
    cursor.style.marginLeft = "-1px";
    cursor.style.height = "1em";
    cursor.className = "remote-cursor";
    return cursor;
  }

  ignoreEvent() {
    return true;
  }
}

const createCursorDecorations = (otherCursors: {
  [sid: string]: { cursor_position: number; color: string };
}): Extension => {
  return EditorView.decorations.of((view) => {
    const builder = new RangeSetBuilder<Decoration>();
    for (const [sid, cursor] of Object.entries(otherCursors)) {
      const { cursor_position, color } = cursor;
      if (typeof cursor_position === "number") {
        // Ensure cursor_position is a number
        const decoration = Decoration.widget({
          widget: new CursorWidget(color),
          side: 0,
        });
        builder.add(cursor_position, cursor_position, decoration);
      } else {
        console.warn(`Invalid cursor_position for sid ${sid}:`, cursor_position);
      }
    }
    return builder.finish();
  });
};

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

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>("# Write your solution here\ndef twoSums(nums, target):\n");
  const [language, setLanguage] = useState<Language>("python");
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false);
  const [isVideoCallExpanded, setIsVideoCallExpanded] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { roomNumber } = useParams();

  const [otherCursors, setOtherCursors] = useState<{ [sid: string]: { cursor_position: number; color: string } }>({});

  const languageExtensions: { [key in Language]: Extension[] } = {
    python: [python(), autocompletion()],
    cpp: [cpp(), autocompletion()],
    javascript: [javascript(), autocompletion()],
    java: [java(), autocompletion()],
  };

  const userColors = [
    "#FF5733", // Red
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F333FF", // Pink
    "#FF33F3", // Magenta
    "#33FFF3", // Cyan
    "#FFA533", // Orange
    "#A533FF", // Purple
    "#33A5FF", // Light Blue
    "#33FF99", // Light Green
  ];

  const getColorForUser = (sid: string): string => {
    let hash = 0;
    for (let i = 0; i < sid.length; i++) {
      hash = sid.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % userColors.length;
    return userColors[index];
  };

  useEffect(() => {
    if (!roomNumber) {
      console.error("No roomNumber provided.");
      return;
    }

    const token = localStorage.getItem("jwt-token");
    if (!token) {
      console.error("No JWT token found in localStorage.");
      return;
    }

    const socket = io(WEBSOCKET_URL, {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket.io server.");
      socket.emit("join_request", { room_id: roomNumber });
    });

    socket.on("join_request", (data: any) => {
      console.log("Received join_request data:", data);
      if (data.code) {
        setCode(data.code);
      }
    });

    socket.on("language_change", (newLanguage: string) => {
      console.log("Received language_change:", newLanguage);
      if (["python", "cpp", "javascript", "java"].includes(newLanguage)) {
        setLanguage(newLanguage as Language);
      } else {
        console.warn(`Unsupported language received: ${newLanguage}`);
      }
    });

    // Handle real-time code updates
    socket.on("code_updated", (newCode: string) => {
      console.log("Received code_updated:", newCode);
      setCode(newCode);
    });

    // Handle cursor updates
    socket.on("cursor_updated", (userDetails: any) => {
      console.log("Received cursor_updated:", userDetails);
      const { sid, cursor_position } = userDetails;
      if (sid === socket.id) return; // Ignore own cursor

      if (typeof cursor_position !== "number") {
        console.error(`Invalid cursor_position from sid ${sid}:`, cursor_position);
        return;
      }

      setOtherCursors((prev) => ({
        ...prev,
        [sid]: {
          cursor_position,
          color: getColorForUser(sid),
        },
      }));
    });

    // user disconnection to remove cursor
    socket.on("user_disconnected", (sid: string) => {
      console.log(`User disconnected: ${sid}`);
      setOtherCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[sid];
        return newCursors;
      });
    });

    // handle error
    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    // clean up
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Disconnected from socket.io server.");
      }
    };
  }, [roomNumber]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    if (["python", "cpp", "javascript", "java"].includes(newLanguage)) {
      setLanguage(newLanguage);
      socketRef.current?.emit("language_change", { language: newLanguage, room_id: roomNumber });
    } else {
      console.warn(`Attempted to set unsupported language: ${newLanguage}`);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    socketRef.current?.emit("code_updated", { code: value });
  };

  const handleCursorChange = (viewUpdate: any) => {
    const cursorPosition = viewUpdate.state.selection.main.head;
    socketRef.current?.emit("cursor_updated", { cursor_position: cursorPosition });
  };

  const cursorDecorationsExtension = useMemo(() => {
    return createCursorDecorations(otherCursors);
  }, [otherCursors]);

  const questionData: QuestionData = {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    url: "https://leetcode.com/problems/two-sum/description/",
    description:
      "### Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
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
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
              <Button variant="contained" size="small" className="submit-button">
                Run code
              </Button>
            </div>
            <CodeMirror
              value={code}
              height="500px"
              style={{ fontSize: "18px" }}
              extensions={[...(languageExtensions[language] || []), cursorDecorationsExtension]}
              onChange={handleCodeChange}
              onUpdate={(viewUpdate) => handleCursorChange(viewUpdate)}
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

export default CodeEditor;
