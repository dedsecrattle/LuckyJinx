import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button, Chip, Typography } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Chatbox from "../../components/Chatbox/Chatbox";
import VideoCall from "../../components/VideoCall/VideoCall";
import HintBox from "../../components/HintBox/HintBox";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import { autocompletion } from "@codemirror/autocomplete";
import ChatIcon from "@mui/icons-material/Chat";
import io, { Socket } from "socket.io-client";
import "./CodeEditor.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import { RangeSetBuilder, Extension } from "@codemirror/state";
import QuestionService from "../../services/question.service";
import { UserContext } from "../../contexts/UserContext";
import { ChatMessage } from "../../models/communication.model";
import { SessionContext, SessionState } from "../../contexts/SessionContext";
import { useConfirmationDialog } from "../../contexts/ConfirmationDialogContext";

const COMMUNICATION_WEBSOCKET_URL = process.env.REACT_APP_COMMUNICATION_SERVICE_URL as string;
const COLLABORATION_WEBSOCKET_URL = process.env.REACT_APP_COLLABORATION_SERVICE_URL as string;

// Define Language Type
type Language = "python" | "cpp" | "java";

// Define the CursorWidget
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

// Function to create decorations
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
  questionId: Number;
  title: string;
  description: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
  link: string;
  testCases: {
    input: string;
    output: string;
  }[];
}

interface TestCase {
  number: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isSubmitted?: boolean;
}

