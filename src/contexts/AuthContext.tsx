
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
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
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Helper function to map Supabase user data to our User type
  const mapUserData = async (sessionUser: any) => {
    if (!sessionUser) return null;
    
    try {
      // Try to get user profile from users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single();
        
      if (userData && !error) {
        console.log('User profile found in database:', userData);
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name || '',
          role: userData.role as UserRole,
          phone: userData.phone || '',
          profileImage: userData.profile_image,
          bio: userData.bio,
          createdAt: new Date(userData.created_at),
        };
      } else {
        console.log('User profile not found in database, using auth metadata');
        // Fallback to basic user info if profile not found
        return {
          id: sessionUser.id,
          email: sessionUser.email || '',
          name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || '',
          role: (sessionUser.user_metadata?.role as UserRole) || UserRole.BUYER,
          createdAt: new Date(),
        };
      }
    } catch (error) {
      console.error('Error mapping user data:', error);
      // Minimal fallback
      return {
        id: sessionUser.id,
        email: sessionUser.email || '',
        name: '',
        role: UserRole.BUYER,
        createdAt: new Date(),
      };
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const mappedUser = await mapUserData(session.user);
          setUser(mappedUser);
          console.log('Session found and user set:', mappedUser?.email);
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const mappedUser = await mapUserData(session.user);
          setUser(mappedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      } else if (data.user) {
        console.log('Sign in successful:', data.user.email);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            role: userData.role || UserRole.BUYER,
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
            role: userData.role || UserRole.BUYER,
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
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const checkIsAuthenticated = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session?.user;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  };

  const value = {
    user,
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
