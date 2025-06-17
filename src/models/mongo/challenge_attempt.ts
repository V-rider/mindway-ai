import { ObjectId } from 'mongodb';

export interface ChallengeAttemptDocument {
  _id?: ObjectId;
  student_id: ObjectId; // Reference to User's _id
  challenge_id: ObjectId; // Reference to MathChallenge's _id
  attempt_text?: string | null;
  is_correct?: boolean | null;
  attempted_at: Date;
}
