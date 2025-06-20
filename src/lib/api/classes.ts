
import { dynamicSupabase } from '@/lib/supabase/dynamic-client';
import type { Database } from '@/types/database';

export const classApi = {
  // Get teacher's classes using their TID to find classes assigned to them
  async getTeacherClasses(teacherEmail: string) {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching teacher classes for:', teacherEmail);
      
      // 1. Get teacher info by email to get their TID
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('TID, name')
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

      // 2. Get classes assigned to this teacher using their TID
      const { data: classesData, error: classesError } = await supabase
        .from('class')
        .select('class_id, class_name, academic_year')
        .eq('teacher_id', teacherData.TID);

      if (classesError) {
        console.error('Classes error:', classesError);
        throw classesError;
      }

      console.log('Classes data:', classesData);
      
      // 3. Return formatted data
      return {
        teacherName: teacherData.name,
        classes: (classesData || []).map(classItem => ({
          class_name: classItem.class_name,
          class_id: classItem.class_id.toString(),
          academic_year: classItem.academic_year
        }))
      };
    } catch (error) {
      console.error('Error in getTeacherClasses:', error);
      throw error;
    }
  },

  // Get all students for a specific class (by class_id)
  async getStudentsByClass(classId: string) {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching students for class ID:', classId);
      
      // Get students in this class using class_id
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('SID, name, email, class_id, class_no')
        .eq('class_id', parseInt(classId));

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      console.log('Students found:', students);

      return (students || []).map(student => ({
        SID: student.SID,
        name: student.name,
        email: student.email,
        class_id: student.class_id
      }));
    } catch (error) {
      console.error('Error in getStudentsByClass:', error);
      throw error;
    }
  },

  // Get all classes from the class table
  async getAllClasses() {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching all classes');
      
      const { data: classes, error } = await supabase
        .from('class')
        .select('class_id, class_name, academic_year, teacher_id');
        
      if (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }
      
      console.log('Classes data:', classes);
      
      return (classes || []).map(classItem => ({
        class_id: classItem.class_id.toString(),
        class_name: classItem.class_name,
        academic_year: classItem.academic_year,
        teacher_id: classItem.teacher_id
      }));
    } catch (error) {
      console.error('Error in getAllClasses:', error);
      throw error;
    }
  }
};