const CodeEditor: React.FC = () => {
  const { user } = useContext(UserContext);
  const { sessionState, questionId, clearSession } = useContext(SessionContext);
  const { setConfirmationDialogTitle, setConfirmationDialogContent, setConfirmationCallBack, openConfirmationDialog } =
    useConfirmationDialog();
  const navigate = useNavigate();

  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  const [code, setCode] = useState<string>("# Write your solution here\n");
  const [language, setLanguage] = useState<Language>("python");

  const { roomNumber } = useParams();
  const [joinedRoom, setJoinedRoom] = useState(false); // New state
  const [isHintBoxExpanded, setIsHintBoxExpanded] = useState(false); // New state
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isChatboxExpanded, setIsChatboxExpanded] = useState(false);
  const [isVideoCallExpanded, setIsVideoCallExpanded] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const chatHistoryRef = useRef<ChatMessage[]>([]); // For updating state of chatHistory

  const collaborationSocketRef = useRef<Socket | null>(null);
  const communicationSocketRef = useRef<Socket | null>(null);

  const lastCursorPosition = useRef<number | null>(null);
  const [otherCursors, setOtherCursors] = useState<{ [sid: string]: { cursor_position: number; color: string } }>({});

  const languageExtensions: { [key in Language]: Extension[] } = {
    python: [python(), autocompletion()],
    cpp: [cpp(), autocompletion()],
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
    if (sessionState !== SessionState.SUCCESS) {
      navigate("/");
      clearSession();
      return;
    }
    const fetchQuestionData = async () => {
      try {
        const response = await QuestionService.getQuestion(questionId);
        setQuestionData(response);
      } catch (error) {
        console.error("Failed to fetch question data:", error);
      }
    };

    fetchQuestionData();
  }, [questionId]);

  const appendToChatHistory = (newMessage: ChatMessage) => {
    setChatHistory([...chatHistoryRef.current, newMessage]);
  };

  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  const clearSockets = () => {
    if (collaborationSocketRef.current) {
      collaborationSocketRef.current.disconnect();
      console.log("Disconnected from collaboration websocket server.");
    }
    if (communicationSocketRef.current) {
      communicationSocketRef.current.disconnect();
      console.log("Disconnected from communication websocket server.");
    }
  };

  const chooseLeaveSession = () => {
    setConfirmationDialogTitle("Leave Session");
    setConfirmationDialogContent("Are you sure you want to leave the session?");
    setConfirmationCallBack(() => () => {
      clearSockets();
      clearSession();
      navigate("/");
    });
    openConfirmationDialog();
  };

  useEffect(() => {
    // set up websockets
    if (!roomNumber) {
      console.error("No roomNumber provided.");
      return;
    }

    const token = localStorage.getItem("jwt-token");
    if (!token) {
      console.error("No JWT token found in localStorage.");
      return;
    }

    // Collaboration socket for code editing
    const socket = io(COLLABORATION_WEBSOCKET_URL, {
      extraHeaders: {
        Authorization: `${token}`,
      },
    });
    collaborationSocketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to socket.io server.");
      socket.emit("join_request", { room_id: roomNumber });
    });

    socket.on("join_request", (data: any) => {
      console.log("Received join_request data:", data);
      if (data.code) {
        setCode(data.code);
      }
      setJoinedRoom(true); // User has successfully joined a room
    });

    socket.on("language_change", (newLanguage: string) => {
      if (["python", "cpp", "javascript", "java"].includes(newLanguage)) {
        setLanguage(newLanguage as Language);
        if (newLanguage === "cpp") {
          setCode(
            "#include <iostream>\nusing namespace std;\n\nint main() {\n\t// Write your solution here\n\treturn 0;\n}",
          );
        } else if (newLanguage === "java") {
          setCode(
            "public class Main {\n\tpublic static void main(String[] args) {\n\t\t// Write your solution here\n\t}\n}",
          );
        } else {
          setCode("# Write your solution here\n");
        }
      } else {
        console.warn(`Unsupported language received: ${newLanguage}`);
      }
    });

    // Handle real-time code updates
    socket.on("code_updated", (newCode: string) => {
      setCode(newCode);
    });

    // Handle cursor updates
    socket.on("cursor_updated", (userDetails: any) => {
      const { sid, cursor_position } = userDetails;
      if (sid === socket.id) return; // Ignore own cursor

      if (typeof cursor_position !== "number") {
        console.error(`Invalid cursor_position for sid ${sid}:`, cursor_position);
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

    // Handle user disconnection to remove their cursor
    socket.on("user_disconnected", (sid: string) => {
      console.log(`User disconnected: ${sid}`);
      setOtherCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[sid];
        return newCursors;
      });
    });

    // Handle socket errors
    socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });

    socket.on("user_left", (uid: string) => {
      if (user && uid !== user.id) {
        setConfirmationDialogTitle("Partner Disconnected");
        setConfirmationDialogContent(
          "Your partner has left the coding session. Would you like to end the session and return to home page?",
        );
        setConfirmationCallBack(() => () => {
          clearSockets();
          clearSession();
          navigate("/");
        });
        openConfirmationDialog();
      }
    });

    // Communication socket for chat
    if (!user) {
      console.error("No user found.");
      return;
    }

    const chatSocket = io(COMMUNICATION_WEBSOCKET_URL);
    communicationSocketRef.current = chatSocket;

    chatSocket.on("connect", () => {
      chatSocket.emit("join-room", user?.id as string, roomNumber);
    });

    chatSocket.on("receive-message", (message: string, senderId: string, senderName: string, timeStamp: number) => {
      if (senderId === user.id) return;
      const newMessage: ChatMessage = {
        senderId: senderId,
        senderName: senderName,
        message: message,
        timestamp: new Date(timeStamp),
      };
      appendToChatHistory(newMessage);
    });

    // Cleanup on component unmount
    return () => {
      clearSockets();
    };
  }, [roomNumber]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    if (["python", "cpp", "javascript", "java"].includes(newLanguage)) {
      setLanguage(newLanguage);
      if (newLanguage === "cpp") {
        setCode(
          "#include <iostream>\nusing namespace std;\n\nint main() {\n\t// Write your solution here\n\treturn 0;\n}",
        );
      } else if (newLanguage === "java") {
        setCode(
          "public class Main {\n\tpublic static void main(String[] args) {\n\t\t// Write your solution here\n\t}\n}",
        );
      } else {
        setCode("# Write your solution here\n");
      }
      if (joinedRoom) {
        collaborationSocketRef.current?.emit("language_change", { language: newLanguage, room_id: roomNumber });
      }
    } else {
      console.warn(`Attempted to set unsupported language: ${newLanguage}`);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (joinedRoom) {
      // Emit only if joined
      collaborationSocketRef.current?.emit("code_updated", { code: value });
    }
  };

  const handleCursorChange = (viewUpdate: any) => {
    const cursorPosition = viewUpdate.state.selection.main.head;
    if (cursorPosition !== lastCursorPosition.current) {
      lastCursorPosition.current = cursorPosition;
      collaborationSocketRef.current?.emit("cursor_updated", { cursor_position: cursorPosition });
    }
  };

  const cursorDecorationsExtension = useMemo(() => {
    return createCursorDecorations(otherCursors);
  }, [otherCursors]);

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
            {questionData?.title}
          </Typography>

          <div className="details">
            <Chip label={`Difficulty: ${questionData?.complexity}`} className="detail-chip light-grey-chip" />
            <Chip label={`Topic: ${questionData?.categories}`} className="detail-chip light-grey-chip" />
            <Chip
              label={`URL: ${questionData?.link}`}
              className="detail-chip light-grey-chip"
              clickable
              onClick={() => window.open(questionData?.link, "_blank")}
              icon={<OpenInNewIcon style={{ color: "#caff33" }} />}
            />
          </div>
        </div>

        <div className="editors">
          <div className="left-side">
            <MDEditor.Markdown source={questionData?.description} className="md-editor" />
          </div>

          <div className="right-side">
            <div className="header">
              <select className="language-select" onChange={handleLanguageChange} value={language}>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
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
        <div className="buttons">
          <Button variant="contained" color="error" className="buttons-leave" onClick={chooseLeaveSession}>
            Leave Session
          </Button>
        </div>
      </div>

      {/* Floating Chatbox Icon */}
      {!isChatboxExpanded && (
        <div className="chatbox-icon" onClick={() => setIsChatboxExpanded(true)}>
          <ChatIcon style={{ fontSize: "2rem", color: "#fff" }} />
        </div>
      )}

      {isChatboxExpanded && (
        <Chatbox
          onClose={() => setIsChatboxExpanded(false)}
          roomNumber={roomNumber}
          communicationSocketRef={communicationSocketRef}
          appendToChatHistory={appendToChatHistory}
          chatHistory={chatHistory}
        />
      )}

      {/* Floating Video Call Icon */}
      {!isVideoCallExpanded && (
        <div className="video-call-icon" onClick={() => setIsVideoCallExpanded(true)}>
          <VideoCallIcon style={{ fontSize: "2rem", color: "#fff" }} />
        </div>
      )}

      {isVideoCallExpanded && <VideoCall onClose={() => setIsVideoCallExpanded(false)} />}

      {/* Floating AI Hint Button */}
      {!isHintBoxExpanded && (
        <div className="ai-hint-button" onClick={() => setIsHintBoxExpanded(true)}>
          <LightbulbIcon style={{ marginRight: "8px", color: "#FFD700" }} />
          <Typography variant="body1" style={{ color: "#fff" }}>
            AI Hint
          </Typography>
        </div>
      )}

      {/* HintBox Component */}
      {isHintBoxExpanded && questionData && (
        <HintBox questionId={questionId} onClose={() => setIsHintBoxExpanded(false)} />
      )}

      <Footer />
    </div>
  );
};

export default CodeEditor;
