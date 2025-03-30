import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userData && !error) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name || '',
              role: userData.role as UserRole,
              phone: userData.phone || '',
              profileImage: userData.profile_image,
              bio: userData.bio,
              createdAt: new Date(userData.created_at),
            });
          } else {
            // Fallback to basic user info if profile not found
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              role: UserRole.BUYER, // Default role
              createdAt: new Date(),
            });
          }
        } else {
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
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (userData && !error) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name || '',
              role: userData.role as UserRole,
              phone: userData.phone || '',
              profileImage: userData.profile_image,
              bio: userData.bio,
              createdAt: new Date(userData.created_at),
            });
          } else {
            // Fallback to basic user info
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || '',
              role: UserRole.BUYER, // Default role
              createdAt: new Date(),
            });
          }
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || UserRole.BUYER,
          },
        },
      });

      if (signUpError) return { error: signUpError };

      // Create user profile in the users table
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: (await supabase.auth.getUser()).data.user?.id,
          email,
          name: userData.name,
          role: userData.role || UserRole.BUYER,
          phone: userData.phone || '',
          created_at: new Date(),
        },
      ]);

      return { error: profileError };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
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

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
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
