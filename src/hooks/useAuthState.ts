
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { mapUserData } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';
import { useAuthInitializer } from './useAuthInitializer';

export const useAuthState = (supabase: SupabaseClient) => {
  const { user: initialUser, isInitialized } = useAuthInitializer(supabase);
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Update user state when initialUser changes
    setUser(initialUser);
  }, [initialUser]);

  useEffect(() => {
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
    };
  }, [supabase, toast]);

  return {
    user,
    setUser,
    loading,
    setLoading,
    isInitialized,
  };
};
