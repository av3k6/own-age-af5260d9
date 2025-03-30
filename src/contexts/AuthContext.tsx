
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';
import { mapUserData } from '@/utils/authUtils';
import { useAuthActions, AuthActionsReturn } from '@/hooks/useAuthActions';

interface AuthContextType extends AuthActionsReturn {
  user: User | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { supabase } = useSupabase();
  const authActions = useAuthActions(setUser);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        console.log("Getting session...");
        
        // Increase timeout for session fetch to 10 seconds
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Session fetch timed out')), 10000);
        });
        
        try {
          // First try to get session without racing against timeout
          const { data, error } = await supabase.auth.getSession();
          
          if (data.session?.user) {
            try {
              const mappedUser = await mapUserData(supabase, data.session.user);
              setUser(mappedUser);
              console.log('Session found and user set:', mappedUser?.email);
            } catch (mapErr) {
              console.error("Error mapping user data:", mapErr);
              setUser(null);
            }
          } else {
            console.log('No active session found');
            setUser(null);
          }
        } catch (err) {
          console.error("Error getting session:", err);
          setUser(null);
        } finally {
          setLoading(false);
          setIsInitialized(true);
          console.log("Auth loading state set to false, initialization complete");
        }
      } catch (error) {
        console.error('Error in overall getSession process:', error);
        setUser(null);
        setLoading(false);
        setIsInitialized(true);
      }
    };

    // Start session fetch with a small delay to allow other components to initialize
    const timer = setTimeout(() => {
      getSession();
    }, 100);
    
    // Set a backup timeout to ensure isInitialized is set even if everything else fails
    const backupTimer = setTimeout(() => {
      if (!isInitialized) {
        console.warn("Forcing auth initialization after timeout");
        setIsInitialized(true);
        setLoading(false);
      }
    }, 5000);

    // Listen for auth changes with improved error handling
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            try {
              const mappedUser = await mapUserData(supabase, session.user);
              setUser(mappedUser);
              console.log("User mapped and set after auth change:", mappedUser?.email);
            } catch (err) {
              console.error("Error mapping user on auth change:", err);
              setUser(null);
            }
          } else {
            console.log("No user in auth state change session");
            setUser(null);
          }
          setLoading(false);
          setIsInitialized(true);
        }
      );
      
      subscription = data.subscription;
    } catch (err) {
      console.error("Error setting up auth state change listener:", err);
      setIsInitialized(true);
      setLoading(false);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(backupTimer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const value = {
    user,
    loading,
    isInitialized,
    ...authActions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
