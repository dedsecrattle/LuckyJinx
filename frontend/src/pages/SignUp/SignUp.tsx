import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, TextField, IconButton, InputAdornment, Alert, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./SignUp.scss";
import UserService from "../../services/user.service";
import { AxiosError } from "axios";

const SignUp = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ userName?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignUp = async () => {
    setErrors({});
    setSignUpError(null);

    let formValid = true;
    const newErrors: { userName?: string; email?: string; password?: string } = {};

    if (!userName) {
      formValid = false;
      newErrors.userName = "username is required.";
    }

    // Email validation
    if (!email) {
      formValid = false;
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      formValid = false;
      newErrors.email = "Please enter a valid email.";
    }

    // Password validation
    if (!password) {
      formValid = false;
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      formValid = false;
      newErrors.password = "Password must be at least 8 characters long and contain letters and numbers.";
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }
    const data = await UserService.signup(email, password, userName);
    if (data instanceof AxiosError) {
      setSignUpError("An unexpected error occurred. Please try again.");
      return;
    }
    navigate("/login");
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

        <Box className="SignUp-form" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {loading ? (
            <CircularProgress sx={{ mb: 3 }} />
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2, width: "100%", mb: 2 }}>
                <TextField
                  label="username"
                  variant="outlined"
                  fullWidth
                  value={userName}
                  onChange={(e) => setuserName(e.target.value)}
                  error={!!errors.userName}
                  helperText={errors.userName}
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, width: "100%", mb: 2 }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {signUpError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {signUpError}
                </Alert>
              )}

              <Button color="primary" variant="contained" className="SignUp-button" onClick={handleSignUp}>
                Sign Up
              </Button>

              <Typography className="SignUp-login">
                Already have an account? <a href="/login">Login</a>
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default SignUp;
