import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id?: ObjectId;
  email: string;
  full_name: string;
  role: 'admin' | 'student' | 'teacher';
  avatar_url?: string | null;
  created_at: Date;
  updated_at: Date;
  // Example of handling relationships: list of enrolled class IDs
  enrolled_class_ids?: ObjectId[];
}
