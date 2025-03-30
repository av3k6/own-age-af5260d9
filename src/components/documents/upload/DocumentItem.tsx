
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { X, CheckCircle, AlertCircle, File } from 'lucide-react';
import { formatFileSize, getFileIcon } from '@/utils/fileUtils';
import { UploadableDocument } from '@/hooks/documents/useDocumentUpload';

interface DocumentItemProps {
  document: UploadableDocument;
  index: number;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  document,
  index,
  onRemove,
  isUploading
}) => {
  const getFileIconComponent = (iconType: string) => {
    switch(iconType) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'doc':
        return <File className="h-10 w-10 text-blue-500" />;
      case 'xls':
        return <File className="h-10 w-10 text-green-500" />;
      case 'image':
        return <File className="h-10 w-10 text-purple-500" />;
      case 'text':
        return <File className="h-10 w-10 text-gray-500" />;
      default:
        return <File className="h-10 w-10 text-muted-foreground" />;
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

  const iconType = getFileIcon(document.file.name);
  const fileIcon = getFileIconComponent(iconType);

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 border rounded-md group hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        {fileIcon}
        <div className="overflow-hidden">
          <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{document.file.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(document.file.size)}</p>
          
          {document.status === 'uploading' && (
            <Progress value={document.progress} className="h-1 w-full mt-1" />
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {getStatusIcon(document.status)}
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default DocumentItem;
