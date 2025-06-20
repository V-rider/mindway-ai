
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
      console.log('Fetching teacher classes for:', teacherEmail);
      
      // 1. Get teacher info by email
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('name, classes')
        .eq('email', teacherEmail)
        .single();

      if (teacherError) {
        console.error('Teacher error:', teacherError);
        throw teacherError;
      }
      
      if (!teacherData) {
        console.log('No teacher found for email:', teacherEmail);
        return { teacherName: null, classes: [] };
      }

      console.log('Teacher data:', teacherData);

      // 2. Parse classes string (assuming it's comma-separated)
      const classNames = teacherData.classes.split(',').map(c => c.trim());
      
      // 3. Return formatted data
      return {
        teacherName: teacherData.name,
        classes: classNames.map(className => ({
          class_name: className,
          class_id: className, // Using class name as ID for now
          academic_year: new Date().getFullYear().toString()
        }))
      };
    } catch (error) {
      console.error('Error in getTeacherClasses:', error);
      throw error;
    }
  },

  // Get all students for a specific class (by class name)
  async getStudentsByClass(className: string) {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching students for class:', className);
      
      // Get students in this class
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('sid, name, email, class')
        .eq('class', className);

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      console.log('Students found:', students);

      return (students || []).map(student => ({
        SID: student.sid,
        name: student.name,
        email: student.email,
        class: student.class
      }));
    } catch (error) {
      console.error('Error in getStudentsByClass:', error);
      throw error;
    }
  },

  // Get all classes from the teachers table (since there's no separate class table)
  async getAllClasses() {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching all classes');
      
      const { data: teachers, error } = await supabase
        .from('teachers')
        .select('classes, name');
        
      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }
      
      console.log('Teachers data:', teachers);
      
      // Extract unique classes from all teachers
      const allClasses = new Set();
      teachers?.forEach(teacher => {
        const classNames = teacher.classes.split(',').map(c => c.trim());
        classNames.forEach(className => allClasses.add(className));
      });
      
      return Array.from(allClasses).map(className => ({
        class_id: className,
        class_name: className,
        academic_year: new Date().getFullYear().toString()
      }));
    } catch (error) {
      console.error('Error in getAllClasses:', error);
      throw error;
    }
  }
};
