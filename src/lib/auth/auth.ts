
import { supabase } from '@/integrations/supabase/client';
import { PasswordUtils } from './password-utils';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export const auth = {
  // Sign in with email and password using existing database structure
  async signIn(email: string, password: string) {
    console.log("Auth.signIn called with:", email);
    
    // First, try to find the user in the students table (lowercase)
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('email', email);

    if (!studentError && studentData && studentData.length > 0) {
      const student = studentData[0];
      
      // Check password using new hashed password or fallback to old password
      let passwordValid = false;
      
      if (student.hashed_password) {
        // Use new hashed password verification
        passwordValid = await PasswordUtils.verifyPassword(password, student.hashed_password);
        console.log("Using hashed password verification for student");
      } else if (student.password === password) {
        // Fallback to old plain text password
        passwordValid = true;
        console.log("Using legacy password verification for student");
        
        // Optionally upgrade to hashed password
        try {
          const hashedPassword = await PasswordUtils.hashPassword(password);
          await supabase
            .from('students')
            .update({ hashed_password: hashedPassword })
            .eq('email', email);
          console.log("Upgraded student password to hashed version");
        } catch (error) {
          console.warn("Failed to upgrade student password:", error);
        }
      }
      
      if (passwordValid) {
        return {
          id: student.sid,
          name: student.name,
          email: student.email,
          role: "student",
          classId: student.class
        };
      }
    }

    // If not found in students, try teachers table (lowercase)
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', email);

    if (!teacherError && teacherData && teacherData.length > 0) {
      const teacher = teacherData[0];
      
      // Check password using new hashed password or fallback to old password
      let passwordValid = false;
      
      if (teacher.hashed_password) {
        // Use new hashed password verification
        passwordValid = await PasswordUtils.verifyPassword(password, teacher.hashed_password);
        console.log("Using hashed password verification for teacher");
      } else if (teacher.password === password) {
        // Fallback to old plain text password
        passwordValid = true;
        console.log("Using legacy password verification for teacher");
        
        // Optionally upgrade to hashed password
        try {
          const hashedPassword = await PasswordUtils.hashPassword(password);
          await supabase
            .from('teachers')
            .update({ hashed_password: hashedPassword })
            .eq('email', email);
          console.log("Upgraded teacher password to hashed version");
        } catch (error) {
          console.warn("Failed to upgrade teacher password:", error);
        }
      }
      
      if (passwordValid) {
        return {
          id: teacher.email,
          name: teacher.name,
          email: teacher.email,
          role: "admin",
          classId: teacher.classes
        };
      }
    }

    // If neither found or password invalid, throw error
    throw new Error("Invalid email or password");
  },

  // Sign out
  async signOut() {
    // Simply clear local storage since we're not using Supabase auth
    localStorage.removeItem("pathwayUser");
  },

  // Get current session from localStorage
  async getSession() {
    const storedUser = localStorage.getItem("pathwayUser");
    return storedUser ? JSON.parse(storedUser) : null;
  },

  // Get current user from localStorage
  async getCurrentUser() {
    const storedUser = localStorage.getItem("pathwayUser");
    return storedUser ? JSON.parse(storedUser) : null;
  }
};
