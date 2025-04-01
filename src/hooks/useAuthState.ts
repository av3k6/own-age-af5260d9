
import { useState, useEffect, useRef } from 'react';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { mapUserData } from '@/utils/authUtils';
import { SessionStatus } from '@/types/auth';

export const useAuthState = (supabase: SupabaseClient) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('active');
  const authStateInitialized = useRef(false);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
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
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
          authStateInitialized.current = true;
          console.log("Auth initialized, setting page ready");
        }
      }
    }
    
    initializeAuth();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Set up auth state change listener
  useEffect(() => {
    if (!authStateInitialized.current) return;
    
    let isMounted = true;
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;
        
        try {
          if (event === 'TOKEN_REFRESHED') {
            console.log("Token refreshed successfully");
            setSessionStatus('active');
          } else if (event === 'SIGNED_OUT') {
            setSessionStatus('unauthenticated');
            setUser(null);
          }
          
          if (session?.user) {
            console.log("Auth state change with user, mapping data");
            const fullUserData = await mapUserData(supabase, session.user);
            
            if (!isMounted) return;
            
            if (fullUserData) {
              setUser(fullUserData);
              setSessionStatus('active');
            } else {
              // Fallback to basic user info if mapping fails
              const basicUserData: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.full_name || '',
                role: session.user.user_metadata?.role || 'buyer',
                createdAt: new Date(),
                user_metadata: session.user.user_metadata
              };
              setUser(basicUserData);
              setSessionStatus('active');
            }
            
            if (event === 'SIGNED_IN') {
              toast({
                title: "Signed in",
                description: `Welcome${fullUserData?.name ? `, ${fullUserData.name}` : ''}!`,
              });
            }
          } else {
            setUser(null);
            
            if (event === 'SIGNED_OUT') {
              toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
              });
              setSessionStatus('unauthenticated');
            }
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setSessionStatus('error');
        }
      }
    );

    // Force set initialization flag after 2 seconds if still not set
    // This prevents infinite loading screens in case of auth issues
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log("Force setting page ready to true");
        setLoading(false);
        setIsInitialized(true);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase, toast, loading]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    isInitialized,
    sessionStatus,
    setSessionStatus
  };
};
