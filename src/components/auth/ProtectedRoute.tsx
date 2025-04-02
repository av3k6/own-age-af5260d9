
import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import AuthVerificationLoader from './AuthVerificationLoader';
import AccessDeniedAlert from './AccessDeniedAlert';
import { useAuthVerification } from '@/hooks/auth/useAuthVerification';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string; // Custom fallback path
  outlet?: boolean; // Whether to render an Outlet instead of children
  adminRoute?: boolean; // New prop to identify admin routes
}

const ProtectedRoute = ({
  children,
  requiredRole,
  fallbackPath = "/login",
  outlet = false,
  adminRoute = false
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
  
  // Admin route check
  const checkAdminAuth = () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession = JSON.parse(adminSessionStr);
      const now = new Date();
      const expiresAt = new Date(adminSession.expiresAt);
      
      // Check if session has expired
      if (now > expiresAt) {
        localStorage.removeItem("admin_session");
        return false;
      }
      
      return adminSession.authenticated && adminSession.isAdmin;
    } catch (error) {
      return false;
    }
  };

  const isAdminAuthenticated = adminRoute ? checkAdminAuth() : false;
  
  // Show loading state while checking authentication (for non-admin routes)
  if (!adminRoute && (!sessionCheckComplete || isVerifying)) {
    return <AuthVerificationLoader isVerifying={isVerifying} />;
  }
  
  // Handle expired sessions for non-admin routes
  if (!adminRoute && sessionStatus === 'expired' && sessionCheckComplete) {
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
  
  // For admin routes, check admin authentication
  if (adminRoute) {
    if (!isAdminAuthenticated) {
      console.log("ProtectedRoute: Admin not authenticated, redirecting to admin login");
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    
    // Admin is authenticated, render children or outlet
    if (outlet) {
      return <Outlet />;
    }
    return <>{children}</>;
  }
  
  // For non-admin routes, check regular authentication
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
