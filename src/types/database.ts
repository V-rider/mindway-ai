// This file defines the general shape of data as exposed by the API,
// potentially after transformation from MongoDB native types (e.g., ObjectId, Date).
// For direct MongoDB interaction, types from 'src/models/mongo/' should be used.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define a common structure for API responses that include MongoDB's _id
export interface BaseDocumentDTO {
  _id: string; // MongoDB ObjectId as string
}

export interface UserDTO extends BaseDocumentDTO {
  email: string;
  full_name: string;
  role: 'admin' | 'student' | 'teacher';
  avatar_url?: string | null;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  enrolled_class_ids?: string[]; // Array of Class _id strings
}

export interface ClassDTO extends BaseDocumentDTO {
  name: string;
  description?: string | null;
  teacher_id: string; // User _id string
  student_ids?: string[]; // Array of User _id strings
  created_at: string;
  updated_at: string;
  // If teacher details are embedded in API response:
  teacher?: Pick<UserDTO, '_id' | 'full_name' | 'email' | 'avatar_url'>;
}

export interface ClassEnrollmentDTO extends BaseDocumentDTO {
  class_id: string; // Class _id string
  student_id: string; // User _id string
  enrolled_at: string; // ISO Date string
}

export interface LearningMaterialDTO extends BaseDocumentDTO {
  title: string;
  description?: string | null;
  content?: string | null;
  type: 'lesson' | 'quiz' | 'assignment';
  class_id: string; // Class _id string
  created_by: string; // User _id string
  created_at: string;
  updated_at: string;
  // If creator/class details are embedded:
  class?: Pick<ClassDTO, '_id' | 'name'>;
  creator?: Pick<UserDTO, '_id' | 'full_name' | 'email' | 'avatar_url'>;
}

export interface StudentProgressDTO extends BaseDocumentDTO {
  student_id: string; // User _id string
  material_id: string; // LearningMaterial _id string
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number | null;
  completed_at?: string | null; // ISO Date string
  created_at: string;
  updated_at: string;
  material?: Pick<LearningMaterialDTO, '_id' | 'title' | 'type'>;
}

export interface AchievementDTO extends BaseDocumentDTO {
  title: string;
  description?: string | null;
  criteria?: string | null;
  badge_url?: string | null;
  created_at: string; // ISO Date string
}

export interface StudentAchievementDTO extends BaseDocumentDTO {
  student_id: string; // User _id string
  achievement_id: string; // Achievement _id string
  earned_at: string; // ISO Date string
  // If student/achievement details are embedded:
  student?: Pick<UserDTO, '_id' | 'full_name' | 'email' | 'avatar_url'>;
  achievement?: Pick<AchievementDTO, '_id' | 'title' | 'description' | 'badge_url'>;
}

