import { ObjectId } from 'mongodb';

export interface LearningMaterialDocument {
  _id?: ObjectId;
  title: string;
  description?: string | null;
  content?: string | null; // Could be rich text, JSON, or reference to other storage
  type: 'lesson' | 'quiz' | 'assignment';
  class_id: ObjectId; // Reference to Class's _id
  created_by: ObjectId; // Reference to User's _id (teacher/admin)
  created_at: Date;
  updated_at: Date;
}
