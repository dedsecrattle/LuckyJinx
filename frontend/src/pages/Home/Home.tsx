import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import Navbar from "../../components/Navbar/Navbar";
import { Box } from "@mui/material";

const Home = (): ReactElement => {
  const navigate = useNavigate();

  const goToQuestionList = () => {
    navigate("/questions");
  };

  return (
    <Box className="Home">
      <Navbar></Navbar>

      <button onClick={goToQuestionList} className="Home-button">
        Go to Question List
      </button>
    </Box>
  );
};

export default Home;
