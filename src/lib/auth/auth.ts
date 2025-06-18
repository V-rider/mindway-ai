
import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

export const auth = {
  // Sign in with email and password using existing database structure
  async signIn(email: string, password: string) {
    // First, try to find the user in the Students table
    const { data: studentData, error: studentError } = await supabase
      .from('Students')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (!studentError && studentData) {
      return {
        id: studentData.sid,
        name: studentData.name,
        email: studentData.email,
        role: "student",
        classId: studentData.class
      };
    }

    // If not found in Students, try Teachers table
    const { data: teacherData, error: teacherError } = await supabase
      .from('Teachers')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (!teacherError && teacherData) {
      return {
        id: teacherData.email,
        name: teacherData.name,
        email: teacherData.email,
        role: "admin",
        classId: teacherData.classes
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
