
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentUpload, UploadableDocument } from '@/hooks/documents/useDocumentUpload';
import { Upload, X, FileText, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploaderProps {
  onUploadsComplete?: (documents: UploadableDocument[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  folder?: string;
  showUploadButton?: boolean;
  autoUpload?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'pdf':
      return <File className="h-10 w-10 text-red-500" />;
    case 'doc':
    case 'docx':
      return <File className="h-10 w-10 text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <File className="h-10 w-10 text-green-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <File className="h-10 w-10 text-purple-500" />;
    case 'txt':
      return <File className="h-10 w-10 text-gray-500" />;
    default:
      return <FileText className="h-10 w-10 text-muted-foreground" />;
  }
};

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
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
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
  
  const handleDragEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!e.dataTransfer.files?.length) return;
    
    if (documents.length + e.dataTransfer.files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const added = addDocuments(e.dataTransfer.files);
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <Skeleton className="h-5 w-5 rounded-full" />;
      default:
        return null;
    }
  };
  
  const allowedExtensions = allowedFileTypes 
    ? allowedFileTypes.map(type => {
        const parts = type.split('/');
        return parts[1] === '*' ? parts[0] : parts[1];
      }).join(', ')
    : 'PDF, DOC, DOCX, JPG, PNG';
  
  return (
    <div className="space-y-4">
      <div 
        ref={dropAreaRef}
        className={`border-2 ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'} rounded-lg p-6 transition-colors`}
        onDragEnter={handleDragEvent}
        onDragOver={handleDragEvent}
        onDragLeave={handleDragEvent}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center cursor-pointer">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">
            {isDragging ? 'Drop files here' : 'Drag and drop files here'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            or <span className="text-primary font-medium">click to browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports: {allowedExtensions} (Max: {maxSizeMB}MB)
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={handleFileChange}
          accept={allowedFileTypes ? allowedFileTypes.join(',') : undefined}
        />
      </div>
      
      {documents.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Documents ({documents.length}/{maxFiles})</h4>
            {documents.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => clearDocuments()}
                disabled={isUploading}
              >
                Clear all
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 border rounded-md group hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  {getFileIcon(doc.file.name)}
                  <div className="overflow-hidden">
                    <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{doc.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(doc.file.size)}</p>
                    
                    {doc.status === 'uploading' && (
                      <Progress value={doc.progress} className="h-1 w-full mt-1" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.status)}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(index);
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {showUploadButton && (
            <Button 
              onClick={handleUpload}
              disabled={isUploading || documents.length === 0 || documents.every(d => d.status === 'success')}
              className="w-full mt-2"
            >
              {isUploading ? 'Uploading...' : 'Upload Documents'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
