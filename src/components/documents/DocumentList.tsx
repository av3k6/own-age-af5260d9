
import React from 'react';
import { Button } from "@/components/ui/button";
import { DocumentMetadata } from '@/types/document';
import { Eye, Download, Trash2, Clock, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentListProps {
  documents: DocumentMetadata[];
  isLoading: boolean;
  searchTerm: string;
  onDownload: (doc: DocumentMetadata) => void;
  onDelete: (doc: DocumentMetadata) => void;
}

const DocumentList = ({ 
  documents, 
  isLoading, 
  searchTerm,
  onDownload, 
  onDelete 
}: DocumentListProps) => {
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return "bg-red-100 text-red-600";
      case 'doc':
      case 'docx':
        return "bg-blue-100 text-blue-600";
      case 'xls':
      case 'xlsx':
        return "bg-green-100 text-green-600";
      case 'jpg':
      case 'jpeg':
      case 'png':
        return "bg-purple-100 text-purple-600";
      case 'txt':
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 border rounded-md">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-2 text-xl font-medium">No documents found</h3>
        <p className="mt-1 text-muted-foreground">
          {searchTerm
            ? "No documents match your search criteria"
            : "You haven't uploaded any documents yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
        >
          <div className={`flex items-center justify-center h-12 w-12 rounded ${getFileIcon(document.name)}`}>
            <span className="font-medium text-sm">{document.name.split('.').pop()?.toUpperCase()}</span>
          </div>
          
          <div className="ml-4 flex-1 min-w-0">
            <p className="font-medium truncate">{document.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>
                {new Date(document.createdAt).toLocaleDateString()}
              </span>
              <span className="mx-1">•</span>
              <span>{(document.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(document.url, '_blank')}
              title="View document"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDownload(document)}
              title="Download document"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(document)}
              className="text-destructive hover:text-destructive"
              title="Delete document"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
