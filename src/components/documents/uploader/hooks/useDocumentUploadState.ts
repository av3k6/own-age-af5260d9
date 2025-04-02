
import { useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentUpload, UploadableDocument } from '@/hooks/documents/useDocumentUpload';

interface UseDocumentUploadStateProps {
  maxFiles: number;
  maxSizeMB: number;
  allowedFileTypes?: string[];
  folder: string;
  autoUpload: boolean;
  onUploadsComplete?: (documents: any[]) => void;
}

export const useDocumentUploadState = ({
  maxFiles,
  maxSizeMB,
  allowedFileTypes,
  folder,
  autoUpload,
  onUploadsComplete,
}: UseDocumentUploadStateProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    documents, 
    isUploading, 
    addDocuments, 
    removeDocument, 
    uploadDocuments,
    clearDocuments
  } = useDocumentUpload({
    maxSizeMB,
    allowedFileTypes,
    folder
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    if (documents.length + e.target.files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const added = addDocuments(e.target.files);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (added && autoUpload) {
      handleUpload();
    }
  };
  
  const handleFilesDrop = (files: FileList) => {
    if (documents.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const added = addDocuments(files);
    if (added && autoUpload) {
      handleUpload();
    }
  };
  
  const handleUpload = async () => {
    if (isUploading) return;
    
    const result = await uploadDocuments(user?.id);
    
    if (result.success) {
      if (onUploadsComplete) {
        onUploadsComplete(documents);
      }
    }
  };

  return {
    documents,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleFilesDrop,
    handleUpload,
    removeDocument,
    clearDocuments
  };
};
