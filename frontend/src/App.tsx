import "./App.scss";
import "@fontsource/lexend";
import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
//import QuestionList from "./pages/QuestionList/QuestionList";
import { createTheme, ThemeProvider } from "@mui/material";
import MainDialog from "./components/MainDialog/MainDialog";
import { MainDialogContextProvider } from "./contexts/MainDialogContext";

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
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "10px",
          background: "#1c1c1c",
          padding: "20px 20px",
        },
      },
    },
  },
});

const App = (): ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <MainDialogContextProvider>
        <MainDialog />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/questions" element={<QuestionList />} /> */}
        </Routes>
      </MainDialogContextProvider>
    </ThemeProvider>
  );
};

export default App;
