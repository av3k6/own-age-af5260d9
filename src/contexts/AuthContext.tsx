
import React, { createContext, useContext, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { AuthContextType } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const {
    user,
    loading,
    setLoading,
    isInitialized,
    sessionStatus,
    setSessionStatus
  } = useAuthState(supabase);

  const {
    signIn,
    signUp,
    signOut,
    checkIsAuthenticated,
    refreshSession
  } = useAuthMethods({
    supabase,
    setLoading
  });

  // Global session refresh mechanism
  useEffect(() => {
    const SESSION_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes
    let intervalId: number;
    
    // Only set up interval if user is logged in
    if (user) {
      console.log('Setting up periodic session check');
      intervalId = window.setInterval(async () => {
        console.log('Performing periodic session check');
        const isStillAuthenticated = await checkIsAuthenticated();
        
        if (!isStillAuthenticated) {
          setSessionStatus('expired');
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive"
          });
        }
      }, SESSION_CHECK_INTERVAL);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [user, checkIsAuthenticated, toast, setSessionStatus]);

  // Handle session status changes
  useEffect(() => {
    if (sessionStatus === 'expired') {
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
    }
  }, [sessionStatus, toast]);

  // Provide auth context values
  const value: AuthContextType = {
    user,
    isInitialized,
    loading,
    sessionStatus,
    signIn,
    signUp,
    signOut,
    checkIsAuthenticated,
    refreshSession
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
