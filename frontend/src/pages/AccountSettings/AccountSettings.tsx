import { ReactElement, useContext, useState } from "react";
import { Autocomplete, Box, Button, TextField, Typography, Alert, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./AccountSettings.scss";
import { UserContext } from "../../contexts/UserContext";
import { JWT_TOKEN_KEY } from "../../util/constants";
import UserService from "../../services/user.service";
import { useConfirmationDialog } from "../../contexts/ConfirmationDialogContext";
import { useNavigate } from "react-router-dom";
import { supportedProgrammingLanguages } from "../../constants/supported_programming_languages";

const AccountSettings = (): ReactElement => {
  const { user, setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [displayedName, setDisplayedName] = useState("Echomo");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [email, setEmail] = useState("echomo@gmail.com");
  const [password, setPassword] = useState("password");

  const { setConfirmationDialogTitle, setConfirmationDialogContent, setConfirmationCallBack, openConfirmationDialog } =
    useConfirmationDialog();

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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

  const logout = () => {
    localStorage.removeItem(JWT_TOKEN_KEY);
    setUser(null);
    navigate("/");
  };

  const openLogoutConfirmationDialog = () => {
    setConfirmationDialogTitle("Log out");
    setConfirmationDialogContent("Are you sure you want to log out?");
    setConfirmationCallBack(() => logout);
    openConfirmationDialog();
  };

  const openDeleteAccountConfirmationDialog = () => {
    if (user?.id) {
      setConfirmationDialogTitle("Delete account");
      setConfirmationDialogContent("Are you sure you want to delete your account? This action cannot be undone.");
      setConfirmationCallBack(() => async () => {
        await UserService.deleteAccount(user.id);
        logout();
      });
      openConfirmationDialog();
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
            <Typography className="AccountSettings-label-name" variant="body1">
              Displayed Name (to others)
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Enter your name"
              className="AccountSettings-input"
              fullWidth
              value={user?.username}
              onChange={(e) => setDisplayedName(e.target.value)}
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography className="AccountSettings-label-avatar" variant="body1">
              Profile Photo
            </Typography>
            <Box className="AccountSettings-photo-section">
              <img
                src={profilePhotoUrl || "https://randomuser.me/api/portraits/men/75.jpg"}
                alt="Profile"
                className="AccountSettings-profile-photo"
              />
              <TextField
                variant="outlined"
                placeholder="Enter new URL to change"
                className="AccountSettings-input"
                fullWidth
                value={profilePhotoUrl}
                onChange={(e) => setProfilePhotoUrl(e.target.value)}
              />
            </Box>
          </Box>

          <Box className="AccountSettings-row">
            <Typography className="AccountSettings-label-language" variant="body1">
              Preferred Programming Language
            </Typography>
            <Autocomplete
              className="AccountSettings-autocomplete"
              options={supportedProgrammingLanguages}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Choose your preferred programming language"
                  className="AccountSettings-input"
                  fullWidth
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                />
              )}
              filterOptions={(options, { inputValue }) =>
                options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase()))
              }
              slotProps={{
                popupIndicator: {
                  className: "AccountSettings-autocomplete-icon",
                },
                clearIndicator: {
                  className: "AccountSettings-autocomplete-icon",
                },
              }}
              fullWidth
            />
          </Box>

          <Box className="AccountSettings-row">
            <Typography className="AccountSettings-label-email" variant="body1">
              Email
            </Typography>
            <TextField
              variant="outlined"
              className="AccountSettings-input"
              fullWidth
              value={user?.email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
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

          <Box className="AccountSettings-buttons">
            <Button
              color="primary"
              variant="contained"
              className="AccountSettings-buttons-save"
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Save Changes"}
            </Button>

            <Box className="AccountSettings-buttons-logout-section">
              <Button
                color="primary"
                variant="contained"
                className="AccountSettings-buttons-logout"
                onClick={openLogoutConfirmationDialog}
                disabled={loading}
              >
                {"Log out"}
              </Button>
              <Button
                color="error"
                variant="contained"
                className="AccountSettings-buttons-delete-account"
                onClick={openDeleteAccountConfirmationDialog}
                disabled={loading}
              >
                {"Delete account"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <Footer />
    </Box>
  );
};

export default AccountSettings;
