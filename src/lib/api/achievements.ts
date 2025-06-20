import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Achievement = Database['public']['Tables']['achievements']['Row'];
type AchievementInsert = Database['public']['Tables']['achievements']['Insert'];
type AchievementUpdate = Database['public']['Tables']['achievements']['Update'];
type StudentAchievement = Database['public']['Tables']['student_achievements']['Row'];

export const achievementApi = {
  // Get all achievements
  async getAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get achievement by ID
  async getAchievementById(id: string) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new achievement
  async createAchievement(achievementData: AchievementInsert) {
    const { data, error } = await supabase
      .from('achievements')
      .insert(achievementData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update achievement
  async updateAchievement(id: string, achievementData: AchievementUpdate) {
    const { data, error } = await supabase
      .from('achievements')
      .update(achievementData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete achievement
  async deleteAchievement(id: string) {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Award achievement to student
  async awardAchievement(studentId: string, achievementId: string) {
    const { data, error } = await supabase
      .from('student_achievements')
      .insert({
        student_id: studentId,
        achievement_id: achievementId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove achievement from student
  async removeAchievement(studentId: string, achievementId: string) {
    const { error } = await supabase
      .from('student_achievements')
      .delete()
      .eq('student_id', studentId)
      .eq('achievement_id', achievementId);

    if (error) throw error;
  },

  // Get student achievements
  async getStudentAchievements(studentId: string) {
    const { data, error } = await supabase
      .from('student_achievements')
      .select(`
        *,
        achievement:achievements (
          id,
          title,
          description,
          criteria,
          badge_url
        )
      `)
      .eq('student_id', studentId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data.map(item => item.achievement);
  },

  // Get achievement recipients
  async getAchievementRecipients(achievementId: string) {
    const { data, error } = await supabase
      .from('student_achievements')
      .select(`
        *,
        student:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('achievement_id', achievementId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data.map(item => item.student);
  },

  // Check if student has achievement
  async hasAchievement(studentId: string, achievementId: string) {
    const { data, error } = await supabase
      .from('student_achievements')
      .select('id')
      .eq('student_id', studentId)
      .eq('achievement_id', achievementId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
    return !!data;
  },

  // Get all student achievements with details
  async getAllStudentAchievements() {
    const { data, error } = await supabase
      .from('student_achievements')
      .select(`
        *,
        student:users (
          id,
          full_name,
          email,
          avatar_url
        ),
        achievement:achievements (
          id,
          title,
          description,
          criteria,
          badge_url
        )
      `)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}; 