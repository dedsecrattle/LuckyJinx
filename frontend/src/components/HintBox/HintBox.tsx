import React, { useEffect, useState } from "react";
import { Typography, Button, CircularProgress, Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./HintBox.scss";

interface HintBoxProps {
  onClose: () => void;
  questionId: number;
  code?: string; // Optional, needed for code complexity analysis
}

const HintBox: React.FC<HintBoxProps> = ({ onClose, questionId, code }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const [hint, setHint] = useState<string>("");
  const [complexity, setComplexity] = useState<string>("");
  const [modelAnswer, setModelAnswer] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        if (activeTab === 0) {
          // Fetch Hint
          console.log("Fetching hint for questionId:", questionId);
          const response = await fetch(`/api/ai-hint/hint/${questionId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          setHint(data.hint);
        } else if (activeTab === 1) {
          // Fetch Code Complexity Analysis
          const response = await fetch(`/api/ai-hint/code-complexity`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          setComplexity(data.complexity);
        } else if (activeTab === 2) {
          // Fetch Model Answer
          const response = await fetch(`/api/ai-hint/model-answer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ questionId, language: "python" }), // Adjust language as needed
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          setModelAnswer(data.answer);
        }
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, questionId, code]);

  return (
    <div className="hintbox-expanded">
      <div className="hintbox-header">
        <Typography variant="h6">AI Assistance</Typography>
        <Button onClick={onClose} className="hintbox-close-button" aria-label="Close Hint Box">
          <CloseIcon />
        </Button>
      </div>
      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Hint" />
        <Tab label="Complexity Analysis" />
        <Tab label="Model Answer" />
      </Tabs>
      <div className="hintbox-container">
        {loading ? (
          <div className="hintbox-loading">
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {activeTab === 0 && <Typography>{hint}</Typography>}
            {activeTab === 1 && <Typography>{complexity}</Typography>}
            {activeTab === 2 && <Typography>{modelAnswer}</Typography>}
          </>
        )}
      </div>
    </div>
  );
};

export default HintBox;
