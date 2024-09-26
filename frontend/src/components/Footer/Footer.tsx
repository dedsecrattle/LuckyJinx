import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./Footer.scss";
import GitHubIcon from "@mui/icons-material/GitHub";
import ApiIcon from "@mui/icons-material/Api";

const Footer = (): ReactElement => {
  return (
    <footer className="Footer">
      <Container className="Footer-logo">
        <ApiIcon color="primary" />
        <Typography>LuckyJinx</Typography>
      </Container>
      <Box className="Footer-bottom">
        <IconButton className="Footer-github">
          <GitHubIcon />
        </IconButton>
        <Typography className="Footer-trademark">Lucky Jinx 2024 All Rights Reserved</Typography>
        <Button>Terms of Service</Button>
      </Box>
    </footer>
  );
};

export default Footer;
