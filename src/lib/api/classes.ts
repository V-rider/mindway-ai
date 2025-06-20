
import { dynamicSupabase } from '@/lib/supabase/dynamic-client';
import type { Database } from '@/types/database';

export const classApi = {
  // Get teacher's classes using their email to find classes assigned to them
  async getTeacherClasses(teacherEmail: string) {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    try {
      // 1. Get teacher info by email
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('TID, name')
        .eq('email', teacherEmail)
        .single();

      if (teacherError) throw teacherError;
      if (!teacherData) return { teacherName: null, classes: [] };

      // 2. Get classes for this teacher using TID
      const { data: classData, error: classError } = await supabase
        .from('class')
        .select('class_id, class_name, academic_year')
        .eq('teacher_id', teacherData.TID);

      if (classError) throw classError;

      // 3. Return formatted data
      return {
        teacherName: teacherData.name,
        classes: classData || []
      };
    } catch (error) {
      console.error('Error in getTeacherClasses:', error);
      throw error;
    }
  },

  // Get all students for a specific class (by class name)
  async getStudentsByClass(className: string) {
    const supabase = dynamicSupabase.getCurrentClient() as import('@supabase/supabase-js').SupabaseClient<Database>;
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      // First, get the class by name
      const { data: classData, error: classError } = await supabase
        .from('class')
        .select('class_id')
        .eq('class_name', className)
        .single();

      if (classError) {
        console.error('Error fetching class by name:', classError);
        throw classError;
      }
      if (!classData) {
        return [];
      }

      // Get students in this class
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('SID, name, email, class_id, class_no')
        .eq('class_id', classData.class_id);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      return students || [];
    } catch (error) {
      console.error('Error in getStudentsByClass:', error);
      throw error;
    }
  },

  // Get all classes from the class table
  async getAllClasses() {
    const supabase = dynamicSupabase.getCurrentClient() as import('@supabase/supabase-js').SupabaseClient<Database>;
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    const { data, error } = await supabase
      .from('class')
      .select('class_id, class_name, academic_year')
      .order('class_name');
      
    if (error) {
      console.error('Error fetching all classes:', error);
      throw error;
    }
    
    return data || [];
  }
};
