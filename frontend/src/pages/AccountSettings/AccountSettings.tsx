import { ReactElement, useState } from "react";
import { Autocomplete, Box, Button, TextField, IconButton, InputAdornment, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./AccountSettings.scss";

const AccountSettings = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowEmail = () => setShowEmail(!showEmail);
  const programmingLanguages = [
    "JavaScript",
    "Python2",
    "Python3",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "PHP",
    "Swift",
    "Kotlin",
    "Rust",
    "TypeScript",
    "R",
    "Perl",
    "Scala",
    "Objective-C",
    "Dart",
    "Elixir",
    "Haskell",
    "MATLAB",
  ];

  return (
    <Box className="AccountSettings">
      <Navbar />
      <Box className="AccountSettings-container">
        <Typography variant="body2" className="Home-welcome-title">
          Login
        </Typography>
        <Typography className="AccountSettings-subtitle" sx={{ mb: 3 }}>
          Customize your information and experience here!{" "}
        </Typography>

        <form className="AccountSettings-form">
          <Box className="AccountSettings-row">
            <Typography variant="body1">Displayed Name (to others)</Typography>
            <TextField
              variant="outlined"
              placeholder="Enter your name"
              className="AccountSettings-input"
              fullWidth
              defaultValue="Echomo"
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography variant="body1">Profile Photo</Typography>
            <Box className="AccountSettings-photo-section">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Profile"
                className="AccountSettings-profile-photo"
              />
              <TextField
                variant="outlined"
                placeholder="Enter new URL to change"
                className="AccountSettings-url-input"
                fullWidth
              />
            </Box>
          </Box>

          <Box className="AccountSettings-row">
            <Typography variant="body1">Preferred Programming Language</Typography>
            <Autocomplete
              options={programmingLanguages}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Enter your preferred programming language"
                  className="AccountSettings-input"
                  fullWidth
                />
              )}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
              }
              fullWidth
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography variant="body1">Email</Typography>
            <TextField
              variant="outlined"
              className="AccountSettings-input"
              fullWidth
              defaultValue="echomo@gmail.com"
              type={showEmail ? "text" : "email"}
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography variant="body1">Password</Typography>
            <TextField
              variant="outlined"
              className="AccountSettings-input"
              fullWidth
              type={showPassword ? "text" : "password"}
              defaultValue="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button color="primary" variant="contained" className="AccountSettings-save-button">
            Save Changes
          </Button>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default AccountSettings;
