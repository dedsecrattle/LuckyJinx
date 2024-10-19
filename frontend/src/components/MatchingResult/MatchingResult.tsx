import { ReactElement, useContext} from "react";
import { Box, Button, Typography } from "@mui/material";
import "./MatchingResult.scss";
import CountUpTimer from "../CountUpTimer/CountUpTimer";
import { UserContext } from "../../contexts/UserContext";
import Bridge from "../../assets/bridge.svg";
import { Code, Whatshot } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UnknownUser from "../../assets/unknown_user.png";
import { SessionContext, SessionState } from "../../contexts/SessionContext";

const MatchingResult = (): ReactElement => {
  const { user } = useContext(UserContext);
  const { sessionState, topic, difficulty, otherUserProfile } = useContext(SessionContext);
  const navigate = useNavigate();

  if (!(user)) {
    navigate("/");
  }

  return (
    <Box>
      <Box className="MatchingResult-title">
        <Box className="MatchingResult-title-progress">
          <Typography className="MatchingResult-title-text">
            {sessionState === SessionState.MATCHING
              ? "Matching you with another coder..."
              : "Partner found! Accept to start the session"}
          </Typography>
          {sessionState === SessionState.MATCHING ? <CountUpTimer /> : <></>}
        </Box>

        <Box className="MatchingResult-users">
          <Box className="MatchingResult-users-profile">
            <img src={user!.avatar.toString()} alt="user1" className="MatchingResult-users-avatar" />
            <Typography className="MatchingResult-users-name">{user!.username.toString()}</Typography>
          </Box>

          <Box className="MatchingResult-users-bridge">
            <Box className="MatchingResult-users-bridge-infobox">
              <Whatshot className="MatchingResult-users-bridge-infobox-icon" />
              <Typography variant="h5" className="MatchingResult-users-bridge-text">
                {difficulty}
              </Typography>
            </Box>

            <Box className="MatchingResult-users-bridge-image-container">
              <img
                src={Bridge}
                alt="bridge"
                className="MatchingResult-users-bridge-image-left MatchingResult-users-bridge-image-accepted"
              />
              <img
                src={Bridge}
                alt="bridge"
                className="MatchingResult-users-bridge-image-right MatchingResult-users-bridge-image-declined"
              />
            </Box>

            <Box className="MatchingResult-users-bridge-infobox">
              <Code className="MatchingResult-users-bridge-infobox-icon" />
              <Typography className="MatchingResult-users-bridge-text">
                {topic}
              </Typography>
            </Box>
          </Box>

          <Box className="MatchingResult-users-profile">
            <img
              src={otherUserProfile ? otherUserProfile.avatar.toString() : UnknownUser}
              alt="user2"
              className="MatchingResult-users-avatar"
            />
            <Typography className="MatchingResult-users-name">
              {otherUserProfile ? otherUserProfile.username.toString() : ""}
            </Typography>
          </Box>
        </Box>

        {sessionState === SessionState.MATCHING ? (
          <Box className="MatchingResult-actions">
            <Button variant="contained" color="error" className="MatchingResult-actions-cancel">
              Cancel
            </Button>
          </Box>
        ) : (
          <Box className="MatchingResult-actions">
            <Button variant="contained" color="primary" className="MatchingResult-actions-accept">
              Accept
            </Button>
            <Button variant="contained" color="error" className="MatchingResult-actions-decline">
              Decline
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MatchingResult;
