
import { supabase } from '@/integrations/supabase/client';
import { verifyPassword } from './password-utils';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export const auth = {
  // Sign in with email and password using existing database structure
  async signIn(email: string, password: string) {
    console.log("Auth.signIn called with:", email);
    
    // First, try to find the user in the students table
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('email', email);

    if (!studentError && studentData && studentData.length > 0) {
      const student = studentData[0];
      
      // Check if user has hashed password
      if (student.hashed_password) {
        console.log("Verifying hashed password for student...");
        const isPasswordValid = await verifyPassword(password, student.hashed_password);
        
        if (isPasswordValid) {
          return {
            id: student.sid,
            name: student.name,
            email: student.email,
            role: "student",
            classId: student.class
          };
        }
      }
      
      // Fallback to plain text password if hashed password doesn't exist or doesn't match
      if (student.password === password) {
        return {
          id: student.sid,
          name: student.name,
          email: student.email,
          role: "student",
          classId: student.class
        };
      }
    }

    // If not found in students, try teachers table
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', email);

    if (!teacherError && teacherData && teacherData.length > 0) {
      const teacher = teacherData[0];
      
      // Check if user has hashed password
      if (teacher.hashed_password) {
        console.log("Verifying hashed password for teacher...");
        const isPasswordValid = await verifyPassword(password, teacher.hashed_password);
        
        if (isPasswordValid) {
          return {
            id: teacher.email,
            name: teacher.name,
            email: teacher.email,
            role: "admin",
            classId: teacher.classes
          };
        }
      }
      
      // Fallback to plain text password if hashed password doesn't exist or doesn't match
      if (teacher.password === password) {
        return {
          id: teacher.email,
          name: teacher.name,
          email: teacher.email,
          role: "admin",
          classId: teacher.classes
        };
      }
    }

    // If neither found, throw error
    throw new Error("Invalid email or password");
  },

  // Sign out
  async signOut() {
    localStorage.removeItem("pathwayUser");
  },

  async getSession() {
    const storedUser = localStorage.getItem("pathwayUser");
    return storedUser ? JSON.parse(storedUser) : null;
  },

  async getCurrentUser() {
    const storedUser = localStorage.getItem("pathwayUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }
};
