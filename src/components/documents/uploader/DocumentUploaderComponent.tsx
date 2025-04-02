
import React from 'react';
import { useDocumentUploadState } from './hooks/useDocumentUploadState';
import DocumentDropArea from '../upload/DocumentDropArea';
import DocumentList from '../upload/DocumentList';

interface DocumentUploaderProps {
  onUploadsComplete?: (documents: any[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  folder?: string;
  showUploadButton?: boolean;
  autoUpload?: boolean;
}

const DocumentUploaderComponent: React.FC<DocumentUploaderProps> = ({
  onUploadsComplete,
  maxFiles = 10,
  maxSizeMB = 10,
  allowedFileTypes,
  folder = 'documents',
  showUploadButton = true,
  autoUpload = false,
}) => {
  const {
    documents,
    isUploading,
    fileInputRef,
    handleFileChange,
    handleFilesDrop,
    handleUpload,
    removeDocument,
    clearDocuments,
  } = useDocumentUploadState({
    maxFiles,
    maxSizeMB,
    allowedFileTypes,
    folder,
    autoUpload,
    onUploadsComplete,
  });

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

export default DocumentUploaderComponent;
