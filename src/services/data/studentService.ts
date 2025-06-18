
import { apiClient, ApiError } from '@/lib/api/base';

export interface StudentData {
  id: string;
  name: string;
  email: string;
  grade: string;
  className: string;
  avatar?: string;
  averageScore: number;
}

export interface StudentProgress {
  date: string;
  score: number;
  testId: string;
  testName: string;
}

export const studentService = {
  async getAllStudents(): Promise<StudentData[]> {
    try {
      return await apiClient.get('students');
    } catch (error) {
      throw new ApiError('Failed to fetch students');
    }
  },

  async getStudentById(id: string): Promise<StudentData | null> {
    try {
      const students = await apiClient.get('students', { select: '*' });
      return students.find((s: StudentData) => s.id === id) || null;
    } catch (error) {
      throw new ApiError('Failed to fetch student');
    }
  },

  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    try {
      return await apiClient.get('student_progress', { 
        select: '*',
        filter: { student_id: studentId }
      });
    } catch (error) {
      throw new ApiError('Failed to fetch student progress');
    }
  }
};
