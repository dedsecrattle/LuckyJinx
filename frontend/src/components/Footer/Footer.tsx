import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import { ReactElement } from "react";
import "./Footer.scss";
import GitHubIcon from "@mui/icons-material/GitHub";
import ApiIcon from "@mui/icons-material/Api";
import { gitHubUrl } from "../../constants/urls";
import { useMainDialog } from "../../contexts/MainDialogContext";

const Footer = (): ReactElement => {
  const { openDialog, setTitle, setContent } = useMainDialog();

  const openTermsOfService = () => {
    setTitle("Work in Progress");
    setContent("Terms of service is under construction. Check back in a future milestone!");
    openDialog();
  };

  return (
    <footer className="Footer">
      <Container className="Footer-logo">
        <ApiIcon color="primary" />
        <Typography>LuckyJinx</Typography>
      </Container>
      <Box className="Footer-bottom">
        <a href={gitHubUrl} target="_blank" rel="noreferrer noopener">
          <IconButton className="Footer-github">
            <GitHubIcon />
          </IconButton>
        </a>
        <Typography className="Footer-trademark">Lucky Jinx 2024 All Rights Reserved</Typography>
        <Button className="Footer-terms" onClick={openTermsOfService}>
          Terms of Service
        </Button>
      </Box>
    </footer>
  );
};

export default Footer;
