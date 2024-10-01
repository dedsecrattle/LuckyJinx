import { ReactElement, useState } from "react";
import { Box, Button, Typography, TextField, IconButton, InputAdornment } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Login.scss";

const Login = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box className="Login">
      <Navbar />

      <Box className="Login-container">
        <Typography variant="body2" className="Home-welcome-title">
          Login
        </Typography>
        <Typography className="Login-subtitle" sx={{ mb: 3 }}>
          Welcome back! Please log in to access your account.
        </Typography>

        <Box className="Login-form" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            <TextField label="Enter your Email" variant="outlined" fullWidth sx={{ mr: 1 }} />
            <TextField
              label="Enter your Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
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
          </Box>
          <Typography
            component="a"
            href="/forgot-password"
            className="forgot-password"
            sx={{ textDecoration: "underline", textAlign: "center" }}
          >
            Forgot password?
          </Typography>

          <Button color="primary" variant="contained" className="LoginUp-button">
            Login
          </Button>

          <Typography className="Login-signup">
            Not registered yet? <a href="/signup">Sign Up</a>
          </Typography>

          {/* <Typography className="SignUp-or">Or Continue with</Typography> */}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;
