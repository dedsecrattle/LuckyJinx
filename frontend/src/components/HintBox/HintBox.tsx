import React, { useEffect, useState } from "react";
import { Typography, Button, CircularProgress, Tabs, Tab, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./HintBox.scss";
import { Language } from "@mui/icons-material";

interface HintBoxProps {
  onClose: () => void;
  questionId: number;
  code: string;
  language: string;
}

const HintBox: React.FC<HintBoxProps> = ({ onClose, questionId, code, language }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [hint, setHint] = useState<string>("");
  const [complexity, setComplexity] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [modelAnswer, setModelAnswer] = useState<string>("");

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch Hint
        // const hintResponse = await fetch(`/ai-hint-service/api/hint/${questionId}`, {
        const hintResponse = await fetch(`http://localhost:8000/api/hint/${questionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!hintResponse.ok) {
          throw new Error(`Hint Error: ${hintResponse.statusText}`);
        }

        const hintData = await hintResponse.json();
        setHint(hintData.hint);

        // Fetch Model Answer
        const modelAnswerResponse = await fetch(`/ai-hint-service/api/model-answer/${questionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!modelAnswerResponse.ok) {
          throw new Error(`Model Answer Error: ${modelAnswerResponse.statusText}`);
        }

        const modelAnswerData = await modelAnswerResponse.json();
        setModelAnswer(modelAnswerData.model_answer);

        // Fetch Code Complexity Analysis
        // Assuming you have access to the current code and language from props or context
        const userCode = code; // Replace with actual code
        const userLanguage = language; // Replace with actual language

        const analysisResponse = await fetch(`/ai-hint-service/api/code-analysis/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userCode, userLanguage }),
        });

        if (!analysisResponse.ok) {
          throw new Error(`Code Analysis Error: ${analysisResponse.statusText}`);
        }

        const analysisData = await analysisResponse.json();
        setComplexity(analysisData.complexity);
        setAnalysis(analysisData.analysis);
      } catch (err: any) {
        console.error("Failed to fetch AI hints:", err);
        setError("Failed to load AI hints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [questionId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="hintbox-expanded">
      <div className="hintbox-header">
        <Typography variant="h6">AI Hints</Typography>
        <Button onClick={onClose} className="hintbox-close-button" aria-label="Close Hint Box">
          <CloseIcon />
        </Button>
      </div>
      <div className="hintbox-container">
        {loading ? (
          <div className="hintbox-loading">
            <CircularProgress />
          </div>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
              <Tab label="Hint" />
              <Tab label="Complexity Analysis" />
              <Tab label="Model Answer" />
            </Tabs>
            <Box p={2}>
              {activeTab === 0 && <Typography>{hint}</Typography>}
              {activeTab === 1 && (
                <>
                  <Typography variant="subtitle1">Complexity: {complexity}</Typography>
                  <Typography>{analysis}</Typography>
                </>
              )}
              {activeTab === 2 && <Typography style={{ whiteSpace: "pre-wrap" }}>{modelAnswer}</Typography>}
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default HintBox;
