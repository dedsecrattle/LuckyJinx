import React, { useState, useEffect, useRef } from "react";
import { Typography, Button } from "@mui/material";
import "./Chatbox.scss";

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

interface ChatboxProps {
  onClose: () => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ onClose }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "Alice",
      message: "Hi Bob, did you understand the question?",
      timestamp: new Date("2023-10-15T10:00:00"),
    },
    {
      sender: "Bob",
      message:
        "Yes, I think so. We need to find two numbers that add up to the target.",
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
  ]);

  const [messageInput, setMessageInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUser = "Bob";

  useEffect(() => {
    // Scroll down
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage: ChatMessage = {
      sender: currentUser,
      message: messageInput,
      timestamp: new Date(),
    };
    setChatHistory([...chatHistory, newMessage]);
    setMessageInput("");
  };

  return (
    <div className="chatbox-expanded">
      <div className="chatbox-header">
        <Typography variant="h6">Chat</Typography>
        <Button onClick={onClose} className="chat-close-button">
          Close
        </Button>
      </div>
      <div className="chatbox-container">
        <div className="chat-messages">
          {chatHistory.map((chat, index) => {
            const isOutgoing = chat.sender === currentUser;
            return (
              <div
                key={index}
                className={`chat-message ${
                  isOutgoing ? "chat-message-right" : "chat-message-left"
                }`}
              >
                <div className="message-sender">{chat.sender}</div>
                <div className="message-content">{chat.message}</div>
                <div className="message-timestamp">
                  {chat.timestamp.toLocaleTimeString()}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            className="chat-input-field"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button
            variant="contained"
            size="small"
            className="chat-send-button"
            onClick={sendMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
