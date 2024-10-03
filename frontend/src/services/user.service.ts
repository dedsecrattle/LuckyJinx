import axios from "axios";
import { User } from "../models/user.model";
import { JWT_TOKEN_KEY } from "../util/constants";

export default class UserService {
  private static client = axios.create({
    baseURL: process.env.REACT_APP_USER_SERVICE_URL as string,
    headers: {
      "Content-type": "application/json",
      authorization: localStorage.getItem(JWT_TOKEN_KEY),
    },
  });

  static async login(email: string, password: string): Promise<User> {
    try {
      console.log("Attempting to log in with email:", email);
      const response = await UserService.client.post("/auth/login", { email, password });
      console.log("Login response:", response.data);
      const token = response.data.accessToken as string;
      localStorage.setItem(JWT_TOKEN_KEY, `Bearer ${token}`);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  static async refreshToken(): Promise<User | null> {
    try {
      console.log("Attempting to refresh token");
      const response = await UserService.client.get("/auth/verify-token");
      console.log("Token refresh response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }
}
