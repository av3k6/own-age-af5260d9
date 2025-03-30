
import { User, UserRole } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

// Map Supabase user data to our User type
export const mapUserData = async (
  supabase: SupabaseClient,
  sessionUser: any
): Promise<User | null> => {
  if (!sessionUser) return null;
  
  try {
    // Try to get user profile from users table
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionUser.id)
      .single();
      
    if (userData && !error) {
      console.log('User profile found in database:', userData);
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name || '',
        role: userData.role as UserRole,
        phone: userData.phone || '',
        profileImage: userData.profile_image,
        bio: userData.bio,
        createdAt: new Date(userData.created_at),
      };
    } else {
      console.log('User profile not found in database, using auth metadata');
      // Fallback to basic user info if profile not found
      return {
        id: sessionUser.id,
        email: sessionUser.email || '',
        name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || '',
        role: (sessionUser.user_metadata?.role as UserRole) || UserRole.BUYER,
        createdAt: new Date(),
      };
    }
  } catch (error) {
    console.error('Error mapping user data:', error);
    // Minimal fallback
    return {
      id: sessionUser.id,
      email: sessionUser.email || '',
      name: '',
      role: UserRole.BUYER,
      createdAt: new Date(),
    };
  }
};
