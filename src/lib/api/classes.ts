import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Class = Database['public']['Tables']['classes']['Row'];
type ClassInsert = Database['public']['Tables']['classes']['Insert'];
type ClassUpdate = Database['public']['Tables']['classes']['Update'];
type ClassEnrollment = Database['public']['Tables']['class_enrollments']['Row'];

export const classApi = {
  // Get all classes
  async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teacher:users!teacher_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get class by ID
  async getClassById(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teacher:users!teacher_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new class
  async createClass(classData: ClassInsert) {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update class
  async updateClass(id: string, classData: ClassUpdate) {
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete class
  async deleteClass(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get classes by teacher
  async getClassesByTeacher(teacherId: string) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teacher:users!teacher_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get classes for student
  async getStudentClasses(studentId: string) {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select(`
        class:classes (
          *,
          teacher:users!teacher_id (
            id,
            full_name,
            email,
            avatar_url
          )
        )
      `)
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;
    return data.map(item => item.class);
  },

  // Enroll student in class
  async enrollStudent(classId: string, studentId: string) {
    const { data, error } = await supabase
      .from('class_enrollments')
      .insert({
        class_id: classId,
        student_id: studentId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove student from class
  async removeStudent(classId: string, studentId: string) {
    const { error } = await supabase
      .from('class_enrollments')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId);

    if (error) throw error;
  },

  // Get class students
  async getClassStudents(classId: string) {
    const { data, error } = await supabase
      .from('class_enrollments')
      .select(`
        student:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('class_id', classId);

    if (error) throw error;
    return data.map(item => item.student);
  },

  // Get class materials
  async getClassMaterials(classId: string) {
    const { data, error } = await supabase
      .from('learning_materials')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
