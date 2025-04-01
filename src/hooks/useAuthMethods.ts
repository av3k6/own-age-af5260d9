
import { useState, useCallback, useRef, useEffect } from 'react';
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
    } else if (error.message.includes('session expired')) {
      return 'Your session has expired. Please sign in again.';
    } else if (error.message.includes('token expired')) {
      return 'Your authentication token has expired. Please sign in again.';
    }
  }
  
  // Default error message
  return error?.message || 'An unknown error occurred. Please try again.';
};

export const useAuthMethods = ({ supabase, setLoading }: AuthMethodsProps) => {
  const { toast } = useToast();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const SESSION_TIMEOUT_WARNING = 5 * 60 * 1000; // 5 minutes before expiry

  // Helper to clear all timers
  const clearAllTimers = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  };

  // Refresh token to maintain session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh failed:', error);
        return false;
      }

      if (data.session) {
        console.log('Session refreshed successfully');
        setupSessionTimeout(data.session.expires_at);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during session refresh:', error);
      return false;
    }
  }, [supabase]);

  // Set up session timeout warning
  const setupSessionTimeout = useCallback((expiresAt: number | null) => {
    clearAllTimers();

    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt * 1000).getTime();
    const currentTime = new Date().getTime();
    const timeToExpiry = expiryTime - currentTime;
    
    // Set timeout for refresh (10 minutes before expiry)
    const refreshTime = timeToExpiry - (10 * 60 * 1000);
    if (refreshTime > 0) {
      console.log(`Setting refresh timer for ${Math.floor(refreshTime / 60000)} minutes from now`);
      refreshTimerRef.current = setTimeout(() => {
        refreshSession();
      }, refreshTime);
    }
    
    // Set timeout for warning (5 minutes before expiry)
    const warningTime = timeToExpiry - SESSION_TIMEOUT_WARNING;
    if (warningTime > 0) {
      console.log(`Setting warning timer for ${Math.floor(warningTime / 60000)} minutes from now`);
      sessionTimeoutRef.current = setTimeout(() => {
        toast({
          title: "Session Expiring Soon",
          description: "Your session will expire soon. Please save your work.",
          duration: 10000,
          variant: "warning",
        });
      }, warningTime);
    }
  }, [toast, refreshSession]);

  // Sign in
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
  }, [supabase, setLoading, toast, setupSessionTimeout]);

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
  }, [supabase, setLoading]);

  const checkIsAuthenticated = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If session exists, setup timeout notifications
      if (session?.expires_at) {
        setupSessionTimeout(session.expires_at);
      }
      
      return !!session?.user;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }, [supabase, setupSessionTimeout]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  return {
    signIn,
    signUp,
    signOut,
    checkIsAuthenticated,
    refreshSession
  };
};
