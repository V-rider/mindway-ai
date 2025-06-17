import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Material = Database['public']['Tables']['learning_materials']['Row'];
type MaterialInsert = Database['public']['Tables']['learning_materials']['Insert'];
type MaterialUpdate = Database['public']['Tables']['learning_materials']['Update'];
type StudentProgress = Database['public']['Tables']['student_progress']['Row'];

export const materialApi = {
  // Get all materials
  async getMaterials() {
    const { data, error } = await supabase
      .from('learning_materials')
      .select(`
        *,
        class:classes (
          id,
          name
        ),
        creator:users!created_by (
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

  // Get material by ID
  async getMaterialById(id: string) {
    const { data, error } = await supabase
      .from('learning_materials')
      .select(`
        *,
        class:classes (
          id,
          name
        ),
        creator:users!created_by (
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

  // Create new material
  async createMaterial(materialData: MaterialInsert) {
    const { data, error } = await supabase
      .from('learning_materials')
      .insert(materialData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update material
  async updateMaterial(id: string, materialData: MaterialUpdate) {
    const { data, error } = await supabase
      .from('learning_materials')
      .update(materialData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete material
  async deleteMaterial(id: string) {
    const { error } = await supabase
      .from('learning_materials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get materials by class
  async getMaterialsByClass(classId: string) {
    const { data, error } = await supabase
      .from('learning_materials')
      .select(`
        *,
        creator:users!created_by (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get materials by type
  async getMaterialsByType(type: Material['type']) {
    const { data, error } = await supabase
      .from('learning_materials')
      .select(`
        *,
        class:classes (
          id,
          name
        ),
        creator:users!created_by (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update student progress
  async updateStudentProgress(
    studentId: string,
    materialId: string,
    progress: Partial<StudentProgress>
  ) {
    const { data, error } = await supabase
      .from('student_progress')
      .upsert({
        student_id: studentId,
        material_id: materialId,
        ...progress
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get student progress
  async getStudentProgress(studentId: string, materialId: string) {
    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return data;
  },

  // Get all progress for a student
  async getAllStudentProgress(studentId: string) {
    const { data, error } = await supabase
      .from('student_progress')
      .select(`
        *,
        material:learning_materials (
          id,
          title,
          type
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get all progress for a material
  async getMaterialProgress(materialId: string) {
    const { data, error } = await supabase
      .from('student_progress')
      .select(`
        *,
        student:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('material_id', materialId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 