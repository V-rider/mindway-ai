export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'student' | 'teacher'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role: 'admin' | 'student' | 'teacher'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'student' | 'teacher'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          description: string | null
          teacher_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          teacher_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          teacher_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      class_enrollments: {
        Row: {
          id: string
          class_id: string
          student_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          enrolled_at?: string
        }
      }
      learning_materials: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          type: 'lesson' | 'quiz' | 'assignment'
          class_id: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content?: string | null
          type: 'lesson' | 'quiz' | 'assignment'
          class_id: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string | null
          type?: 'lesson' | 'quiz' | 'assignment'
          class_id?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          material_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          score: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          material_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          material_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string | null
          criteria: string | null
          badge_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          criteria?: string | null
          badge_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          criteria?: string | null
          badge_url?: string | null
          created_at?: string
        }
      }
      student_achievements: {
        Row: {
          id: string
          student_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          student_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      math_challenges: {
        Row: {
          id: string
          title: string
          description: string | null
          difficulty_level: number
          problem_text: string
          solution: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          difficulty_level: number
          problem_text: string
          solution: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          difficulty_level?: number
          problem_text?: string
          solution?: string
          created_at?: string
          updated_at?: string
        }
      }
      challenge_attempts: {
        Row: {
          id: string
          student_id: string
          challenge_id: string
          attempt_text: string | null
          is_correct: boolean | null
          attempted_at: string
        }
        Insert: {
          id?: string
          student_id: string
          challenge_id: string
          attempt_text?: string | null
          is_correct?: boolean | null
          attempted_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          challenge_id?: string
          attempt_text?: string | null
          is_correct?: boolean | null
          attempted_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          description: string | null
          file_url: string
          file_type: string
          file_size: number
          uploaded_by: string
          class_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          file_url: string
          file_type: string
          file_size: number
          uploaded_by: string
          class_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          file_url?: string
          file_type?: string
          file_size?: number
          uploaded_by?: string
          class_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      document_analysis: {
        Row: {
          id: string
          document_id: string
          analysis_type: 'summary' | 'key_points' | 'difficulty' | 'topics'
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          analysis_type: 'summary' | 'key_points' | 'difficulty' | 'topics'
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          analysis_type?: 'summary' | 'key_points' | 'difficulty' | 'topics'
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      document_annotations: {
        Row: {
          id: string
          document_id: string
          user_id: string
          content: string
          page_number: number | null
          position_x: number | null
          position_y: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          content: string
          page_number?: number | null
          position_x?: number | null
          position_y?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          content?: string
          page_number?: number | null
          position_x?: number | null
          position_y?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      document_highlights: {
        Row: {
          id: string
          document_id: string
          user_id: string
          content: string
          page_number: number | null
          start_position: number | null
          end_position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          content: string
          page_number?: number | null
          start_position?: number | null
          end_position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          content?: string
          page_number?: number | null
          start_position?: number | null
          end_position?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 