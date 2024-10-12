import { Categories, QuestionComplexity } from "./question.model";
import { UserProfile } from "./user.model";

export enum SessionState {
  NOT_STARTED,
  MATCHING,
  PENDING,
  ACCEPTED,
}

export interface Session {
  state: SessionState;
  topics?: Categories[];
  difficulty: QuestionComplexity;

  // after matching
  sessionId?: string;
  chosenTopic?: Categories;
  userOneProfile?: UserProfile;
  userTwoProfile?: UserProfile;
}
