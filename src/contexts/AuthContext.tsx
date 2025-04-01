
import React, { createContext, useContext } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase();
  
  const {
    user,
    setUser,
    loading,
    setLoading,
    isInitialized
  } = useAuthState(supabase);

  const {
    signIn,
    signUp,
    signOut,
    resetPassword,
    checkIsAuthenticated
  } = useAuthMethods({
    supabase,
    setLoading
  });

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
