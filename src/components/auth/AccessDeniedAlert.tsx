
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from '@/components/ui/button';

interface AccessDeniedAlertProps {
  userRole?: string;
  requiredRoles: string[];
}

const AccessDeniedAlert = ({ userRole, requiredRoles }: AccessDeniedAlertProps) => {
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Restricted</AlertTitle>
        <AlertDescription>
          You don't have permission to access this page. This area requires 
          {requiredRoles.length > 1 ? ' one of these roles: ' : ' the role: '}
          <strong>{requiredRoles.join(', ')}</strong>.
        </AlertDescription>
      </Alert>
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedAlert;
