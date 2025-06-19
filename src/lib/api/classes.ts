
import { supabase } from '@/integrations/supabase/client';

export const classApi = {
  // Get teacher's classes from the teachers table
  async getTeacherClasses(teacherEmail: string) {
    const { data, error } = await supabase
      .from('teachers')
      .select('classes, name')
      .eq('email', teacherEmail)
      .single();

    if (error) {
      console.error('Error fetching teacher classes:', error);
      throw error;
    }

    // Parse the classes string (assuming comma-separated)
    const classList = data?.classes ? data.classes.split(',').map(cls => cls.trim()) : [];
    
    return {
      teacherName: data?.name,
      classes: classList
    };
  },

  // Get all students for a specific class
  async getStudentsByClass(className: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class', className);

    if (error) {
      console.error('Error fetching students by class:', error);
      throw error;
    }

    return data;
  },

  // Get all classes from students table (to get unique class names)
  async getAllClasses() {
    const { data, error } = await supabase
      .from('students')
      .select('class')
      .order('class');

    if (error) {
      console.error('Error fetching all classes:', error);
      throw error;
    }

    // Get unique class names
    const uniqueClasses = Array.from(new Set(data?.map(student => student.class) || []));
    
    return uniqueClasses;
  }
};
