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
      
      // Convert mock class ID format to actual database class_id
      let actualClassId: number;
      
      // Check if classId is in mock format like "class-1-1" or "math-7a"
      if (classId.includes('-') || isNaN(Number(classId))) {
        // For mock data, we'll try to extract a number or map to a default
        const match = classId.match(/\d+/);
        actualClassId = match ? parseInt(match[0]) : 1; // Default to 1 if no number found
        console.log('Converted mock class ID', classId, 'to actual class ID:', actualClassId);
      } else {
        actualClassId = parseInt(classId);
      }
      
      if (isNaN(actualClassId)) {
        console.error('Invalid class ID:', classId);
        return [];
      }
      
      // Get students in this class using class_id
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('SID, name, email, class_id, class_no')
        .eq('class_id', actualClassId);

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
  },

  // Get classes grouped by grade level
  async getClassesByGrade() {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching classes grouped by grade');
      
      const { data: classes, error } = await supabase
        .from('class')
        .select('class_id, class_name, academic_year, teacher_id');
        
      if (error) {
        console.error('Error fetching classes by grade:', error);
        throw error;
      }
      
      console.log('Classes by grade data:', classes);
      
      // Group classes by grade level (extract grade from class_name)
      const classesByGrade: Record<string, any[]> = {};
      
      (classes || []).forEach(classItem => {
        // Extract grade number from class_name (e.g., "Math 7A" -> "7", "Science 8B" -> "8", "1A" -> "1")
        const gradeMatch = classItem.class_name.match(/(\d+)/);
        const grade = gradeMatch ? gradeMatch[1] : 'Unknown';
        
        if (!classesByGrade[grade]) {
          classesByGrade[grade] = [];
        }
        
        classesByGrade[grade].push({
          class_id: classItem.class_id.toString(),
          class_name: classItem.class_name,
          academic_year: classItem.academic_year,
          teacher_id: classItem.teacher_id,
          section: this.extractSection(classItem.class_name)
        });
      });
      
      return classesByGrade;
    } catch (error) {
      console.error('Error in getClassesByGrade:', error);
      throw error;
    }
  },

  // Get the maximum number of sections across all grades
  async getMaxSectionsAcrossGrades() {
    const supabase = dynamicSupabase.getCurrentClient();
    if (!supabase) {
      throw new Error('No Supabase client for current project');
    }
    
    try {
      console.log('Fetching max sections across all grades');
      
      const { data: classes, error } = await supabase
        .from('class')
        .select('class_name');
        
      if (error) {
        console.error('Error fetching classes for max sections:', error);
        throw error;
      }
      
      console.log('All classes data for max sections:', classes);
      
      // Extract all sections and find the maximum
      let maxSectionCount = 1;
      const allSections = new Set<string>();
      
      (classes || []).forEach(classItem => {
        const section = this.extractSection(classItem.class_name);
        allSections.add(section);
      });
      
      // Convert sections to numbers and find max (A=1, B=2, C=3, D=4, E=5, etc.)
      allSections.forEach(section => {
        const sectionNumber = section.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        maxSectionCount = Math.max(maxSectionCount, sectionNumber);
      });
      
      console.log('Max sections found across all grades:', maxSectionCount, 'All sections:', Array.from(allSections));
      
      return maxSectionCount;
    } catch (error) {
      console.error('Error in getMaxSectionsAcrossGrades:', error);
      // Return default of 4 sections if error occurs
      return 4;
    }
  },

  // Helper function to extract section (A, B, C, etc.) from class name
  extractSection(className: string): string {
    const sectionMatch = className.match(/([A-Z])(?:\s|$)/);
    return sectionMatch ? sectionMatch[1] : 'A';
  },

  // Get dynamic topic mastery based on grade level and max sections
  getDynamicTopicMastery(grade: string, maxSections: number) {
    const gradeNum = parseInt(grade);
    let topics: Array<{topic: string, mastery: number}> = [];
    
    if (gradeNum <= 6) {
      // Elementary topics
      topics = [
        { topic: "Basic Addition", mastery: 85 + Math.random() * 10 },
        { topic: "Basic Subtraction", mastery: 82 + Math.random() * 10 },
        { topic: "Multiplication Tables", mastery: 78 + Math.random() * 15 },
        { topic: "Division Basics", mastery: 75 + Math.random() * 15 },
        { topic: "Fractions Intro", mastery: 70 + Math.random() * 20 },
        { topic: "Word Problems", mastery: 68 + Math.random() * 20 },
        { topic: "Number Patterns", mastery: 73 + Math.random() * 15 }
      ];
    } else if (gradeNum <= 8) {
      // Middle school topics
      topics = [
        { topic: "Algebra Basics", mastery: 72 + Math.random() * 15 },
        { topic: "Ratios & Proportions", mastery: 76 + Math.random() * 12 },
        { topic: "Geometry Fundamentals", mastery: 74 + Math.random() * 14 },
        { topic: "Statistics & Data", mastery: 78 + Math.random() * 12 },
        { topic: "Pre-Calculus Concepts", mastery: 68 + Math.random() * 18 },
        { topic: "Equations & Inequalities", mastery: 70 + Math.random() * 16 },
        { topic: "Functions & Graphs", mastery: 69 + Math.random() * 17 }
      ];
    } else {
      // High school topics
      topics = [
        { topic: "Advanced Algebra", mastery: 70 + Math.random() * 20 },
        { topic: "Trigonometry", mastery: 68 + Math.random() * 22 },
        { topic: "Calculus Basics", mastery: 65 + Math.random() * 25 },
        { topic: "Statistics Analysis", mastery: 72 + Math.random() * 18 },
        { topic: "Mathematical Proofs", mastery: 60 + Math.random() * 25 },
        { topic: "Complex Numbers", mastery: 63 + Math.random() * 22 },
        { topic: "Linear Algebra", mastery: 66 + Math.random() * 20 }
      ];
    }
    
    // Adjust number of topics based on max sections across all grades
    const topicCount = Math.min(maxSections + 2, topics.length);
    return topics.slice(0, topicCount).map(topic => ({
      ...topic,
      mastery: Math.round(topic.mastery)
    }));
  },

  // Get dynamic error patterns based on grade level and max sections
  getDynamicErrorPatterns(grade: string, maxSections: number) {
    const gradeNum = parseInt(grade);
    let patterns: Array<{pattern: string, percentage: number}> = [];
    
    if (gradeNum <= 6) {
      patterns = [
        { pattern: "Calculation Errors", percentage: 35 },
        { pattern: "Number Recognition", percentage: 25 },
        { pattern: "Basic Operations", percentage: 40 },
        { pattern: "Reading Comprehension", percentage: 30 },
        { pattern: "Place Value Confusion", percentage: 20 }
      ];
    } else if (gradeNum <= 8) {
      patterns = [
        { pattern: "Algebraic Mistakes", percentage: 30 },
        { pattern: "Formula Application", percentage: 35 },
        { pattern: "Problem Interpretation", percentage: 35 },
        { pattern: "Sign Errors", percentage: 25 },
        { pattern: "Order of Operations", percentage: 20 }
      ];
    } else {
      patterns = [
        { pattern: "Complex Problem Solving", percentage: 40 },
        { pattern: "Advanced Concepts", percentage: 35 },
        { pattern: "Mathematical Reasoning", percentage: 25 },
        { pattern: "Graphical Interpretation", percentage: 30 },
        { pattern: "Abstract Thinking", percentage: 22 }
      ];
    }
    
    // Adjust based on max sections - more sections might indicate more diverse error patterns
    const patternCount = Math.min(maxSections, patterns.length);
    return patterns.slice(0, patternCount);
  }
};
