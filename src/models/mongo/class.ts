import { ObjectId } from 'mongodb';

export interface ClassDocument {
  _id?: ObjectId;
  name: string;
  description?: string | null;
  teacher_id: ObjectId; // Reference to User's _id
  student_ids?: ObjectId[]; // Array of enrolled student User _ids
  created_at: Date;
  updated_at: Date;
}
