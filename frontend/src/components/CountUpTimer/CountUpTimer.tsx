import { Box, Typography } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";

const CountUpTimer = (): ReactElement => {
  const [time, setTime] = useState<number>(0);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
      // TODO: check session
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <Box>
      <Typography variant="h4">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Typography>
    </Box>
  );
};

export default CountUpTimer;
