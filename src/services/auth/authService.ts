
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
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
        
      if (profileError) throw new ApiError(profileError.message);
      
      return {
        id: data.user!.id,
        email: data.user!.email!,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar
      };
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

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) return null;

      return {
        id: user.id,
        email: user.email!,
        name: profile.name,
        role: profile.role,
        avatar: profile.avatar
      };
    } catch {
      return null;
    }
  }
};
