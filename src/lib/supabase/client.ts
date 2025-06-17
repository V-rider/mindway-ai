// This file re-exports the database instance getter from integrations
// and provides a generic database error handler.

export { getDbInstance } from '@/integrations/supabase/client';

// Helper function to handle Database errors
export const handleDbError = (error: any, context?: string) => {
  const message = context ? `Error in ${context}: ` : 'Database error: ';
  console.error(message, error);
  if (error instanceof Error) {
    throw new Error(`\${message}\${error.message}`);
  }
  throw new Error(`\${message}An unknown error occurred`);
};
