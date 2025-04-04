
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (supabase: SupabaseClient) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};
