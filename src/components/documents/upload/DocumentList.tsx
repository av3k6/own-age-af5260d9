
import React from 'react';
import { Button } from "@/components/ui/button";
import DocumentItem from './DocumentItem';
import { UploadableDocument } from '@/hooks/documents/useDocumentUpload';

interface DocumentListProps {
  documents: UploadableDocument[];
  maxFiles: number;
  isUploading: boolean;
  onRemove: (index: number) => void;
  onClear: () => void;
  onUpload: () => void;
  showUploadButton: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  maxFiles,
  isUploading,
  onRemove,
  onClear,
  onUpload,
  showUploadButton
}) => {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Documents ({documents.length}/{maxFiles})</h4>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClear}
          disabled={isUploading}
        >
          Clear all
        </Button>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {documents.map((doc, index) => (
          <DocumentItem
            key={index}
            document={doc}
            index={index}
            onRemove={onRemove}
            isUploading={isUploading}
          />
        ))}
      </div>
      
      {showUploadButton && (
        <Button 
          onClick={onUpload}
          disabled={isUploading || documents.length === 0 || documents.every(d => d.status === 'success')}
          className="w-full mt-2"
        >
          {isUploading ? 'Uploading...' : 'Upload Documents'}
        </Button>
      )}
    </div>
  );
};

export default DocumentList;
