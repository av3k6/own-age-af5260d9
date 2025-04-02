
import { useCallback, useRef, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface UseSessionManagementProps {
  supabase: SupabaseClient;
}

export const useSessionManagement = ({ supabase }: UseSessionManagementProps) => {
  const { toast } = useToast();
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const SESSION_TIMEOUT_WARNING = 5 * 60 * 1000; // 5 minutes before expiry

  // Helper to clear all timers
  const clearAllTimers = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
  }, []);

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
          variant: "default",
        });
      }, warningTime);
    }
  }, [toast, refreshSession, clearAllTimers]);

  // Check if user is authenticated
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
  }, [clearAllTimers]);

  return {
    refreshSession,
    setupSessionTimeout,
    checkIsAuthenticated,
    clearAllTimers
  };
};
