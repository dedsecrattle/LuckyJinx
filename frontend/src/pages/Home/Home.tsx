import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Box, Button, Typography } from "@mui/material";
import CodeEditorImage from "../../assets/code_editor.svg";
import Footer from "../../components/Footer/Footer";

const Home = (): ReactElement => {
  const navigate = useNavigate();

  const goToQuestionList = () => {
    navigate("/questions");
  };

  return (
    <Box className="Home">
      <Navbar />

      <Box className="Home-welcome">
        <Box className="Home-welcome-text">
          <Typography className="Home-welcome-title">
            Welcome to LuckyJinx <br /> Empowering Your{" "}
          </Typography>
          <Typography variant="body2" className="Home-welcome-title">
            Interview Preparation
          </Typography>

          <Typography className="Home-welcome-description">
            Collaborate with other enthusiastic coders to prepare for your technical interviews! Select a difficulty
            level and a topic, and we will immediately select a question and match you with another coder. You can then
            start on developing a solution to the problem.
          </Typography>

          <Button color="primary" variant="contained">
            Get Started
          </Button>
        </Box>

        <Box className="Home-welcome-image">
          <img src={CodeEditorImage} alt="Code Editor" />
        </Box>
      </Box>

      <button onClick={goToQuestionList} className="Home-button">
        Go to Question List
      </button>

      <Footer />
    </Box>
  );
};

export default Home;
