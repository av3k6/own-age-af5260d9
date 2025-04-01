
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';
import { mapUserData } from '@/utils/authUtils';
import { useAuthActions, AuthActionsReturn } from '@/hooks/useAuthActions';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const authActions = useAuthActions(setUser);

  useEffect(() => {
    let isMounted = true;
    
    const getSession = async () => {
      try {
        console.log("Getting session...");
        
        // Get the current session immediately
        const { data, error } = await supabase.auth.getSession();
        
        // Only update state if component is still mounted
        if (!isMounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          setUser(null);
        } else if (data.session?.user) {
          console.log("Session found for user:", data.session.user.email);
          try {
            const mappedUser = await mapUserData(supabase, data.session.user);
            // Check again if mounted before updating state
            if (!isMounted) return;
            
            console.log("User data mapped successfully:", mappedUser);
            setUser(mappedUser);
          } catch (mapErr) {
            if (!isMounted) return;
            console.error("Error mapping user data:", mapErr);
            setUser(null);
          }
        } else {
          if (!isMounted) return;
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error in overall getSession process:', error);
        setUser(null);
      } finally {
        // Only update state if component is still mounted
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
          console.log("Auth initialization complete, loading:", false);
        }
      }
    };

    // Start session fetch immediately
    getSession();
    
    // Set a backup timeout to ensure isInitialized is set
    const backupTimer = setTimeout(() => {
      if (isMounted && !isInitialized) {
        console.warn("Forcing auth initialization after timeout");
        setIsInitialized(true);
        setLoading(false);
      }
    }, 1500);
    
    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted) return;
          
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            try {
              const mappedUser = await mapUserData(supabase, session.user);
              
              // Double-check if still mounted before state updates
              if (!isMounted) return;
              
              setUser(mappedUser);
              console.log("User mapped and set after auth change:", mappedUser?.email);
              
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Signed in",
                  description: `Welcome${mappedUser?.name ? `, ${mappedUser.name}` : ''}!`,
                });
              }
            } catch (err) {
              if (!isMounted) return;
              console.error("Error mapping user on auth change:", err);
              setUser(null);
            }
          } else {
            if (!isMounted) return;
            console.log("No user in auth state change session");
            setUser(null);
            
            if (event === 'SIGNED_OUT') {
              toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
              });
            }
          }
          
          // Always ensure these states are updated if still mounted
          if (isMounted) {
            setLoading(false);
            setIsInitialized(true);
          }
        }
      );
      
      subscription = data.subscription;
    } catch (err) {
      if (!isMounted) return;
      console.error("Error setting up auth state change listener:", err);
      setIsInitialized(true);
      setLoading(false);
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      clearTimeout(backupTimer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase, toast]);

  // Create safe wrapper functions to prevent operations after unmount
  const safeAuthActions = {
    ...authActions,
    loading,
    isInitialized
  };

  return (
    <AuthContext.Provider value={{ user, ...safeAuthActions }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
