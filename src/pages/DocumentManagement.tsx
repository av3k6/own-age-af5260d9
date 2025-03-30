
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DocumentManager from '@/components/documents/DocumentManager';

const DocumentManagement = () => {
  const { user, loading } = useAuth();
  
  // If not logged in, redirect to login page
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Management</h1>
      <DocumentManager />
    </div>
  );
};

export default DocumentManagement;
