
// Export all API modules
export { userApi } from './users';
export { multiProjectAuth as auth } from '../auth/multi-project-auth';
export { classApi } from './classes';
export { materialApi } from './materials';
export { achievementApi } from './achievements';
export { challengeApi } from './challenges';

// Export types
export type { Database } from '@/types/database';

// Export supabase client - use the correct integration client
export { supabase } from '@/integrations/supabase/client';
