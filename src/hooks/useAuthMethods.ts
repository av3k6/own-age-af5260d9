
import { useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

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
      
      console.log('Sign in successful:', data);
      return { error: null, data };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading]);

  const signUp = useCallback(async (email: string, password: string, userData: { name?: string; role?: string }) => {
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
        },
      });

      return { error, data };
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
      console.log('Sign out request sent');
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading]);

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
    checkIsAuthenticated
  };
};
