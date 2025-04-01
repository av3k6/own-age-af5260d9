
import { useState, useCallback, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '@/types';
import { mapUserData } from '@/utils/authUtils';

interface UseAuthInitializerReturn {
  user: User | null;
  isInitialized: boolean;
}

export const useAuthInitializer = (supabase: SupabaseClient): UseAuthInitializerReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAuth = useCallback(async () => {
    let isMounted = true;
    try {
      console.log("Initializing auth state");
      
      // Get the current session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        if (isMounted) {
          setUser(null);
          setIsInitialized(true);
        }
        return;
      }
      
      if (data.session?.user && isMounted) {
        try {
          const mappedUser = await mapUserData(supabase, data.session.user);
          if (isMounted) {
            console.log("User data mapped successfully:", mappedUser?.email);
            setUser(mappedUser);
          }
        } catch (mapErr) {
          console.error("Error mapping user data:", mapErr);
          if (isMounted) {
            setUser(null);
          }
        }
      } else if (isMounted) {
        console.log('No active session found');
        setUser(null);
      }
    } catch (error) {
      console.error("Error in auth initialization:", error);
      if (isMounted) {
        setUser(null);
      }
    } finally {
      if (isMounted) {
        setIsInitialized(true);
        console.log("Auth initialization completed");
      }
    }

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    let cleanup: () => void;
    
    const initialize = async () => {
      cleanup = await initializeAuth();
    };

    initialize();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeAuth]);

  return {
    user,
    isInitialized
  };
};
