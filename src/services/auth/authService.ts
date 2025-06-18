
import { supabase } from '@/integrations/supabase/client';
import { ApiError, handleApiError } from '@/lib/api/base';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw new ApiError(error.message);
      
      // Try to fetch user profile, but handle case where profiles table doesn't exist
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles' as any)
          .select('*')
          .eq('id', data.user?.id)
          .single();
          
        if (profileError || !profile) {
          // Return basic user info if profile doesn't exist
          return {
            id: data.user!.id,
            email: data.user!.email!,
            name: data.user!.email!.split('@')[0], // Use email username as fallback
            role: 'student', // Default role
            avatar: undefined
          };
        }
        
        return {
          id: data.user!.id,
          email: data.user!.email!,
          name: profile.name || data.user!.email!.split('@')[0],
          role: profile.role || 'student',
          avatar: profile.avatar
        };
      } catch (profileError) {
        // Return basic user info if profiles table doesn't exist
        return {
          id: data.user!.id,
          email: data.user!.email!,
          name: data.user!.email!.split('@')[0],
          role: 'student',
          avatar: undefined
        };
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new ApiError(error.message);
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      try {
        const { data: profile, error } = await supabase
          .from('profiles' as any)
          .select('*')
          .eq('id', user.id)
          .single();

        if (error || !profile) {
          // Return basic user info if profile doesn't exist
          return {
            id: user.id,
            email: user.email!,
            name: user.email!.split('@')[0],
            role: 'student',
            avatar: undefined
          };
        }

        return {
          id: user.id,
          email: user.email!,
          name: profile.name || user.email!.split('@')[0],
          role: profile.role || 'student',
          avatar: profile.avatar
        };
      } catch {
        // Return basic user info if profiles table doesn't exist
        return {
          id: user.id,
          email: user.email!,
          name: user.email!.split('@')[0],
          role: 'student',
          avatar: undefined
        };
      }
    } catch {
      return null;
    }
  }
};
