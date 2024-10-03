import { Box, Button, Typography } from "@mui/material";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Navbar.scss";
import ApiIcon from "@mui/icons-material/Api";

const Navbar = (): ReactElement => {
  const navigate = useNavigate();

  const redirectToSignUp = () => {
    navigate("/signup");
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="Navbar">
      <Box className="Navbar-logo">
        <ApiIcon color="primary" />
        <Typography className="Navbar-title">LuckyJinx</Typography>
      </Box>
      <Box className="Navbar-buttons">
        <Button color="secondary" variant="contained" onClick={redirectToSignUp}>
          Sign Up
        </Button>
        <Button color="primary" variant="contained" onClick={redirectToLogin}>
          Login
        </Button>
      </Box>
    </nav>
  );
};

export default Navbar;
