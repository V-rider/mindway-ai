
// Re-export the main Supabase client from integrations
export { supabase } from '@/integrations/supabase/client';

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred while communicating with the database');
};
