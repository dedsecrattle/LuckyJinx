import { SupportedProgrammingLanguages } from "../constants/supported_programming_languages";
import { Categories } from "../models/question.model";
import { Session, SessionState } from "../models/session.model";

const MOCK_SESSION_NOT_STARTED: Session = {
  state: SessionState.NOT_STARTED,
  topics: [Categories.ALGORITHMS, Categories.DATA_STRUCTURES],
  difficulty: "Easy",
};

const MOCK_SESSION_MATCHING: Session = {
  state: SessionState.MATCHING,
  topics: [Categories.ALGORITHMS, Categories.DATA_STRUCTURES],
  difficulty: "Easy",
};

const MOCK_SESSION_PENDING: Session = {
  state: SessionState.PENDING,
  topics: [Categories.ALGORITHMS, Categories.DATA_STRUCTURES],
  difficulty: "Easy",
  sessionId: "1",
  chosenTopic: Categories.ALGORITHMS,
  userOneProfile: {
    id: "1",
    username: "user1",
    email: "user1@test.com",
    avatar: "https://avatar.iran.liara.run/public/boy",
    role: "user",
    language: SupportedProgrammingLanguages.python,
  },
  userTwoProfile: {
    id: "2",
    username: "user2",
    email: "user2@test.com",
    avatar: "https://avatar.iran.liara.run/public/girl",
    role: "admin",
    language: SupportedProgrammingLanguages.java,
  },
};

const MOCK_SESSION_ACCEPTED: Session = {
  state: SessionState.PENDING,
  topics: [Categories.ALGORITHMS, Categories.DATA_STRUCTURES],
  difficulty: "Easy",
  sessionId: "1",
  chosenTopic: Categories.ALGORITHMS,
  userOneProfile: {
    id: "1",
    username: "user1",
    email: "user1@test.com",
    avatar: "https://avatar.iran.liara.run/public/boy",
    role: "user",
    language: SupportedProgrammingLanguages.python,
  },
  userTwoProfile: {
    id: "2",
    username: "user2",
    email: "user2@test.com",
    avatar: "https://avatar.iran.liara.run/public/girl",
    role: "admin",
    language: SupportedProgrammingLanguages.java,
  },
};

export default class SessionService {
  static async getSession(): Promise<Session> {
    return MOCK_SESSION_MATCHING;
  }
}
