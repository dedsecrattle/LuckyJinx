import "./App.scss";
import "@fontsource/lexend";
import { ReactElement, useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
//import QuestionList from "./pages/QuestionList/QuestionList";
import { createTheme, ThemeProvider } from "@mui/material";
import { MainDialogContextProvider } from "./contexts/MainDialogContext";
import { ConfirmationDialogContextProvider } from "./contexts/ConfirmationDialogContext";
import { UserContext, UserContextProvider } from "./contexts/UserContext";

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
          minWidth: "40vw",
          borderRadius: "10px",
          background: "#1c1c1c",
          padding: "20px 20px",
        },
      },
    },
  },
});

const App = (): ReactElement => {
  const { user, setUser } = useContext(UserContext);
  return (
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <MainDialogContextProvider>
          <ConfirmationDialogContextProvider>
            <Routes>
              <Route path="/" element={user ? <Home /> : <Navigate to={"/login"} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/settings" element={<AccountSettings />} />
              {/* <Route path="/questions" element={<QuestionList />} /> */}
            </Routes>
          </ConfirmationDialogContextProvider>
        </MainDialogContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
};

export default App;
