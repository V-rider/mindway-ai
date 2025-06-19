
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export const auth = {
  // Sign in with email and password using existing database structure with secure password verification
  async signIn(email: string, password: string) {
    console.log("Auth.signIn called with:", email);
    
    // First, try to find the user in the students table (lowercase)
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('email', email);

    if (!studentError && studentData && studentData.length > 0) {
      const student = studentData[0];
      
      // Verify password using the Edge Function
      const { data: verifyResult, error: verifyError } = await supabase.functions.invoke('auth-password', {
        body: {
          action: 'verify',
          password: password,
          storedHash: student.hashed_password
        }
      });

      if (verifyError) {
        console.error("Password verification error:", verifyError);
        throw new Error("Authentication failed");
      }

      if (!verifyResult?.isValid) {
        throw new Error("Invalid email or password");
      }

      return {
        id: student.sid,
        name: student.name,
        email: student.email,
        role: "student",
        classId: student.class
      };
    }

    // If not found in students, try teachers table (lowercase)
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', email);

    if (!teacherError && teacherData && teacherData.length > 0) {
      const teacher = teacherData[0];
      
      // Verify password using the Edge Function with hashed_password column
      const { data: verifyResult, error: verifyError } = await supabase.functions.invoke('auth-password', {
        body: {
          action: 'verify',
          password: password,
          storedHash: teacher.hashed_password
        }
      });

      if (verifyError) {
        console.error("Password verification error:", verifyError);
        throw new Error("Authentication failed");
      }

      if (!verifyResult?.isValid) {
        throw new Error("Invalid email or password");
      }

      return {
        id: teacher.email,
        name: teacher.name,
        email: teacher.email,
        role: "admin",
        classId: teacher.classes
      };
    }

    // If neither found, throw error
    throw new Error("Invalid email or password");
  },

  // Sign out
  async signOut() {
    // Simply clear local storage since we're not using Supabase auth
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
