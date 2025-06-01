
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = 'https://hjxyietnrsatxrrbfyps.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqeHlpZXRucnNhdHhycmJmeXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTI0OTIsImV4cCI6MjA1OTk2ODQ5Mn0.opYimrTMuwG-eCUOIOnLU68jhELacHimB2sJCVSqtYs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred while communicating with the database');
};
