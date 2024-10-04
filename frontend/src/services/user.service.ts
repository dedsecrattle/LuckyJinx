import axios, { AxiosError } from "axios";
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

  static async login(email: string, password: string): Promise<User | AxiosError> {
    try {
      const response = await UserService.client.post("/auth/login", { email, password });
      const token = response.data.data.accessToken as string;
      localStorage.setItem(JWT_TOKEN_KEY, `Bearer ${token}`);
      return response.data.data;
    } catch (error: any) {
      return error as AxiosError;
    }
  }

  static async signup(email: string, password: string, username: string): Promise<User | AxiosError> {
    try {
      const response = await UserService.client.post("/users/", { username, email, password });
      return response.data;
    } catch (error: any) {
      return error as AxiosError;
    }
  }

  static async refreshToken(): Promise<User | null> {
    try {
      const response = await UserService.client.get("/auth/verify-token");
      return response.data.data;
    } catch (error: any) {
      return null;
    }
  }

  static async deleteAccount(id: String): Promise<void | AxiosError> {
    try {
      await UserService.client.delete(`/users/${id}`);
    } catch (error: any) {
      return error as AxiosError;
    }
  }
}
