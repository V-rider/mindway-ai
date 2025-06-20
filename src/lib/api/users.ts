
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/supabase/client';

export const userApi = {
  // Get all students
  async getAllStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          SID,
          name,
          email,
          class_no,
          class_id,
          class!students_Class_ID_fkey (
            class_id,
            class_name,
            academic_year
          )
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get student by ID
  async getStudentById(studentId: number) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          SID,
          name,
          email,
          class_no,
          class_id,
          class!students_Class_ID_fkey (
            class_id,
            class_name,
            academic_year,
            teachers!class_teacher_id_fkey (
              TID,
              name,
              email
            )
          )
        `)
        .eq('SID', studentId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get all teachers
  async getAllTeachers() {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          TID,
          name,
          email
        `)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get teacher by ID
  async getTeacherById(teacherId: string) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          TID,
          name,
          email
        `)
        .eq('TID', teacherId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Create new student
  async createStudent(studentData: {
    SID: number;
    name: string;
    email: string;
    password: string;
    hashed_password: string;
    class_id: number;
    class_no: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Create new teacher
  async createTeacher(teacherData: {
    TID: string;
    name: string;
    email: string;
    password: string;
    hashed_password: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert(teacherData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Update student
  async updateStudent(studentId: number, updates: {
    name?: string;
    email?: string;
    class_id?: number;
    class_no?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('SID', studentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Update teacher
  async updateTeacher(teacherId: string, updates: {
    name?: string;
    email?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .update(updates)
        .eq('TID', teacherId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Delete student
  async deleteStudent(studentId: number) {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('SID', studentId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Delete teacher
  async deleteTeacher(teacherId: string) {
    try {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('TID', teacherId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};
