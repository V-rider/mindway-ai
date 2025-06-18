
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { ProjectConfig } from '@/config/projects';

// Create clients for each project
export const createProjectClient = (projectConfig: ProjectConfig) => {
  return createClient<Database>(
    projectConfig.supabaseUrl,
    projectConfig.supabaseAnonKey,
    {
      auth: {
        storage: localStorage,
        persistSession: false, // Don't persist session for migration utility
        autoRefreshToken: false,
      }
    }
  );
};

// Check if hashed_password column exists in a table
export const checkHashedPasswordColumn = async (supabase: any, tableName: string, projectName: string) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('hashed_password')
      .limit(1);
    
    if (error && error.code === '42703') {
      console.error(`Column hashed_password does not exist in ${tableName} table for ${projectName}. Please run the database migration first.`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking hashed_password column in ${tableName} for ${projectName}:`, error);
    return false;
  }
};

// Hash password using Edge Function
export const hashPasswordWithEdgeFunction = async (supabase: any, password: string, projectName: string) => {
  const { data: hashResult, error: hashError } = await supabase.functions.invoke('auth-password', {
    body: {
      action: 'hash',
      password: password
    }
  });

  if (hashError) {
    throw new Error(`Error hashing password in ${projectName}: ${hashError.message || hashError}`);
  }

  return hashResult.hashedPassword;
};
