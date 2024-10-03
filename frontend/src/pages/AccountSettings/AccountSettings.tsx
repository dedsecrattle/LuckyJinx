import { ReactElement, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./AccountSettings.scss";

const AccountSettings = (): ReactElement => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [displayedName, setDisplayedName] = useState("Echomo");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [email, setEmail] = useState("echomo@gmail.com");
  const [password, setPassword] = useState("password");

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);
    setConfirmationMessage(null);

    try {
      if (!displayedName || !email || !password) {
        throw new Error("Displayed name, email, and password are required.");
      }
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === "error@example.com") {
            reject(new Error("Email already in use."));
          } else {
            resolve("Account details updated successfully!");
          }
        }, 3000);
      });

      setConfirmationMessage("Account details saved successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="AccountSettings">
      <Navbar />
      <Box className="AccountSettings-container">
        <Typography variant="body2" className="Home-welcome-title">
          Account Settings
        </Typography>
        <Typography className="AccountSettings-subtitle" sx={{ mb: 3 }}>
          Customize your information and experience here!
        </Typography>

        <form
          className="AccountSettings-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          <Box className="AccountSettings-row">
            <Typography variant="body1">Displayed Name (to others)</Typography>
            <TextField
              variant="outlined"
              placeholder="Enter your name"
              className="AccountSettings-input"
              fullWidth
              value={displayedName}
              onChange={(e) => setDisplayedName(e.target.value)}
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography variant="body1">Profile Photo</Typography>
            <Box className="AccountSettings-photo-section">
              <img
                src={profilePhotoUrl || "https://randomuser.me/api/portraits/men/75.jpg"}
                alt="Profile"
                className="AccountSettings-profile-photo"
              />
              <TextField
                variant="outlined"
                placeholder="Enter new URL to change"
                className="AccountSettings-url-input"
                fullWidth
                value={profilePhotoUrl}
                onChange={(e) => setProfilePhotoUrl(e.target.value)}
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
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography variant="body1">Password</Typography>
            <TextField
              variant="outlined"
              className="AccountSettings-input"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {confirmationMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {confirmationMessage}
            </Alert>
          )}

          <Button
            color="primary"
            variant="contained"
            className="AccountSettings-save-button"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default AccountSettings;
