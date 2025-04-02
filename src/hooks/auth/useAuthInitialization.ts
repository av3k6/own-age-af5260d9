
import { useState, useEffect, useRef } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { mapUserData } from '@/utils/authUtils';
import { SessionStatus } from '@/types/auth';

interface UseAuthInitializationProps {
  supabase: SupabaseClient;
  setUser: (user: User | null) => void;
  setSessionStatus: (status: SessionStatus) => void;
  setLoading: (loading: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;
}

export const useAuthInitialization = ({
  supabase,
  setUser,
  setSessionStatus,
  setLoading,
  setIsInitialized
}: UseAuthInitializationProps) => {
  const initializationTimeout = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    // Set a timeout to force initialization after 1.5 seconds
    // This prevents infinite loading if Supabase is slow to respond
    initializationTimeout.current = setTimeout(() => {
      if (isMounted) {
        console.log("Forcing auth initialization due to timeout");
        setLoading(false);
        setIsInitialized(true);
      }
    }, 1500);
    
    async function initializeAuth() {
      try {
        console.log("Initializing auth state...");
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setUser(null);
          setSessionStatus('error');
          return;
        }
        
        if (sessionData?.session?.user) {
          console.log("Session found, mapping user data");
          const fullUserData = await mapUserData(supabase, sessionData.session.user);
          
          if (!isMounted) return;
          
          if (fullUserData) {
            setUser(fullUserData);
            setSessionStatus('active');
            console.log("User initialized:", fullUserData.email);
          } else {
            console.log("Could not map user data, using basic info");
            // Fallback to basic user info
            const basicUserData: User = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email || '',
              name: sessionData.session.user.user_metadata?.full_name || '',
              role: sessionData.session.user.user_metadata?.role || 'buyer',
              createdAt: new Date(),
              user_metadata: sessionData.session.user.user_metadata
            };
            setUser(basicUserData);
            setSessionStatus('active');
          }
        } else {
          setUser(null);
          setSessionStatus('unauthenticated');
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (isMounted) {
          setUser(null);
          setSessionStatus('error');
        }
      } finally {
        if (isMounted && initializationTimeout.current) {
          clearTimeout(initializationTimeout.current);
          initializationTimeout.current = null;
          
          setLoading(false);
          setIsInitialized(true);
          console.log("Auth initialized, setting page ready");
        }
      }
    }
    
    initializeAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (initializationTimeout.current) {
        clearTimeout(initializationTimeout.current);
        initializationTimeout.current = null;
      }
    };
  }, [supabase, setUser, setSessionStatus, setLoading, setIsInitialized]);
  
  return {
    clearInitializationTimeout: () => {
      if (initializationTimeout.current) {
        clearTimeout(initializationTimeout.current);
        initializationTimeout.current = null;
      }
    }
  };
};
