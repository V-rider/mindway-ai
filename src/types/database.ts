
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
      class: {
        Row: {
          class_id: number
          class_name: string
          teacher_id: string
          academic_year: string
        }
        Insert: {
          class_id: number
          class_name: string
          teacher_id: string
          academic_year: string
        }
        Update: {
          class_id?: number
          class_name?: string
          teacher_id?: string
          academic_year?: string
        }
      }
      error_type: {
        Row: {
          error_id: number
          error_description: string
        }
        Insert: {
          error_description: string
        }
        Update: {
          error_id?: number
          error_description?: string
        }
      }
      paper: {
        Row: {
          paper_id: number
          paper_name: string
          paper_date: string
          total_score: number
          class_id: number
        }
        Insert: {
          paper_name: string
          paper_date: string
          total_score: number
          class_id: number
        }
        Update: {
          paper_id?: number
          paper_name?: string
          paper_date?: string
          total_score?: number
          class_id?: number
        }
      }
      question: {
        Row: {
          question_id: number
          paper_id: number
          question_no: number
          question_max_score: number
          question_type_id: number
          category_id: number
        }
        Insert: {
          paper_id: number
          question_no: number
          question_max_score: number
          question_type_id: number
          category_id: number
        }
        Update: {
          question_id?: number
          paper_id?: number
          question_no?: number
          question_max_score?: number
          question_type_id?: number
          category_id?: number
        }
      }
      question_categories: {
        Row: {
          question_category_id: number
          question_category_description: string
          question_orientation_id: number
        }
        Insert: {
          question_category_id: number
          question_category_description: string
          question_orientation_id: number
        }
        Update: {
          question_category_id?: number
          question_category_description?: string
          question_orientation_id?: number
        }
      }
      question_orientation: {
        Row: {
          question_orientation_id: number
          question_orientation_description: string
        }
        Insert: {
          question_orientation_description: string
        }
        Update: {
          question_orientation_id?: number
          question_orientation_description?: string
        }
      }
      question_type: {
        Row: {
          type_id: number
          type_description: string
        }
        Insert: {
          type_description: string
        }
        Update: {
          type_id?: number
          type_description?: string
        }
      }
      score: {
        Row: {
          score_id: number
          student_id: number
          question_id: number
          question_score: number
        }
        Insert: {
          student_id: number
          question_id: number
          question_score: number
        }
        Update: {
          score_id?: number
          student_id?: number
          question_id?: number
          question_score?: number
        }
      }
      score_error: {
        Row: {
          score_id: number
          error_id: number
        }
        Insert: {
          score_id: number
          error_id: number
        }
        Update: {
          score_id?: number
          error_id?: number
        }
      }
      students: {
        Row: {
          class_id: number
          class_no: number
          SID: number
          name: string
          email: string
          password: string
          hashed_password: string
        }
        Insert: {
          class_id: number
          class_no: number
          SID: number
          name: string
          email: string
          password: string
          hashed_password: string
        }
        Update: {
          class_id?: number
          class_no?: number
          SID?: number
          name?: string
          email?: string
          password?: string
          hashed_password?: string
        }
      }
      teachers: {
        Row: {
          TID: string
          name: string
          email: string
          password: string
          hashed_password: string
        }
        Insert: {
          TID: string
          name: string
          email: string
          password: string
          hashed_password: string
        }
        Update: {
          TID?: string
          name?: string
          email?: string
          password?: string
          hashed_password?: string
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
