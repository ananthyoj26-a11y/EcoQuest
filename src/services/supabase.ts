import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserProfile, UserProfileDoc, UserProgressDoc } from '../types';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Non-blocking dual sync helper to save user profile in Supabase database
 */
export const syncProfileToSupabase = async (uid: string, profile: Partial<UserProfileDoc>) => {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: uid,
        full_name: profile.fullName,
        preferred_name: profile.preferredName,
        email: profile.email,
        college_name: profile.collegeName,
        department: profile.department,
        year_of_study: profile.yearOfStudy,
        section: profile.section,
        sustainability_interests: profile.sustainabilityInterests,
        weekly_goal: profile.weeklyGoal,
        selected_avatar: profile.selectedAvatar,
        avatar_customization: profile.avatarCustomization,
        bio: profile.bio,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.warn('Supabase profile sync warning:', error.message);
    }
  } catch (err) {
    console.warn('Supabase profile sync error:', err);
  }
};

/**
 * Non-blocking dual sync helper to save user progress in Supabase database
 */
export const syncProgressToSupabase = async (uid: string, progress: Partial<UserProgressDoc>) => {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        id: uid,
        xp: progress.xp,
        level: progress.level,
        coins: progress.coins,
        streak: progress.streak,
        eco_spirit_name: progress.ecoSpiritName,
        eco_spirit_stage: progress.ecoSpiritStage,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.warn('Supabase progress sync warning:', error.message);
    }
  } catch (err) {
    console.warn('Supabase progress sync error:', err);
  }
};
