import { Chip, Typography } from "@mui/material";
import { ReactElement } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Question } from "../../models/question.model";
import Spinner from "../Spinner/Spinner";
import "./QuestionContainer.scss";

const QuestionContainer = (props: { questionData: Question | null }): ReactElement => {
  const { questionData } = props;

  return (
    <div>
      {questionData ? (
        <div className="question-container">
          <Typography variant="h3" className="question-title">
            {questionData?.title}
          </Typography>

          <div className="details">
            <Chip label={`Difficulty: ${questionData?.complexity}`} className="detail-chip light-grey-chip" />
            <Chip label={`Topic: ${questionData?.categories.join(", ")}`} className="detail-chip light-grey-chip" />
            <Chip
              label={`URL: ${questionData?.link}`}
              className="detail-chip light-grey-chip"
              clickable
              onClick={() => window.open(questionData?.link, "_blank")}
              icon={<OpenInNewIcon style={{ color: "#caff33" }} />}
            />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default QuestionContainer;
