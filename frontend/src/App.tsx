import "./App.scss";
import "@fontsource/lexend";
import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import QuestionList from "./pages/QuestionList/QuestionList";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Lexend", "Roboto", "Arial"].join(","),
  },
  palette: {
    primary: {
      main: "#caff33",
    },
    secondary: {
      main: "#ffffff00",
      contrastText: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "82px",
          fontSize: "1rem",
          fontWeight: 400,
          textTransform: "none",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#ffffff",
        },
        body2: {
          color: "#caff33",
        },
      },
    },
  },
});

const App = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<QuestionList />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
