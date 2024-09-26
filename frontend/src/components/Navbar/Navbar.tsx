import { Box, Button, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./Navbar.scss";
import ApiIcon from "@mui/icons-material/Api";
import { useMainDialog } from "../../contexts/MainDialogContext";

const Navbar = (): ReactElement => {
  const { openDialog, setTitle, setContent } = useMainDialog();

  const login = () => {
    setTitle("Work in Progress");
    setContent("User service is under construction. Check back in a future milestone!");
    openDialog();
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
