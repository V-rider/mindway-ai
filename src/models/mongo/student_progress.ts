import { ObjectId } from 'mongodb';

export interface StudentProgressDocument {
  _id?: ObjectId;
  student_id: ObjectId; // Reference to User's _id
  material_id: ObjectId; // Reference to LearningMaterial's _id
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number | null;
  completed_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}
