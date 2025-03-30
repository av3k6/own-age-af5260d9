
import React, { useRef } from 'react';
import { useDocumentUpload } from '@/hooks/documents/useDocumentUpload';
import { useAuth } from '@/contexts/AuthContext';
import DocumentDropArea from './upload/DocumentDropArea';
import DocumentList from './upload/DocumentList';

interface DocumentUploaderProps {
  onUploadsComplete?: (documents: any[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  folder?: string;
  showUploadButton?: boolean;
  autoUpload?: boolean;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUploadsComplete,
  maxFiles = 10,
  maxSizeMB = 10,
  allowedFileTypes,
  folder = 'documents',
  showUploadButton = true,
  autoUpload = false,
}) => {
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
  
  return (
    <div className="space-y-4">
      <DocumentDropArea
        onFilesDrop={handleFilesDrop}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        allowedFileTypes={allowedFileTypes}
        onAreaClick={() => fileInputRef.current?.click()}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        accept={allowedFileTypes ? allowedFileTypes.join(',') : undefined}
      />
      
      <DocumentList
        documents={documents}
        maxFiles={maxFiles}
        isUploading={isUploading}
        onRemove={removeDocument}
        onClear={clearDocuments}
        onUpload={handleUpload}
        showUploadButton={showUploadButton}
      />
    </div>
  );
};

export default DocumentUploader;
