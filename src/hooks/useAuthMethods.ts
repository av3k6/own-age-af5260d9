
import { useState, useCallback } from 'react';
import { SupabaseClient, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthMethodsProps {
  supabase: SupabaseClient;
  setLoading: (loading: boolean) => void;
}

// Error message mapping to provide more specific error messages
const getAuthErrorMessage = (error: AuthError | Error | any): string => {
  // Handle Supabase AuthError types
  if (error?.message) {
    if (error.message.includes('Email not confirmed')) {
      return 'Please verify your email address before logging in.';
    } else if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    } else if (error.message.includes('Email already registered')) {
      return 'This email is already registered. Try logging in instead.';
    } else if (error.message.includes('Password should be')) {
      return 'Password should be at least 6 characters long.';
    } else if (error.message.includes('rate limit')) {
      return 'Too many login attempts. Please try again later.';
    }
  }
  
  // Default error message
  return error?.message || 'An unknown error occurred. Please try again.';
};

export const useAuthMethods = ({ supabase, setLoading }: AuthMethodsProps) => {
  const { toast } = useToast();

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
        const errorMessage = getAuthErrorMessage(error);
        return { error: { ...error, message: errorMessage } };
      } 
      
      console.log('Sign in successful:', data);
      return { error: null, data };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      const errorMessage = getAuthErrorMessage(error);
      return { error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  }, [supabase, setLoading, toast]);

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

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      console.log('Sign out request sent');
      
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
