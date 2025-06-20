
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
    
    // First try students table using SID
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('SID, name, email, class_id')
      .eq('SID', id)
      .single();

    if (!studentError && studentData) {
      return {
        id: studentData.SID.toString(),
        name: studentData.name,
        email: studentData.email,
        role: "student",
        classId: studentData.class_id.toString()
      };
    }

    // Then try teachers table using email as ID
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('TID, name, email')
      .eq('email', id)
      .single();

    if (!teacherError && teacherData) {
      return {
        id: teacherData.email,
        name: teacherData.name,
        email: teacherData.email,
        role: "admin",
        classId: teacherData.TID
      };
    }

    throw new Error("User not found");
  },

  // Get all students
  async getAllStudents() {
    const supabase = getCurrentSupabaseClient();
    
    const { data, error } = await supabase
      .from('students')
      .select('SID, name, email, class_id')
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data.map(student => ({
      id: student.SID.toString(),
      name: student.name,
      email: student.email,
      role: "student" as const,
      classId: student.class_id.toString()
    }));
  },

  // Get all teachers
  async getAllTeachers() {
    const supabase = getCurrentSupabaseClient();
    
    const { data, error } = await supabase
      .from('teachers')
      .select('TID, name, email')
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data.map(teacher => ({
      id: teacher.email,
      name: teacher.name,
      email: teacher.email,
      role: "admin" as const,
      classId: teacher.TID
    }));
  },

  // Get students by class ID
  async getStudentsByClass(classId: string) {
    const supabase = getCurrentSupabaseClient();
    
    const { data, error } = await supabase
      .from('students')
      .select('SID, name, email, class_id, class_no')
      .eq('class_id', parseInt(classId))
      .order('name', { ascending: true });

    if (error) throw error;
    
    return data.map(student => ({
      id: student.SID.toString(),
      name: student.name,
      email: student.email,
      role: "student" as const,
      classId: student.class_id.toString()
    }));
  }
};
