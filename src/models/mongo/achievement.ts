import { ObjectId } from 'mongodb';

export interface AchievementDocument {
  _id?: ObjectId;
  title: string;
  description?: string | null;
  criteria?: string | null; // How the achievement is earned
  badge_url?: string | null;
  created_at: Date;
}
