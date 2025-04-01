
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string; // Custom fallback path
  outlet?: boolean; // Whether to render an Outlet instead of children
}

const ProtectedRoute = ({
  children,
  requiredRole,
  fallbackPath = "/login",
  outlet = false
}: ProtectedRouteProps) => {
  const { user, isInitialized, checkIsAuthenticated } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionCheckComplete, setSessionCheckComplete] = useState(false);
  
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
    
    if (isInitialized) {
      verifyAuthentication();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isInitialized, checkIsAuthenticated]);
  
  // Show loading state while checking authentication
  if (!isInitialized || isVerifying) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Verifying your account...</p>
      </div>
    );
  }
  
  // Check if user is authenticated
  const hasAuth = user !== null || isAuthenticated;
  
  if (!hasAuth && sessionCheckComplete) {
    console.log("ProtectedRoute: User not authenticated, redirecting to", fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
  
  // Check role requirements if specified and user is authenticated
  if (requiredRole && user) {
    // Support both single role and array of roles
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Check if the user has one of the required roles
    const hasRequiredRole = user.role && roles.includes(user.role as UserRole);
    
    if (!hasRequiredRole) {
      console.log("ProtectedRoute: User doesn't have required role:", {
        userRole: user.role,
        requiredRoles: roles
      });
      
      return (
        <div className="container py-10">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Restricted</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. This area requires 
              {roles.length > 1 ? ' one of these roles: ' : ' the role: '}
              <strong>{roles.join(', ')}</strong>.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      );
    }
  }
  
  // Render children if authenticated and authorized
  if (outlet) {
    return <Outlet />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