export interface MathChallengeDTO extends BaseDocumentDTO {
  title: string;
  description?: string | null;
  difficulty_level: number;
  problem_text: string;
  solution: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeAttemptDTO extends BaseDocumentDTO {
  student_id: string; // User _id string
  challenge_id: string; // MathChallenge _id string
  attempt_text?: string | null;
  is_correct?: boolean | null;
  attempted_at: string; // ISO Date string
  challenge?: Pick<MathChallengeDTO, '_id' | 'title' | 'difficulty_level'>;
  student?: Pick<UserDTO, '_id' | 'full_name' | 'email'>;
}

export interface DocumentDTO extends BaseDocumentDTO {
  title: string;
  description?: string | null;
  status?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string; // User _id string
  class_id: string; // Class _id string
  created_at: string;
  updated_at: string;
  uploaded_by_user?: Pick<UserDTO, '_id' | 'full_name' | 'email' | 'avatar_url'>;
  class_info?: Pick<ClassDTO, '_id' | 'name'>;
}

export interface DocumentAnalysisDTO extends BaseDocumentDTO {
  document_id: string; // Document _id string
  analysis_type: 'summary' | 'key_points' | 'difficulty' | 'topics';
  content: Json; // Keep as Json, or define more specific types if structure is known
  created_at: string;
  updated_at: string;
}

export interface DocumentAnnotationDTO extends BaseDocumentDTO {
  document_id: string; // Document _id string
  user_id: string; // User _id string
  content: string;
  page_number?: number | null;
  position_x?: number | null;
  position_y?: number | null;
  created_at: string;
  updated_at: string;
  user?: Pick<UserDTO, '_id' | 'full_name' | 'email' | 'avatar_url'>;
}

export interface DocumentHighlightDTO extends BaseDocumentDTO {
  document_id: string; // Document _id string
  user_id: string; // User _id string
  content: string; // The highlighted text
  page_number?: number | null;
  start_position?: number | null;
  end_position?: number | null;
  created_at: string; // ISO Date string
  user?: Pick<UserDTO, '_id' | 'full_name' | 'email' | 'avatar_url'>;
}

// The main Database interface, adapted for DTOs.
// The 'Tables' metaphor from Supabase can be kept for familiarity or changed to 'Collections'.
export interface Database {
  public: {
    Tables: {
      users: { Row: UserDTO, Insert: Omit<UserDTO, '_id' | 'created_at' | 'updated_at' | 'enrolled_class_ids'>, Update: Partial<Omit<UserDTO, '_id' | 'created_at' | 'updated_at'>> },
      classes: { Row: ClassDTO, Insert: Omit<ClassDTO, '_id' | 'created_at' | 'updated_at' | 'student_ids' | 'teacher'> & {teacher_id: string}, Update: Partial<Omit<ClassDTO, '_id' | 'created_at' | 'updated_at' | 'teacher'>> },
      class_enrollments: { Row: ClassEnrollmentDTO, Insert: Omit<ClassEnrollmentDTO, '_id' | 'enrolled_at'>, Update: Partial<Omit<ClassEnrollmentDTO, '_id'>> },
      learning_materials: { Row: LearningMaterialDTO, Insert: Omit<LearningMaterialDTO, '_id' | 'created_at' | 'updated_at' | 'class' | 'creator'> & {class_id: string, created_by: string}, Update: Partial<Omit<LearningMaterialDTO, '_id' | 'created_at' | 'updated_at' | 'class' | 'creator'>> },
      student_progress: { Row: StudentProgressDTO, Insert: Omit<StudentProgressDTO, '_id' | 'created_at' | 'updated_at' | 'material'>, Update: Partial<Omit<StudentProgressDTO, '_id' | 'created_at' | 'updated_at' | 'material'>> },
      achievements: { Row: AchievementDTO, Insert: Omit<AchievementDTO, '_id' | 'created_at'>, Update: Partial<Omit<AchievementDTO, '_id' | 'created_at'>> },
      student_achievements: { Row: StudentAchievementDTO, Insert: Omit<StudentAchievementDTO, '_id' | 'earned_at' | 'student' | 'achievement'>, Update: Partial<Omit<StudentAchievementDTO, '_id' | 'student' | 'achievement'>> },
      math_challenges: { Row: MathChallengeDTO, Insert: Omit<MathChallengeDTO, '_id' | 'created_at' | 'updated_at'>, Update: Partial<Omit<MathChallengeDTO, '_id' | 'created_at' | 'updated_at'>> },
      challenge_attempts: { Row: ChallengeAttemptDTO, Insert: Omit<ChallengeAttemptDTO, '_id' | 'attempted_at' | 'challenge' | 'student'>, Update: Partial<Omit<ChallengeAttemptDTO, '_id' | 'attempted_at' | 'challenge' | 'student'>> },
      documents: { Row: DocumentDTO, Insert: Omit<DocumentDTO, '_id' | 'created_at' | 'updated_at' | 'uploaded_by_user' | 'class_info' | 'status'> & {uploaded_by: string, class_id: string, status?: string}, Update: Partial<Omit<DocumentDTO, '_id' | 'created_at' | 'updated_at' | 'uploaded_by_user' | 'class_info'>> },
      document_analysis: { Row: DocumentAnalysisDTO, Insert: Omit<DocumentAnalysisDTO, '_id' | 'created_at' | 'updated_at'> & {document_id: string}, Update: Partial<Omit<DocumentAnalysisDTO, '_id' | 'created_at' | 'updated_at'>> },
      document_annotations: { Row: DocumentAnnotationDTO, Insert: Omit<DocumentAnnotationDTO, '_id' | 'created_at' | 'updated_at' | 'user'> & {document_id: string, user_id: string}, Update: Partial<Omit<DocumentAnnotationDTO, '_id' | 'created_at' | 'updated_at' | 'user'>> },
      document_highlights: { Row: DocumentHighlightDTO, Insert: Omit<DocumentHighlightDTO, '_id' | 'created_at' | 'user'> & {document_id: string, user_id: string}, Update: Partial<Omit<DocumentHighlightDTO, '_id' | 'created_at' | 'user'>> },
    };
    Views: {
      [_ in never]: never; // Views might not directly translate or might be handled by specific API endpoints/aggregations
    };
    Functions: {
      [_ in never]: never; // Database functions need to be reimplemented in application logic or as MongoDB aggregations/scripts
    };
    Enums: {
      [_ in never]: never; // Enums are typically handled by string literal types in TypeScript
    };
  };
}