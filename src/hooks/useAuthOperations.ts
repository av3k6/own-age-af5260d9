
import { useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { getAuthErrorMessage } from '@/utils/authErrorUtils';
import { useSessionManagement } from './useSessionManagement';

interface UseAuthOperationsProps {
  supabase: SupabaseClient;
  setLoading: (loading: boolean) => void;
}

export const useAuthOperations = ({ supabase, setLoading }: UseAuthOperationsProps) => {
  const { setupSessionTimeout, clearAllTimers } = useSessionManagement({ supabase });

  // Sign in
  const signIn = useCallback(async (email: string, password: string, captchaToken?: string) => {
    try {
      console.log('Attempting to sign in:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: captchaToken || undefined
        }
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        const errorMessage = getAuthErrorMessage(error);
        return { error: { ...error, message: errorMessage } };
      } 
      
      console.log('Sign in successful:', data);
      
      // Set up session timeout management if login successful
      if (data?.session?.expires_at) {
        setupSessionTimeout(data.session.expires_at);
      }
      
      return { error: null, data };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      const errorMessage = getAuthErrorMessage(error);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading, setupSessionTimeout]);

  // Sign up
  const signUp = useCallback(async (email: string, password: string, userData: { name?: string; role?: string }, captchaToken?: string) => {
    setLoading(true);
    try {
      // Simple signup with minimal data
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name || '',
            role: userData.role || 'buyer',
          },
          captchaToken: captchaToken || undefined
        }
      });

      if (error) {
        const errorMessage = getAuthErrorMessage(error);
        return { error: { ...error, message: errorMessage } };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      const errorMessage = getAuthErrorMessage(error);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading]);

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      console.log('Sign out request sent');
      
      // Clear all session timers
      clearAllTimers();
      
      if (error) {
        console.error('Error signing out:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading, clearAllTimers]);

  return {
    signIn,
    signUp,
    signOut
  };
};
