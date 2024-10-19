import { Box, Typography } from "@mui/material";
import { ReactElement, useContext, useEffect, useState } from "react";
import { SessionContext, SessionState } from "../../contexts/SessionContext";

const MATCHING_TIMEOUT_INTERVAL_SECONDS = 30;

const getTotalMatchingTimeSeconds = (matchCount: number, lastMatchingStartTime: number): number => {
  const currentTime = Date.now();
  return Math.floor(matchCount * MATCHING_TIMEOUT_INTERVAL_SECONDS + (currentTime - lastMatchingStartTime) / 1000);
};

const CountUpTimer = (): ReactElement => {
  const { sessionState, matchCount, lastMatchingStartTime } = useContext(SessionContext);

  const [time, setTime] = useState<number>(
    sessionState === SessionState.TIMEOUT
      ? (matchCount + 1) * MATCHING_TIMEOUT_INTERVAL_SECONDS // handle initial timer value when navigate away then back
      : getTotalMatchingTimeSeconds(matchCount, lastMatchingStartTime),
  );
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionState !== SessionState.TIMEOUT) {
        setTime(getTotalMatchingTimeSeconds(matchCount, lastMatchingStartTime));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionState, time, matchCount, lastMatchingStartTime]);

  return (
    <Box>
      <Typography variant="h4">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Typography>
    </Box>
  );
};

export default CountUpTimer;
