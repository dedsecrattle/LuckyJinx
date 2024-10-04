import { UserProfile } from "../types/user.profile";

export const isAdmin = (user: UserProfile | null): boolean => {
  return user?.role === "admin";
};

export interface UserValidationErrors {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  avatar?: string | null;
}

export const validateName = (name: string): string | null => {
  if (!name) {
    return "Name is required.";
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : "Please enter a valid email.";
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required.";
  }
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password)
    ? null
    : "Password must be at least 8 characters long and contain letters and numbers.";
};

export const validateAvatar = (avatar: string): string | null => {
  if (!avatar) {
    return "Profile photo URL is required.";
  }
  try {
    new URL(avatar);
  } catch (_) {
    return "Please enter a valid URL.";
  }
  return null;
};
