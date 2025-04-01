
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isInitialized } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role requirements if specified
  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (user.role && !roles.includes(user.role)) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
