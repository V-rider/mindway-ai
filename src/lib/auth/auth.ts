
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export const auth = {
  // Sign in with email and password using existing database structure
  async signIn(email: string, password: string) {
    console.log("Auth.signIn called with:", email);
    
    // First, try to find the user in the Students table
    const { data: studentData, error: studentError } = await supabase
      .from('Students')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (!studentError && studentData && studentData.length > 0) {
      const student = studentData[0];
      return {
        id: student.sid,
        name: student.name,
        email: student.email,
        role: "student",
        classId: student.class
      };
    }

    // If not found in Students, try Teachers table
    const { data: teacherData, error: teacherError } = await supabase
      .from('Teachers')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (!teacherError && teacherData && teacherData.length > 0) {
      const teacher = teacherData[0];
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
