
import React from 'react';
import { Upload } from 'lucide-react';
import { useFileDragDrop } from '@/hooks/documents/useFileDragDrop';

interface DocumentDropAreaProps {
  onFilesDrop: (files: FileList) => void;
  maxFiles: number;
  maxSizeMB: number;
  allowedFileTypes?: string[];
  onAreaClick: () => void;
}

const DocumentDropArea = ({
  onFilesDrop,
  maxSizeMB,
  allowedFileTypes,
  onAreaClick
}: DocumentDropAreaProps) => {
  const { dropAreaRef, isDragging, handleDragEvent, handleDrop } = useFileDragDrop({
    onFilesDrop
  });
  
  const allowedExtensions = allowedFileTypes 
    ? allowedFileTypes.map(type => {
        const parts = type.split('/');
        return parts[1] === '*' ? parts[0] : parts[1];
      }).join(', ')
    : 'PDF, DOC, DOCX, JPG, PNG';
  
  return (
    <div 
      ref={dropAreaRef}
      className={`border-2 ${isDragging ? 'border-primary bg-primary/5' : 'border-dashed'} rounded-lg p-6 transition-colors`}
      onDragEnter={handleDragEvent}
      onDragOver={handleDragEvent}
      onDragLeave={handleDragEvent}
      onDrop={handleDrop}
      onClick={onAreaClick}
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
    </div>
  );
};

export default DocumentDropArea;
