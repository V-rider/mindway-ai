
import { supabase, handleSupabaseError } from '../supabase/client';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const userApi = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) return null;

    const { data, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;
    return data;
  },

  // Get user by ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Get all users (admin only)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update user
  async updateUser(id: string, userData: UserUpdate) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete user
  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get users by role
  async getUsersByRole(role: User['role']) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update user avatar
  async updateUserAvatar(id: string, avatarUrl: string) {
    const { data, error } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
