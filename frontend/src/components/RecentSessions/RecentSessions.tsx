import { Box, Button, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./RecentSessions.scss";

const RecentSessions = (): ReactElement => {
  return (
    <Box className="RecentSessions">
      <Typography className="RecentSessions-title">Recent Sessions</Typography>
      <Box className="RecentSessions-sessions">
        <Typography className="RecentSessions-sessions-text">
          Session history is under construction, check back in a future milestone!
        </Typography>
      </Box>
      <Typography className="RecentSessions-new-title">Technical Interview Prep Session</Typography>
      <Box className="RecentSessions-new">
        <Button className="RecentSessions-new-button" color="primary" variant="contained">
          Start new session
        </Button>
      </Box>
    </Box>
  );
};

export default RecentSessions;
