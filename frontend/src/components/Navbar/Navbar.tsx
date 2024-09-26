import { Box, Button, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./Navbar.scss";
import ApiIcon from "@mui/icons-material/Api";

const Navbar = (): ReactElement => {
  return (
    <nav className="Navbar">
      <Box className="Navbar-logo">
        <ApiIcon color="primary" />
        <Typography className="Navbar-title">LuckyJinx</Typography>
      </Box>
      <Box className="Navbar-buttons">
        <Button color="secondary" variant="contained">
          Sign Up
        </Button>
        <Button color="primary" variant="contained">
          Login
        </Button>
      </Box>
    </nav>
  );
};

export default Navbar;
