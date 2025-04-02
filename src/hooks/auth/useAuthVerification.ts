
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SessionStatus } from '@/types/auth';
import { UserRole } from '@/types';

interface UseAuthVerificationProps {
  requiredRole?: string | string[];
}

export const useAuthVerification = ({ requiredRole }: UseAuthVerificationProps) => {
  const { user, isInitialized, checkIsAuthenticated, sessionStatus, refreshSession } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionCheckComplete, setSessionCheckComplete] = useState(false);
  
  // Check if user has required role
  const checkUserRole = (): boolean => {
    if (!requiredRole || !user) return true;
    
    // Support both single role and array of roles
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Check if the user has one of the required roles
    return user.role ? roles.includes(user.role as UserRole) : false;
  };
  
  // Attempt to refresh session if it's expired
  useEffect(() => {
    if (sessionStatus === 'expired' && refreshSession) {
      const attemptRefresh = async () => {
        console.log("Attempting to refresh expired session");
        const refreshed = await refreshSession();
        if (!refreshed) {
          console.log("Session refresh failed, user will be redirected to login");
        }
      };
      
      attemptRefresh();
    }
  }, [sessionStatus, refreshSession]);
  
  // Double check authentication status on mount to prevent race conditions
  useEffect(() => {
    let isMounted = true;
    
    const verifyAuthentication = async () => {
      try {
        console.log("ProtectedRoute: Verifying authentication status");
        const authenticated = await checkIsAuthenticated();
        
        if (isMounted) {
          console.log("ProtectedRoute: Auth check result:", authenticated);
          setIsAuthenticated(authenticated);
        }
      } catch (error) {
        console.error("ProtectedRoute: Error verifying authentication", error);
        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
          setSessionCheckComplete(true);
        }
      }
    };
    
    // Only run verification if auth system is initialized
    if (isInitialized) {
      verifyAuthentication();
    } else {
      // Force set verification complete after short timeout if still initializing
      // This prevents long loading if auth system is having issues
      const timeout = setTimeout(() => {
        if (isMounted) {
          console.log("ProtectedRoute: Auth not initialized in time, proceeding with verification");
          verifyAuthentication();
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
    
    return () => {
      isMounted = false;
    };
  }, [isInitialized, checkIsAuthenticated]);

  const hasRequiredRole = checkUserRole();
  
  return {
    user,
    isVerifying,
    sessionStatus,
    isAuthenticated,
    sessionCheckComplete,
    hasRequiredRole,
    requiredRoles: Array.isArray(requiredRole) ? requiredRole : requiredRole ? [requiredRole] : []
  };
};
