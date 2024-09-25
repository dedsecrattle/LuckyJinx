import { Box, Button, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./Navbar.scss";

const Navbar = (): ReactElement => {
  return (
    <nav className="Navbar">
      <Typography className="Navbar-title">LuckyJinx</Typography>
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
