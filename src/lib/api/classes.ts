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
      // 1. Get teacher info
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('TID, name')
        .eq('email', teacherEmail)
        .single();

      if (teacherError) throw teacherError;
      if (!teacherData) return { teacherName: null, classes: [] };

      // 2. Get classes for this teacher
      const { data: classData, error: classError } = await supabase
        .from('class')
        .select('class_id, class_name, academic_year')
        .eq('teacher_id', teacherData.TID);

      if (classError) throw classError;

      // 3. Return
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
    // First, get the class id by name
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id')
      .eq('name', className)
      .single();
    if (classError) {
      console.error('Error fetching class by name:', classError);
      throw classError;
    }
    if (!classData) {
      return [];
    }
    // Get students enrolled in this class
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', classData.id);
    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      throw enrollmentsError;
    }
    if (!enrollments || enrollments.length === 0) {
      return [];
    }
    // Get student details from users table
    const studentIds = enrollments.map(e => e.student_id);
    const { data: students, error: studentsError } = await supabase
      .from('users')
      .select('*')
      .in('id', studentIds);
    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      throw studentsError;
    }
    return students;
  },

  // Get all classes from the classes table
  async getAllClasses() {
    const supabase = dynamicSupabase.getCurrentClient() as import('@supabase/supabase-js').SupabaseClient<Database>;
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    const { data, error } = await supabase
      .from('classes')
      .select('id, name')
      .order('name');
    if (error) {
      console.error('Error fetching all classes:', error);
      throw error;
    }
    return data || [];
  }
};
