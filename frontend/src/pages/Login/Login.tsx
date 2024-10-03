import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, TextField, IconButton, InputAdornment, Alert, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Login.scss";
import UserService from "../../services/user.service";
import { UserContext } from "../../contexts/UserContext";

const Login = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setErrors({});
    setLoginError(null);

    let formValid = true;
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      formValid = false;
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      formValid = false;
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      formValid = false;
      newErrors.password = "Password is required.";
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await UserService.login(email, password);
      if (response) {
        setUser({
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.isAdmin ? "admin" : "user",
          avatar: "https://www.gravatar.com/avatar/",
        });
      } else {
        setLoginError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setLoginError("An unexpected error occurred. Please try again.");
    }
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
          {loading ? (
            <CircularProgress sx={{ mb: 3 }} />
          ) : (
            <>
              <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
                <TextField
                  label="Enter your Email"
                  variant="outlined"
                  fullWidth
                  sx={{ mr: 1 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
                <TextField
                  label="Enter your Password"
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

              {loginError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {loginError}
                </Alert>
              )}

              <Button color="primary" variant="contained" className="LoginUp-button" onClick={handleLogin}>
                Login
              </Button>

              <Typography className="Login-signup">
                Not registered yet? <a href="/signup">Sign Up</a>
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;
