import React, { useEffect, useState } from "react";
import { Typography, Button, CircularProgress, Tabs, Tab, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import "./HintBox.scss";
import { set } from "lodash";

interface HintBoxProps {
  onClose: () => void;
  questionId: number;
  code: string;
  language: string;
}

const AI_HINT_SERVICE_URL = process.env.REACT_APP_AI_HINT_URL;

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
        console.log('Fetching hint for questionId:', questionId);
        const hintResponse = await axios.get(`${AI_HINT_SERVICE_URL}/api/hint/${questionId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setHint(hintResponse.data.hint);

        // Fetch Model Answer
        const modelAnswerResponse = await axios.get(`${AI_HINT_SERVICE_URL}/api/ai_answer/${questionId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setModelAnswer(modelAnswerResponse.data.ai_answer);
        // setModelAnswer("Model answer is not available for this question.");
        console.log('User code:', code);
        console.log('User Language:', language);
        // Fetch Code Complexity Analysis
        const analysisResponse = await axios.post(
          `${AI_HINT_SERVICE_URL}/api/code-analysis/`,
          {
            userCode: String(code),
            userLanguage: String(language),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setComplexity(analysisResponse.data.complexity);
        setAnalysis(analysisResponse.data.analysis);
      } catch (err: any) {
        console.error("Failed to fetch AI hints:", err);
        setError("Failed to load AI hints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [questionId, code, language]);

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
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
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
