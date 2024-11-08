import { ReactElement, useContext, useEffect, useState } from "react";
import styles from "./History.module.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Button, Typography } from "@mui/material";
import Footer from "../../components/Footer/Footer";
import Spinner from "../../components/Spinner/Spinner";
import SessionService, { SessionData } from "../../services/session.service";
import { UserContext } from "../../contexts/UserContext";
import { AxiosError } from "axios";

const History = (): ReactElement => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        setLoading(true);
        const sessionHistory = await SessionService.getSessionHistory(user?.id as string);
        setSessionHistory(sessionHistory);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSessionHistory();
    }
  }, [user]);

  return (
    <Box className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <Typography variant="h5" gutterBottom>
          Session History
        </Typography>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Typography align="center" color="error">
            {error}
          </Typography>
        ) : (
          <div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => {}} className={`${styles.clickable} ${styles["asc"]}`}>
                    Start time
                  </th>
                  <th onClick={() => {}} className={`${styles.clickable} ${styles["asc"]}`}>
                    Question
                  </th>
                  <th onClick={() => {}} className={`${styles.clickable} ${styles["asc"]}`}>
                    Partner
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessionHistory.map((session) => (
                  <tr key={session.roomNumber}>
                    <td>{session.questionId}</td>
                    <td>
                      <Button className={styles.questiontitle} onClick={() => {}}>
                        {`${session.questionId}. ${session.questionTitle}`}
                      </Button>
                    </td>
                    <td>{session.otherUserName}</td>
                    <td className={styles.complexity}>
                      <Button variant="outlined" color="primary" onClick={() => {}}>
                        View submission
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </Box>
  );
};

export default History;
