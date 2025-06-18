import { dynamicSupabase, getCurrentSupabaseClient } from '../supabase/dynamic-client';
import { getProjectByDomain } from '@/config/projects';
import type { Database } from '@/integrations/supabase/types';

// Define user type based on actual tables structure
type StudentUser = Database['public']['Tables']['students']['Row'];
type TeacherUser = Database['public']['Tables']['teachers']['Row'];

export const multiProjectAuth = {
  // Sign in with email and password using project-specific database
  async signIn(email: string, password: string) {
    console.log("MultiProjectAuth.signIn called with:", email);
    
    // Get the appropriate Supabase client based on email domain
    const client = dynamicSupabase.getClientByEmail(email);
    const project = dynamicSupabase.getCurrentProject();
    
    if (!client || !project) {
      const domain = email.split('@')[1];
      console.error(`No project configuration found for domain: ${domain}`);
      throw new Error(`No project configuration found for domain: ${domain}`);
    }

    console.log(`Using project: ${project.projectName} for domain: ${project.domain}`);
    console.log(`Supabase URL: ${project.supabaseUrl}`);
    
    try {
      // First, try to find the user in the students table
      console.log("Attempting to find user in students table...");
      const { data: studentData, error: studentError } = await client
        .from('students')
        .select('*')
        .eq('email', email)
        .eq('password', password);

      console.log("Student query result:", { data: studentData, error: studentError });

      if (!studentError && studentData && studentData.length > 0) {
        const student = studentData[0];
        console.log("Student login successful:", student.email);
        return {
          id: student.sid,
          name: student.name,
          email: student.email,
          role: "student" as const,
          classId: student.class,
          project: project.projectName,
          domain: project.domain
        };
      }

      // If not found in students, try teachers table
      console.log("Attempting to find user in teachers table...");
      const { data: teacherData, error: teacherError } = await client
        .from('teachers')
        .select('*')
        .eq('email', email)
        .eq('password', password);

      console.log("Teacher query result:", { data: teacherData, error: teacherError });

      if (!teacherError && teacherData && teacherData.length > 0) {
        const teacher = teacherData[0];
        console.log("Teacher login successful:", teacher.email);
        return {
          id: teacher.email,
          name: teacher.name,
          email: teacher.email,
          role: "admin" as const,
          classId: teacher.classes,
          project: project.projectName,
          domain: project.domain
        };
      }

      // Log detailed error information
      if (studentError) {
        console.error("Student table error:", studentError);
      }
      if (teacherError) {
        console.error("Teacher table error:", teacherError);
      }

      // If neither found, throw error
      throw new Error("Invalid email or password");
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  },

  // Sign out and clear project data
  async signOut() {
    localStorage.removeItem("pathwayUser");
    dynamicSupabase.reset();
  },

  // Get current session from localStorage
  async getSession() {
    const storedUser = localStorage.getItem("pathwayUser");
    if (!storedUser) return null;

    try {
      const user = JSON.parse(storedUser);
      // Restore the client for this user's domain if needed
      if (user.domain && !dynamicSupabase.getCurrentClient()) {
        dynamicSupabase.getClientByEmail(`user@${user.domain}`);
      }
      return user;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  },

  // Get current user from localStorage
  async getCurrentUser() {
    return this.getSession();
  },

  // Get the current project info
  getCurrentProject() {
    return dynamicSupabase.getCurrentProject();
  },

  // Get current supabase client
  getCurrentClient() {
    return dynamicSupabase.getCurrentClient();
  }
};
