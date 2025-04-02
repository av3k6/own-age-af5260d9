
import { useEffect, useRef } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { mapUserData } from '@/utils/authUtils';
import { SessionStatus } from '@/types/auth';

interface UseAuthStateListenerProps {
  supabase: SupabaseClient;
  user: User | null;
  setUser: (user: User | null) => void;
  setSessionStatus: (status: SessionStatus) => void;
  isInitialized: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;
}

export const useAuthStateListener = ({
  supabase,
  user,
  setUser,
  setSessionStatus,
  isInitialized,
  loading,
  setLoading,
  setIsInitialized
}: UseAuthStateListenerProps) => {
  const authStateInitialized = useRef(false);
  const { toast } = useToast();
  
  // Set up auth state change listener
  useEffect(() => {
    if (!authStateInitialized.current && isInitialized) {
      authStateInitialized.current = true;
    }
    
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
  }, [supabase, toast, loading, isInitialized, setUser, setSessionStatus, setLoading, setIsInitialized]);
};
