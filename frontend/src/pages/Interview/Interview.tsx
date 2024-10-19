import { ReactElement, useContext } from "react";
import "./Interview.scss";
import { Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MatchingForm from "../../components/MatchingForm/MatchingForm";
import MatchingResult from "../../components/MatchingResult/MatchingResult";
import { UserContext } from "../../contexts/UserContext";
import { Categories, QuestionComplexity } from "../../models/question.model";
import { io } from "socket.io-client";
import { SessionContext, SessionState } from "../../contexts/SessionContext";

const WEBSOCKET_URL = process.env.REACT_APP_MATCHING_SERVICE_URL as string;

const Interview = (): ReactElement => {
  const { user } = useContext(UserContext);
  const { sessionState, setSessionState, setTopic, setDifficulty, setOtherUserId } = useContext(SessionContext);
  
  const socket = io(WEBSOCKET_URL, { autoConnect: false });

  socket.on("matched", (data: any) => {
    console.log("Matched with: ", data.matchedWith);
    setOtherUserId(data.matchedWith);
    setSessionState(SessionState.PENDING);
  });

  socket.on("timeout", (message: string) => {
    console.log("Timeout: ", message);
    setSessionState(SessionState.NOT_STARTED);
  })

  const startMatching = (topic: Categories, difficulty: QuestionComplexity) => {
    if (!user || !topic || !difficulty) { 
      return;
    }
    socket.connect();
    socket.emit("matching_request", {userId: user.id, topic, difficulty});
    setTopic(topic);
    setDifficulty(difficulty);
    setSessionState(SessionState.MATCHING);
  }

  const getSessionComponent = (): ReactElement => {
    switch (sessionState) {
      case SessionState.NOT_STARTED:
        return <MatchingForm startMatchingCallBack={startMatching}/>;
      case SessionState.MATCHING:
      case SessionState.PENDING:
      case SessionState.ACCEPTED:
        return <MatchingResult />;
      default:
        return <Typography variant="h5">An unexpected error occurred, please try again</Typography>;
    }
  };

  return (
    <Box className="Interview">
      <Navbar />
      {getSessionComponent()}
      <Footer />
    </Box>
  );
};

export default Interview;
