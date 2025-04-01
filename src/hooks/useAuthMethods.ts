
import { useState, useCallback } from 'react';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { mapUserData } from '@/utils/authUtils';

interface AuthMethodsProps {
  supabase: SupabaseClient;
  setLoading: (loading: boolean) => void;
}

export const useAuthMethods = ({ supabase, setLoading }: AuthMethodsProps) => {
  const signIn = useCallback(async (email: string, password: string) => {
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
      
      // We don't need to manually set the user here
      // The auth state listener will handle it
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading]);

  const signUp = useCallback(async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role,
            phone: userData.phone || '',
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
            role: userData.role,
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
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      // Don't manually set user to null here
      // The auth state listener will handle it
      console.log('Sign out request sent');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  }, [supabase]);

  const checkIsAuthenticated = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }, [supabase]);

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkIsAuthenticated
  };
};
