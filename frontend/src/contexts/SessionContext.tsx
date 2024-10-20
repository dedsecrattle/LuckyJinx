import UserService from "../services/user.service";
import { UserProfile } from "../models/user.model";
import { createContext, useState, useEffect } from "react";
import { mapUserResponseToUserProfile } from "../util/user.helper";
import { Categories, QuestionComplexity } from "../models/question.model";
import { Socket } from "socket.io-client";

export enum SessionState {
  NOT_STARTED,
  TIMEOUT,
  MATCHING,
  PENDING,
  ACCEPTED,
}

interface SessionContextType {
  socket: Socket | null;
  sessionState: SessionState;
  topic: Categories;
  difficulty: QuestionComplexity;
  otherUserId: string | null;
  otherUserProfile: UserProfile | null;
  matchCount: number; // total number of matching attempts in this connection
  lastMatchingStartTime: number; // millisecond timestamp at the start of the last matching
  userAccepted: boolean;
  userDeclined: boolean;
  otherUserAccepted: boolean;
  otherUserDeclined: boolean;

  setSocket: (socket: Socket) => void;
  setSessionState: (state: SessionState) => void;
  setTopic: (topic: Categories) => void;
  setDifficulty: (difficulty: QuestionComplexity) => void;
  setOtherUserId: (otherUserId: string) => void;
  incrementMatchCount: () => void;
  setLastMatchingStartTime: (time: number) => void;
  setUserAccepted: (accepted: boolean) => void;
  setUserDeclined: (declined: boolean) => void;
  setOtherUserAccepted: (accepted: boolean) => void;
  setOtherUserDeclined: (declined: boolean) => void;

  clearSession: () => void;
}

export const SessionContext = createContext<SessionContextType>({
  socket: null,
  sessionState: SessionState.NOT_STARTED,
  topic: Categories.ALGORITHMS,
  difficulty: "Easy",
  otherUserId: null,
  otherUserProfile: null,
  matchCount: 0,
  lastMatchingStartTime: 0,
  userAccepted: false,
  userDeclined: false,
  otherUserAccepted: false,
  otherUserDeclined: false,
  setSocket: () => {},
  setSessionState: () => {},
  setTopic: () => {},
  setDifficulty: () => {},
  setOtherUserId: () => {},
  clearSession: () => {},
  incrementMatchCount: () => {},
  setLastMatchingStartTime: () => {},
  setUserAccepted: () => {},
  setUserDeclined: () => {},
  setOtherUserAccepted: () => {},
  setOtherUserDeclined: () => {},
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.NOT_STARTED);
  const [topic, setTopic] = useState<Categories>(Categories.ALGORITHMS);
  const [difficulty, setDifficulty] = useState<QuestionComplexity>("Easy");
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [lastMatchingStartTime, setLastMatchingStartTime] = useState<number>(Date.now());
  const [userAccepted, setUserAccepted] = useState<boolean>(false);
  const [userDeclined, setUserDeclined] = useState<boolean>(false);
  const [otherUserAccepted, setOtherUserAccepted] = useState<boolean>(false);
  const [otherUserDeclined, setOtherUserDeclined] = useState<boolean>(false);

  const incrementMatchCount = () => {
    setMatchCount(matchCount + 1);
  };

  const clearSession = () => {
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
    setSessionState(SessionState.NOT_STARTED);
    setTopic(Categories.ALGORITHMS);
    setDifficulty("Easy");
    setOtherUserId(null);
    setOtherUserProfile(null);
    setMatchCount(0);
    setLastMatchingStartTime(Date.now());
    setUserAccepted(false);
    setUserDeclined(false);
    setOtherUserAccepted(false);
    setOtherUserDeclined(false);
  };

  useEffect(() => {
    if (otherUserId) {
      UserService.getUser(otherUserId).then((response) => {
        if (response instanceof Error) {
          console.error(response);
        } else {
          setOtherUserProfile(mapUserResponseToUserProfile(response));
        }
      });
    }
  }, [otherUserId]);

  const value = {
    socket,
    sessionState,
    topic,
    difficulty,
    otherUserId,
    otherUserProfile,
    matchCount,
    lastMatchingStartTime,
    userAccepted,
    userDeclined,
    otherUserAccepted,
    otherUserDeclined,
    setSocket,
    setSessionState,
    setTopic,
    setDifficulty,
    setOtherUserId,
    incrementMatchCount,
    setLastMatchingStartTime,
    setUserAccepted,
    setUserDeclined,
    setOtherUserAccepted,
    setOtherUserDeclined,
    clearSession,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
