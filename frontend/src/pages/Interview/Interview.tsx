import { ReactElement, useEffect, useState } from "react";
import "./Interview.scss";
import { Box, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MatchingForm from "../../components/MatchingForm/MatchingForm";
import { Session, SessionState } from "../../models/session.model";
import SessionService from "../../services/session.service";
import MatchingResult from "../../components/MatchingResult/MatchingResult";

const Interview = (): ReactElement => {
  const [session, setSession] = useState<Session>();

  // in case of refresh, check existing session
  useEffect(() => {
    SessionService.getSession().then((session) => setSession(session));
  }, []);

  const getSessionComponent = (): ReactElement => {
    switch (session?.state) {
      case SessionState.NOT_STARTED:
        return <MatchingForm />;
      case SessionState.MATCHING:
      case SessionState.PENDING:
      case SessionState.ACCEPTED:
        return <MatchingResult session={session} />;
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
