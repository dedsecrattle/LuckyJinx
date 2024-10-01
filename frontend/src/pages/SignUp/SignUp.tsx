import { ReactElement, useState } from "react";
import { Box, Button, Typography, TextField, IconButton, InputAdornment } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./SignUp.scss";

const SignUp = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="SignUp">
      <Navbar />

      <Box className="SignUp-container">
        <Typography variant="body2" className="Home-welcome-title">
          Sign Up
        </Typography>
        <Typography className="SignUp-subtitle" sx={{ mb: 3 }}>
          Empower your interview preparation today! Create an account to unlock exclusive features and personalized
          experiences.
        </Typography>

        <Box className="SignUp-form">
          <TextField label="Enter First Name" variant="outlined" fullWidth />
          <TextField label="Enter Last Name" variant="outlined" fullWidth />
          <TextField label="Enter your Email" variant="outlined" fullWidth />
          <TextField
            label="Enter your Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            className="SignUp-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} className="password-eye-icon" edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button color="primary" variant="contained" className="SignUp-button">
            Sign Up
          </Button>

          <Typography className="SignUp-login">
            Already have an account? <a href="/login">Login</a>
          </Typography>

          {/* <Typography className="SignUp-or">Or Continue with</Typography> */}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default SignUp;
