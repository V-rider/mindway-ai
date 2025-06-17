import { ObjectId } from 'mongodb';

export interface DocumentDocument {
  _id?: ObjectId;
  title: string;
  description?: string | null;
  file_url: string; // URL to the document, e.g., S3, Google Cloud Storage
  file_type: string; // e.g., 'pdf', 'docx'
  file_size: number; // in bytes
  uploaded_by: ObjectId; // Reference to User's _id
  class_id: ObjectId; // Reference to Class's _id
  created_at: Date;
  updated_at: Date;
}
