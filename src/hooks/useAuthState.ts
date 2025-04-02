
import { useState } from 'react';
import { User } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { SessionStatus } from '@/types/auth';
import { useAuthInitialization } from './auth/useAuthInitialization';
import { useAuthStateListener } from './auth/useAuthStateListener';

export const useAuthState = (supabase: SupabaseClient) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('active');

  // Use the initialization hook
  useAuthInitialization({
    supabase,
    setUser,
    setSessionStatus,
    setLoading,
    setIsInitialized
  });

  // Use the state listener hook
  useAuthStateListener({
    supabase,
    user,
    setUser,
    setSessionStatus,
    isInitialized,
    loading,
    setLoading,
    setIsInitialized
  });

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
