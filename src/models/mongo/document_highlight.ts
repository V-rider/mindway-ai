import { ObjectId } from 'mongodb';

export interface DocumentHighlightDocument {
  _id?: ObjectId;
  document_id: ObjectId; // Reference to Document's _id
  user_id: ObjectId; // Reference to User's _id
  content: string; // The highlighted text
  page_number?: number | null;
  start_position?: number | null; // Character offset or similar
  end_position?: number | null; // Character offset or similar
  created_at: Date;
}
