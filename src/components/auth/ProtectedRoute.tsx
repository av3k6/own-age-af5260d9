
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import AuthVerificationLoader from './AuthVerificationLoader';
import AccessDeniedAlert from './AccessDeniedAlert';
import { useAuthVerification } from '@/hooks/auth/useAuthVerification';

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
  const location = useLocation();
  const {
    user,
    isVerifying,
    sessionStatus,
    isAuthenticated,
    sessionCheckComplete,
    hasRequiredRole,
    requiredRoles
  } = useAuthVerification({ requiredRole });
  
  // Show loading state while checking authentication
  if (!sessionCheckComplete || isVerifying) {
    return <AuthVerificationLoader isVerifying={isVerifying} />;
  }
  
  // Handle expired sessions
  if (sessionStatus === 'expired' && sessionCheckComplete) {
    console.log("ProtectedRoute: Session expired, redirecting to login");
    return <Navigate 
      to={fallbackPath} 
      state={{ 
        from: location,
        sessionExpired: true,
        message: "Your session has expired. Please sign in again."  
      }} 
      replace 
    />;
  }
  
  // Check if user is authenticated
  const hasAuth = user !== null || isAuthenticated;
  
  if (!hasAuth && sessionCheckComplete) {
    console.log("ProtectedRoute: User not authenticated, redirecting to", fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }
  
  // Check role requirements if specified and user is authenticated
  if (requiredRole && user && !hasRequiredRole) {
    console.log("ProtectedRoute: User doesn't have required role:", {
      userRole: user.role,
      requiredRoles
    });
    
    return <AccessDeniedAlert userRole={user.role} requiredRoles={requiredRoles} />;
  }
  
  // Render children if authenticated and authorized
  if (outlet) {
    return <Outlet />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
