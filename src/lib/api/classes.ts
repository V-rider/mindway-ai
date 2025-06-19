
import { supabase } from '@/integrations/supabase/client';

export const classApi = {
  // Get teacher's classes using their email to find students assigned to them
  async getTeacherClasses(teacherEmail: string) {
    try {
      // First, get the teacher's information from the teachers table
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('name, email')
        .eq('email', teacherEmail)
        .single();

      if (teacherError) {
        console.error('Error fetching teacher data:', teacherError);
        throw teacherError;
      }

      if (!teacherData) {
        return {
          teacherName: null,
          classes: []
        };
      }

      // Get all students and find unique classes
      const { data: classData, error: classError } = await supabase
        .from('students')
        .select('class');

      if (classError) {
        console.error('Error fetching classes:', classError);
        throw classError;
      }

      // Get unique class names
      const uniqueClasses = Array.from(new Set(classData?.map(student => student.class) || []));
      
      return {
        teacherName: teacherData?.name,
        classes: uniqueClasses
      };
    } catch (error) {
      console.error('Error in getTeacherClasses:', error);
      throw error;
    }
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
