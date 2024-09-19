import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import "./Home.scss";

const Home = (): ReactElement => {
  const navigate = useNavigate();

  const goToQuestionList = () => {
    navigate("/questions");
  };

  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>Welcome to lucKY JiNX!</p>
        <button onClick={goToQuestionList} className="Home-button">
          Go to Question List
        </button>
      </header>
    </div>
  );
};

export default Home;
