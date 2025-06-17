import { ObjectId } from 'mongodb';

export interface ClassEnrollmentDocument {
  _id?: ObjectId;
  class_id: ObjectId; // Reference to Class's _id
  student_id: ObjectId; // Reference to User's _id
  enrolled_at: Date;
}
