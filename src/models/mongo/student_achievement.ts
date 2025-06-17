import { ObjectId } from 'mongodb';

export interface StudentAchievementDocument {
  _id?: ObjectId;
  student_id: ObjectId; // Reference to User's _id
  achievement_id: ObjectId; // Reference to Achievement's _id
  earned_at: Date;
}
