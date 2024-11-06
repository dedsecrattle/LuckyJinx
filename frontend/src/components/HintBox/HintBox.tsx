import React, { useEffect, useState } from "react";
import { Typography, Button, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./HintBox.scss";

interface HintBoxProps {
  onClose: () => void;
  questionId: number;
}

const HintBox: React.FC<HintBoxProps> = ({ onClose, questionId }) => {
  const [hint, setHint] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchHint = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/hint/${questionId}`, {
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
      } catch (err: any) {
        console.error("Failed to fetch hint:", err);
        setError("Failed to load hint. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHint();
  }, [questionId]);

  return (
    <div className="hintbox-expanded">
      <div className="hintbox-header">
        <Typography variant="h6">Hint</Typography>
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
          <Typography>{hint}</Typography>
        )}
      </div>
    </div>
  );
};

export default HintBox;
