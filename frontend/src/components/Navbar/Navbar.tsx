import { Box, Button, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./Navbar.scss";
import ApiIcon from "@mui/icons-material/Api";
import { useMainDialog } from "../../contexts/MainDialogContext";

const Navbar = (): ReactElement => {
  const { openMainDialog, setMainDialogTitle, setMainDialogContent } = useMainDialog();

  const login = () => {
    setMainDialogTitle("Work in Progress");
    setMainDialogContent("User service is under construction. Check back in a future milestone!");
    openMainDialog();
  };

  return (
    <nav className="Navbar">
      <Box className="Navbar-logo">
        <ApiIcon color="primary" />
        <Typography className="Navbar-title">LuckyJinx</Typography>
      </Box>
      <Box className="Navbar-buttons">
        <Button color="secondary" variant="contained" onClick={login}>
          Sign Up
        </Button>
        <Button color="primary" variant="contained" onClick={login}>
          Login
        </Button>
      </Box>
    </nav>
  );
};

export default Navbar;
