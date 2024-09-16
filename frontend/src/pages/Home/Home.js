import logo from "../../logo.svg";
import "./Home.scss";

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>Welcome to lucKY JiNX!</p>
      </header>
    </div>
  );
}

export default Home;
