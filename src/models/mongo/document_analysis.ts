import { ObjectId, BSON } from 'mongodb'; // BSON for Json type

export interface DocumentAnalysisDocument {
  _id?: ObjectId;
  document_id: ObjectId; // Reference to Document's _id
  analysis_type: 'summary' | 'key_points' | 'difficulty' | 'topics';
  content: BSON.Document; // Using BSON.Document for flexible JSON content
  created_at: Date;
  updated_at: Date;
}
