import axios from "axios";
import QuestionService from "./question.service";
import UserService from "./user.service";
import { User } from "../models/user.model";

export type Language = "python" | "cpp" | "java";

export interface SessionResponse {
  roomNumber: string;
  questionId: number;
  otherUserId: string;
  isOngoing?: boolean;
  submission?: string;
  language?: Language;
  createdAt?: string;
}

// Data needed for displaying a session
export interface SessionData {
  roomNumber: string;
  questionId: number;
  questionTitle: string;
  questionDescription: string;
  otherUserId: string;
  otherUserName: string;
  isOngoing?: boolean;
  submission?: string;
  language?: Language;
  createdAt?: Date;
}

export default class SessionService {
  private static client = SessionService.createClient();

  private static createClient() {
    const client = axios.create({
      baseURL: process.env.REACT_APP_MATCHING_SERVICE_URL as string,
      headers: {
        "Content-type": "application/json",
      },
    });
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem("jwt-token");
      if (token) {
        config.headers["Authorization"] = token;
      }
      return config;
    });
    return client;
  }

  private static async mapSessionResponseToSessionData(session: SessionResponse): Promise<SessionData> {
    try {
      const { title, description } = await QuestionService.getQuestion(session.questionId);
      const user: User | Error = await UserService.getUser(session.otherUserId);

      if (user instanceof Error) {
        throw user;
      }

      return {
        roomNumber: session.roomNumber,
        questionId: session.questionId,
        questionTitle: title ?? "Deleted question",
        questionDescription: description ?? "Description not available",
        otherUserId: session.otherUserId,
        otherUserName: (user.username as string) ?? "Deleted user",
        isOngoing: session.isOngoing,
        submission: session.submission,
        language: session.language,
        createdAt: session.createdAt ? new Date(session.createdAt) : undefined,
      };
    } catch (error) {
      return {
        roomNumber: session.roomNumber,
        questionId: session.questionId,
        questionTitle: "Error fetching question",
        questionDescription: "Error fetching question",
        otherUserId: session.otherUserId,
        otherUserName: "Error fetching user",
        isOngoing: session.isOngoing,
        submission: session.submission,
        language: session.language,
      };
    }
  }

  static async getLatestSession(userId: string): Promise<SessionResponse | null> {
    const response = await SessionService.client.get("/session", { params: { userId } });
    return response.data.session;
  }

  static async getSessionHistory(userId: string, count?: number): Promise<SessionData[]> {
    const response = await SessionService.client.get("/session-history", { params: { userId, count } });
    const sessions: SessionResponse[] = response.data.sessions;
    const sessionData = await Promise.all(sessions.map(this.mapSessionResponseToSessionData));
    return sessionData;
  }

  static async leaveSession(userId: string, roomId: string): Promise<void> {
    await SessionService.client.put("/leave-session", { data: { userId, roomId } });
  }

  static async rejoinSession(userId: string, roomId: string): Promise<SessionResponse> {
    const response = await SessionService.client.put("/rejoin-session", { data: { userId, roomId } });
    return response.data;
  }

  static async submitSession(userId: string, roomId: string, submission: string, language: Language): Promise<void> {
    await SessionService.client.put("/submit-session", { data: { userId, roomId, submission, language } });
  }
}
