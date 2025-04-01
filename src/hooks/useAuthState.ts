
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export const useAuthState = (supabase: SupabaseClient) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    async function initializeAuth() {
      try {
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setUser(null);
          return;
        }
        
        if (sessionData?.session?.user) {
          // Map the user basic data
          const userData: User = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || '',
            name: sessionData.session.user.user_metadata?.full_name || '',
            role: sessionData.session.user.user_metadata?.role || 'buyer',
            createdAt: new Date(),
            user_metadata: sessionData.session.user.user_metadata
          };
          
          setUser(userData);
          console.log("User initialized:", userData.email);
        } else {
          setUser(null);
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    }
    
    initializeAuth();
  }, [supabase]);

  // Set up auth state change listener
  useEffect(() => {
    if (!isInitialized) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          // Map the user data simply
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || '',
            role: session.user.user_metadata?.role || 'buyer',
            createdAt: new Date(),
            user_metadata: session.user.user_metadata
          };
          
          setUser(userData);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "Signed in",
              description: `Welcome${userData?.name ? `, ${userData.name}` : ''}!`,
            });
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
    };
  }, [supabase, toast, isInitialized]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    isInitialized,
  };
};
