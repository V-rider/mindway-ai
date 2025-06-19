
import { supabase } from '@/integrations/supabase/client';

export const classApi = {
  // Get teacher's classes using their TID from the students table
  async getTeacherClasses(teacherEmail: string) {
    try {
      // First, get the teacher's TID from the teachers table
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('tid, name')
        .eq('email', teacherEmail)
        .single();

      if (teacherError) {
        console.error('Error fetching teacher TID:', teacherError);
        throw teacherError;
      }

      if (!teacherData?.tid) {
        return {
          teacherName: teacherData?.name,
          classes: []
        };
      }

      // Get all classes where this teacher's TID is assigned
      const { data: classData, error: classError } = await supabase
        .from('students')
        .select('class')
        .eq('tid', teacherData.tid);

      if (classError) {
        console.error('Error fetching teacher classes:', classError);
        throw classError;
      }

      // Get unique class names for this teacher
      const uniqueClasses = Array.from(new Set(classData?.map(student => student.class) || []));
      
      return {
        teacherName: teacherData?.name,
        classes: uniqueClasses,
        tid: teacherData.tid
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
  },

  // Get students by teacher TID
  async getStudentsByTeacherTID(tid: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('tid', tid)
      .order('name');

    if (error) {
      console.error('Error fetching students by teacher TID:', error);
      throw error;
    }

    return data;
  }
};
