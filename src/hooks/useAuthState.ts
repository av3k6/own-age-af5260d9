
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { mapUserData } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';

export const useAuthState = (supabase: SupabaseClient) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

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
    
    const setupAuth = async () => {
      // Initialize auth state
      cleanup = await initializeAuth();
      
      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          
          if (session?.user) {
            try {
              const mappedUser = await mapUserData(supabase, session.user);
              setUser(mappedUser);
              
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Signed in",
                  description: `Welcome${mappedUser?.name ? `, ${mappedUser.name}` : ''}!`,
                });
              }
            } catch (err) {
              console.error("Error mapping user on auth change:", err);
              setUser(null);
            }
          } else {
            setUser(null);
            
            if (event === 'SIGNED_OUT') {
              toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
              });
            }
          }
        }
      );

      return () => {
        subscription.unsubscribe();
        if (cleanup) cleanup();
      };
    };

    setupAuth();
  }, [supabase, toast, initializeAuth]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    isInitialized,
  };
};
