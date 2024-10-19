import UserService from "../services/user.service";
import { UserProfile } from "../models/user.model";
import { createContext, useState, useEffect } from "react";
import { mapUserResponseToUserProfile } from "../util/user.helper";
import { Categories, QuestionComplexity } from "../models/question.model";

export enum SessionState {
  NOT_STARTED,
  MATCHING,
  PENDING,
  ACCEPTED,
}

interface SessionContextType {
    sessionState: SessionState;
    topic: Categories;
    difficulty: QuestionComplexity;
    otherUserId: string | null;
    otherUserProfile: UserProfile | null;
    setSessionState: (state: SessionState) => void;
    setTopic: (topic: Categories) => void;
    setDifficulty: (difficulty: QuestionComplexity) => void;
    setOtherUserId: (otherUserId: string) => void;
}

export const SessionContext = createContext<SessionContextType>({
    sessionState: SessionState.NOT_STARTED,
    topic: Categories.ALGORITHMS,
    difficulty: "Easy",
    otherUserId: null,
    otherUserProfile: null,
    setSessionState: () => {},
    setTopic: () => {},
    setDifficulty: () => {},
    setOtherUserId: () => {},
});

export const SessionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessionState, setSessionState] = useState<SessionState>(SessionState.NOT_STARTED);
    const [topic, setTopic] = useState<Categories>(Categories.ALGORITHMS);
    const [difficulty, setDifficulty] = useState<QuestionComplexity>("Easy");
    const [otherUserId, setOtherUserId] = useState<string | null>(null);
    const [otherUserProfile, setOtherUserProfile] = useState<UserProfile | null>(null);

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
        sessionState,
        topic,
        difficulty,
        otherUserId,
        setSessionState,
        setTopic,
        setDifficulty,
        setOtherUserId,
        otherUserProfile,
    };

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
