import { ReactElement, useContext, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./MatchingResult.scss";
import CountUpTimer from "../CountUpTimer/CountUpTimer";
import { UserContext } from "../../contexts/UserContext";
import Bridge from "../../assets/bridge.svg";
import { Code, Whatshot } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UnknownUser from "../../assets/unknown_user.png";
import { SessionContext, SessionState } from "../../contexts/SessionContext";
import { useMainDialog } from "../../contexts/MainDialogContext";

const MatchingResult = (): ReactElement => {
  const { user } = useContext(UserContext);
  const {
    socket,
    sessionState,
    topic,
    difficulty,
    otherUserProfile,
    userAccepted,
    userDeclined,
    otherUserAccepted,
    otherUserDeclined,
    setSessionState,
    incrementMatchCount,
    setLastMatchingStartTime,
    clearSession,
    setUserAccepted,
    setUserDeclined,
    setOtherUserAccepted,
    setOtherUserDeclined,
  } = useContext(SessionContext);
  const { setMainDialogTitle, setMainDialogContent, openMainDialog } = useMainDialog();
  const navigate = useNavigate();

  const chooseCancle = () => {
    clearSession();
  };

  const chooseContinue = () => {
    if (user && socket && socket.connected) {
      socket.emit("matching_request", { userId: user.id, topic, difficulty });
      incrementMatchCount();
      setLastMatchingStartTime(Date.now());
      setSessionState(SessionState.MATCHING);
    } else {
      clearSession();
      setMainDialogTitle("Error");
      setMainDialogContent("Your connection with the matching service is interrupted, please try again.");
      openMainDialog();
    }
  };

  const chooseAccept = () => {
    setUserAccepted(true);
  };

  const chooseDecline = () => {
    setUserDeclined(true);
  };

  if (!user) {
    navigate("/");
  }

  return (
    <Box>
      <Box className="MatchingResult-title">
        <Box className="MatchingResult-title-progress">
          <Typography className="MatchingResult-title-text">
            {sessionState === SessionState.MATCHING
              ? "Matching you with another coder..."
              : sessionState === SessionState.TIMEOUT
                ? "No partner found yet. Would you like to continue matching?"
                : "Partner found! Accept to start the session"}
          </Typography>
          {sessionState === SessionState.MATCHING || sessionState === SessionState.TIMEOUT ? <CountUpTimer /> : <></>}
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
                className={
                  userAccepted
                    ? "MatchingResult-users-bridge-image-left MatchingResult-users-bridge-image-accepted"
                    : userDeclined
                      ? "MatchingResult-users-bridge-image-left MatchingResult-users-bridge-image-declined"
                      : "MatchingResult-users-bridge-image-left"
                }
              />
              <img
                src={Bridge}
                alt="bridge"
                className={
                  otherUserAccepted
                    ? "MatchingResult-users-bridge-image-right MatchingResult-users-bridge-image-accepted"
                    : otherUserDeclined
                      ? "MatchingResult-users-bridge-image-right MatchingResult-users-bridge-image-declined"
                      : "MatchingResult-users-bridge-image-right"
                }
              />
            </Box>

            <Box className="MatchingResult-users-bridge-infobox">
              <Code className="MatchingResult-users-bridge-infobox-icon" />
              <Typography className="MatchingResult-users-bridge-text">{topic}</Typography>
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

        {sessionState === SessionState.MATCHING || sessionState === SessionState.TIMEOUT ? (
          <Box className="MatchingResult-actions">
            <Button variant="contained" color="error" className="MatchingResult-actions-cancel" onClick={chooseCancle}>
              Cancel
            </Button>
            {sessionState === SessionState.TIMEOUT ? (
              <Button
                variant="contained"
                color="primary"
                className="MatchingResult-actions-continue"
                onClick={chooseContinue}
              >
                Continue
              </Button>
            ) : (
              <></>
            )}
          </Box>
        ) : !userAccepted && !userDeclined ? (
          <Box className="MatchingResult-actions">
            <Button
              variant="contained"
              color="primary"
              className="MatchingResult-actions-accept"
              onClick={chooseAccept}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              className="MatchingResult-actions-decline"
              onClick={chooseDecline}
            >
              Decline
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export default MatchingResult;
