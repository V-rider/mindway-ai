import { ObjectId } from 'mongodb';

export interface MathChallengeDocument {
  _id?: ObjectId;
  title: string;
  description?: string | null;
  difficulty_level: number; // e.g., 1 to 5
  problem_text: string;
  solution: string; // Could be text, or structured (e.g., steps)
  created_at: Date;
  updated_at: Date;
}
