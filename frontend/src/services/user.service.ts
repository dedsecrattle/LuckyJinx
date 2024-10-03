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

  static async login(email: string, password: string): Promise<User | null> {
    try {
      console.log("Attempting to log in with email:", email);
      const response = await UserService.client.post("/auth/login", { email, password });
      const token = response.data.data.accessToken as string;
      localStorage.setItem(JWT_TOKEN_KEY, `Bearer ${token}`);
      return response.data;
    } catch (error: any) {
      return error.response.data;
    }
  }

  static async refreshToken(): Promise<User | null> {
    try {
      const response = await UserService.client.get("/auth/verify-token");
      console.log(response.data);
      return response.data.data;
    } catch (error: any) {
      console.clear();
      return null;
    }
  }
}
