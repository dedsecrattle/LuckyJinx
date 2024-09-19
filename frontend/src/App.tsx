import "./App.scss";
import { ReactElement } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import QuestionList from "./pages/QuestionList/QuestionList";

const App = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questions" element={<QuestionList />} />
    </Routes>
  );
};

export default App;
