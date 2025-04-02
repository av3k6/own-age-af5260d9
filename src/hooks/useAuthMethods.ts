
import { useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { useAuthOperations } from './useAuthOperations';
import { useSessionManagement } from './useSessionManagement';

interface AuthMethodsProps {
  supabase: SupabaseClient;
  setLoading: (loading: boolean) => void;
}

export const useAuthMethods = ({ supabase, setLoading }: AuthMethodsProps) => {
  const { toast } = useToast();
  
  const { refreshSession, checkIsAuthenticated } = useSessionManagement({
    supabase
  });
  
  const { signIn, signUp, signOut } = useAuthOperations({
    supabase,
    setLoading
  });

  return {
    signIn,
    signUp,
    signOut,
    checkIsAuthenticated,
    refreshSession
  };
};
