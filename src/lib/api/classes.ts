
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/supabase/client';

export const classApi = {
  // Get all classes
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('class')
        .select(`
          class_id,
          class_name,
          teacher_id,
          academic_year,
          teachers!class_teacher_id_fkey (
            TID,
            name,
            email
          )
        `);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get class by ID
  async getById(classId: number) {
    try {
      const { data, error } = await supabase
        .from('class')
        .select(`
          class_id,
          class_name,
          teacher_id,
          academic_year,
          teachers!class_teacher_id_fkey (
            TID,
            name,
            email
          )
        `)
        .eq('class_id', classId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get classes by teacher ID
  async getByTeacherId(teacherId: string) {
    try {
      const { data, error } = await supabase
        .from('class')
        .select(`
          class_id,
          class_name,
          teacher_id,
          academic_year
        `)
        .eq('teacher_id', teacherId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Get students in a class
  async getStudents(classId: number) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          SID,
          name,
          email,
          class_no,
          class_id
        `)
        .eq('class_id', classId)
        .order('class_no');

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Create new class
  async create(classData: {
    class_id: number;
    class_name: string;
    teacher_id: string;
    academic_year: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('class')
        .insert(classData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Update class
  async update(classId: number, updates: {
    class_name?: string;
    teacher_id?: string;
    academic_year?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('class')
        .update(updates)
        .eq('class_id', classId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  // Delete class
  async delete(classId: number) {
    try {
      const { error } = await supabase
        .from('class')
        .delete()
        .eq('class_id', classId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};
