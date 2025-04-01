
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';
import { mapUserData } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isInitialized: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  checkIsAuthenticated: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return { error };
      } 
      
      // We don't need to manually set the user here
      // The auth state listener will handle it
      return { error: null };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const signUp = useCallback(async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role,
            phone: userData.phone || '',
          },
        },
      });

      if (signUpError) return { error: signUpError };

      // Only try to create profile if sign up was successful
      if (data?.user) {
        // Create user profile in the users table
        const { error: profileError } = await supabase.from('users').insert([
          {
            id: data.user.id,
            email,
            name: userData.name,
            role: userData.role,
            phone: userData.phone || '',
            created_at: new Date(),
          },
        ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      // Don't manually set user to null here
      // The auth state listener will handle it
      console.log('Sign out request sent');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  }, [supabase]);

  const checkIsAuthenticated = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
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
    };

    // Initialize auth state
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (!isMounted) return;
        
        if (session?.user) {
          try {
            const mappedUser = await mapUserData(supabase, session.user);
            if (isMounted) {
              setUser(mappedUser);
              
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Signed in",
                  description: `Welcome${mappedUser?.name ? `, ${mappedUser.name}` : ''}!`,
                });
              }
            }
          } catch (err) {
            console.error("Error mapping user on auth change:", err);
            if (isMounted) setUser(null);
          }
        } else {
          if (isMounted) {
            setUser(null);
            
            if (event === 'SIGNED_OUT') {
              toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
              });
            }
          }
        }
      }
    );

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, toast]);

  // Provide auth context values
  const value = {
    user,
    isInitialized,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkIsAuthenticated,
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
