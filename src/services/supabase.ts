import { UserProfileDoc, UserProgressDoc } from '../types';

export const isSupabaseConfigured = false;
export const supabase = null;

/**
 * Disabled Supabase database sync per project request (No data added to Supabase)
 */
export const syncProfileToSupabase = async (_uid: string, _profile: Partial<UserProfileDoc>) => {
  // Disabled — state kept locally/in-memory
  return;
};

/**
 * Disabled Supabase database sync per project request (No data added to Supabase)
 */
export const syncProgressToSupabase = async (_uid: string, _progress: Partial<UserProgressDoc>) => {
  // Disabled — state kept locally/in-memory
  return;
};
