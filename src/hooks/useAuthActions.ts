
import { useState } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/hooks/useSupabase';
import { mapUserData } from '@/utils/authUtils';

export interface AuthActionsReturn {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  checkIsAuthenticated: () => Promise<boolean>;
}

export const useAuthActions = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): AuthActionsReturn => {
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return { error };
      } 
      
      if (data.user) {
        console.log('Sign in successful for:', data.user.email);
        try {
          // Fetch user profile after successful login
          const mappedUser = await mapUserData(supabase, data.user);
          setUser(mappedUser);
          console.log("User mapped and set after login:", mappedUser?.email);
          
          // Return immediately after setting user to ensure quick UI response
          return { error: null };
        } catch (err) {
          console.error("Error mapping user after login:", err);
          // Continue despite mapping error, auth session is still valid
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role || UserRole.BUYER,
          },
        },
      });

      if (signUpError) return { error: signUpError };

      // Only try to create profile if sign up was successful
      if (data?.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email,
            name: userData.name,
            role: userData.role || UserRole.BUYER,
            phone: userData.phone || '',
            created_at: new Date(),
          },
        ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const checkIsAuthenticated = async (): Promise<boolean> => {
    try {
      console.log("Checking if user is authenticated");
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session?.user;
      console.log("Authentication check result:", isAuthenticated);
      return isAuthenticated;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  };

  return {
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkIsAuthenticated,
  };
};
