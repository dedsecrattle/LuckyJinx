import { ReactElement } from "react";
import logo from "../../logo.svg";
import "./Home.scss";

const Home = (): ReactElement => {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>Welcome to lucKY JiNX!</p>
      </header>
    </div>
  );
};

export default Home;
