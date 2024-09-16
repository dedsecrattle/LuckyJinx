import "./App.scss";
import { ReactElement } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";

const App = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default App;
