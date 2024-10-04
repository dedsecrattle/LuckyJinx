import { Box, Button, Typography } from "@mui/material";
import { ReactElement, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Navbar.scss";
import ApiIcon from "@mui/icons-material/Api";
import { UserContext } from "../../contexts/UserContext";

const Navbar = (): ReactElement => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const redirectToSignUp = () => {
    navigate("/signup");
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const redirectToAccount = () => {
    navigate("/settings");
  };

  return (
    <nav className="Navbar">
      <Box className="Navbar-logo">
        <ApiIcon color="primary" />
        <Typography className="Navbar-title">LuckyJinx</Typography>
      </Box>
      <Box className="Navbar-buttons">
        {user ? (
          <Button color="primary" variant="contained" onClick={redirectToAccount}>
            {user?.username}
          </Button>
        ) : (
          <>
            <Button color="secondary" variant="contained" onClick={redirectToSignUp}>
              Sign Up
            </Button>
            <Button color="primary" variant="contained" onClick={redirectToLogin}>
              Login
            </Button>
          </>
        )}
      </Box>
    </nav>
  );
};

export default Navbar;
