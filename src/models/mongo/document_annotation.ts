import { ObjectId } from 'mongodb';

export interface DocumentAnnotationDocument {
  _id?: ObjectId;
  document_id: ObjectId; // Reference to Document's _id
  user_id: ObjectId; // Reference to User's _id
  content: string;
  page_number?: number | null;
  position_x?: number | null; // Relative position (e.g., percentage)
  position_y?: number | null; // Relative position (e.g., percentage)
  created_at: Date;
  updated_at: Date;
}
