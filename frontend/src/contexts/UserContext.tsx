import { guestUser } from "../constants/guest_user";
import { User } from "../models/user.model";
import UserService from "../services/user.service";
import { UserProfile } from "../types/user.profile";
import { createContext, useState, useEffect, useContext } from "react";

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const response: User | null = await UserService.refreshToken();
      if (response) {
        setUser({
          username: response.username,
          email: response.email,
          name: response.name,
          role: response.isAdmin ? "admin" : "user",
          avatar: "https://www.gravatar.com/avatar/",
        });
      } else {
        setUser(guestUser);
      }
    }
    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
