
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { useSupabase } from '@/hooks/useSupabase';
import { mapUserData } from '@/utils/authUtils';
import { useAuthActions, AuthActionsReturn } from '@/hooks/useAuthActions';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType extends AuthActionsReturn {
  user: User | null;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const authActions = useAuthActions(setUser);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log("Getting session...");
        
        try {
          console.log("Attempting to fetch auth session");
          
          // Get the current session immediately
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            setUser(null);
          } else if (data.session?.user) {
            console.log("Session found for user:", data.session.user.email);
            try {
              const mappedUser = await mapUserData(supabase, data.session.user);
              console.log("User data mapped successfully:", mappedUser);
              setUser(mappedUser);
              
              // Navigate to dashboard if on login page
              const path = window.location.pathname;
              if (path === '/login' || path === '/signup') {
                navigate('/dashboard', { replace: true });
              }
            } catch (mapErr) {
              console.error("Error mapping user data:", mapErr);
              setUser(null);
            }
          } else {
            console.log('No active session found');
            setUser(null);
          }
        } catch (err) {
          console.error("Error getting session:", err);
          setUser(null);
        } finally {
          // Always set these states regardless of success/failure
          setLoading(false);
          setIsInitialized(true);
          console.log("Auth initialization complete, loading:", false);
        }
      } catch (error) {
        console.error('Error in overall getSession process:', error);
        setUser(null);
        setLoading(false);
        setIsInitialized(true);
      }
    };

    // Start session fetch immediately
    getSession();
    
    // Set a backup timeout to ensure isInitialized is set
    const backupTimer = setTimeout(() => {
      if (!isInitialized) {
        console.warn("Forcing auth initialization after timeout");
        setIsInitialized(true);
        setLoading(false);
      }
    }, 1500); // Reduced for faster loading experience

    // Listen for auth changes
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (session?.user) {
            try {
              const mappedUser = await mapUserData(supabase, session.user);
              setUser(mappedUser);
              console.log("User mapped and set after auth change:", mappedUser?.email);
              
              if (event === 'SIGNED_IN') {
                toast({
                  title: "Signed in",
                  description: `Welcome${mappedUser?.name ? `, ${mappedUser.name}` : ''}!`,
                });
                
                // Navigate to dashboard if on login page
                const path = window.location.pathname;
                if (path === '/login' || path === '/signup') {
                  navigate('/dashboard', { replace: true });
                }
              }
            } catch (err) {
              console.error("Error mapping user on auth change:", err);
              setUser(null);
            }
          } else {
            console.log("No user in auth state change session");
            setUser(null);
            
            if (event === 'SIGNED_OUT') {
              toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
              });
            }
          }
          
          // Always ensure these states are updated
          setLoading(false);
          setIsInitialized(true);
        }
      );
      
      subscription = data.subscription;
    } catch (err) {
      console.error("Error setting up auth state change listener:", err);
      setIsInitialized(true);
      setLoading(false);
    }

    return () => {
      clearTimeout(backupTimer);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase, toast, navigate]);

  const value = {
    user,
    loading,
    isInitialized,
    ...authActions,
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
