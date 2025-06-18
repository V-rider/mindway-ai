
import { getCurrentSupabaseClient } from '../supabase/dynamic-client';

export const userApi = {
  // Get current user from localStorage
  async getCurrentUser() {
    const storedUser = localStorage.getItem("pathwayUser");
    return storedUser ? JSON.parse(storedUser) : null;
  },

  // Get user by ID - search in both students and teachers tables
  async getUserById(id: string) {
    const supabase = getCurrentSupabaseClient();
    
    // First try students table
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('sid', id)
      .single();

    if (!studentError && studentData) {
      return {
        id: studentData.sid,
        name: studentData.name,
        email: studentData.email,
        role: "student",
        classId: studentData.class
      };
    }

    // Then try teachers table
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', id) // Using email as ID for teachers
      .single();

    if (!teacherError && teacherData) {
      return {
        id: teacherData.email,
        name: teacherData.name,
        email: teacherData.email,
        role: "admin",
        classId: teacherData.classes
      };
    }

    throw new Error("User not found");
  },

  // Get all students
  async getAllStudents() {
    const supabase = getCurrentSupabaseClient();
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data.map(student => ({
      id: student.sid,
      name: student.name,
      email: student.email,
      role: "student" as const,
      classId: student.class
    }));
  },

  // Get all teachers
  async getAllTeachers() {
    const supabase = getCurrentSupabaseClient();
    
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data.map(teacher => ({
      id: teacher.email,
      name: teacher.name,
      email: teacher.email,
      role: "admin" as const,
      classId: teacher.classes
    }));
  },

  // Get students by class
  async getStudentsByClass(className: string) {
    const supabase = getCurrentSupabaseClient();
    
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class', className)
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data.map(student => ({
      id: student.sid,
      name: student.name,
      email: student.email,
      role: "student" as const,
      classId: student.class
    }));
  }
};
