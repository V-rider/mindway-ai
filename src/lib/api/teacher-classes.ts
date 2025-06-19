
import { getCurrentSupabaseClient } from '../supabase/dynamic-client';

export const teacherClassesApi = {
  // Get classes taught by a specific teacher
  async getTeacherClasses(teacherEmail: string) {
    const supabase = getCurrentSupabaseClient();
    
    // First get the teacher's classes from the teachers table
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('classes')
      .eq('email', teacherEmail)
      .single();

    if (teacherError) {
      console.error('Error fetching teacher data:', teacherError);
      throw teacherError;
    }

    if (!teacherData || !teacherData.classes) {
      return [];
    }

    // Parse the classes string (assuming it's comma-separated)
    const classNames = teacherData.classes.split(',').map(name => name.trim());
    
    return classNames;
  }
};
