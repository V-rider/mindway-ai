import { supabase } from '../supabase/client';
import type { Database } from '@/types/database';

type Challenge = Database['public']['Tables']['math_challenges']['Row'];
type ChallengeInsert = Database['public']['Tables']['math_challenges']['Insert'];
type ChallengeUpdate = Database['public']['Tables']['math_challenges']['Update'];
type ChallengeAttempt = Database['public']['Tables']['challenge_attempts']['Row'];

export const challengeApi = {
  // Get all challenges
  async getChallenges() {
    const { data, error } = await supabase
      .from('math_challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get challenge by ID
  async getChallengeById(id: string) {
    const { data, error } = await supabase
      .from('math_challenges')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new challenge
  async createChallenge(challengeData: ChallengeInsert) {
    const { data, error } = await supabase
      .from('math_challenges')
      .insert(challengeData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update challenge
  async updateChallenge(id: string, challengeData: ChallengeUpdate) {
    const { data, error } = await supabase
      .from('math_challenges')
      .update(challengeData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete challenge
  async deleteChallenge(id: string) {
    const { error } = await supabase
      .from('math_challenges')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get challenges by difficulty
  async getChallengesByDifficulty(difficulty: number) {
    const { data, error } = await supabase
      .from('math_challenges')
      .select('*')
      .eq('difficulty_level', difficulty)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Submit challenge attempt
  async submitAttempt(
    studentId: string,
    challengeId: string,
    attemptText: string,
    isCorrect: boolean
  ) {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .insert({
        student_id: studentId,
        challenge_id: challengeId,
        attempt_text: attemptText,
        is_correct: isCorrect
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get student attempts
  async getStudentAttempts(studentId: string) {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select(`
        *,
        challenge:math_challenges (
          id,
          title,
          description,
          difficulty_level
        )
      `)
      .eq('student_id', studentId)
      .order('attempted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get challenge attempts
  async getChallengeAttempts(challengeId: string) {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select(`
        *,
        student:users (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('challenge_id', challengeId)
      .order('attempted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get student success rate
  async getStudentSuccessRate(studentId: string) {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select('is_correct')
      .eq('student_id', studentId);

    if (error) throw error;

    const totalAttempts = data.length;
    const correctAttempts = data.filter(attempt => attempt.is_correct).length;
    
    return totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  },

  // Get challenge success rate
  async getChallengeSuccessRate(challengeId: string) {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select('is_correct')
      .eq('challenge_id', challengeId);

    if (error) throw error;

    const totalAttempts = data.length;
    const correctAttempts = data.filter(attempt => attempt.is_correct).length;
    
    return totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  },

  // Get recent challenges
  async getRecentChallenges(limit: number = 5) {
    const { data, error } = await supabase
      .from('math_challenges')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get popular challenges
  async getPopularChallenges(limit: number = 5) {
    const { data, error } = await supabase
      .from('challenge_attempts')
      .select('challenge_id, count')
      .select('challenge_id')
      .order('count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Get full challenge details for the popular challenges
    const challengeIds = data.map(item => item.challenge_id);
    const { data: challenges, error: challengesError } = await supabase
      .from('math_challenges')
      .select('*')
      .in('id', challengeIds);

    if (challengesError) throw challengesError;
    return challenges;
  }
}; 