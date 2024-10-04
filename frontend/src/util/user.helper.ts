import { UserProfile } from "../types/user.profile";

export const isAdmin = (user: UserProfile | null): boolean => {
  return user?.role === "admin";
};
