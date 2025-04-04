
import React from 'react';
import { DocumentMetadata } from '@/types/document';
import { File, FileText, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SignatureActions from './signatures/SignatureActions';
import { formatFileSize, getFileIconColor } from '@/utils/fileUtils';

interface DocumentListProps {
  documents: DocumentMetadata[];
  isLoading: boolean;
  searchTerm?: string;
  onDownload: (document: DocumentMetadata) => void;
  onDelete: (document: DocumentMetadata) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading,
  searchTerm,
  onDownload,
  onDelete,
}) => {
  // Function to determine file type icon
  const getFileIcon = (document: DocumentMetadata) => {
    const colorClass = getFileIconColor(document.name);
    return <File className={`h-8 w-8 ${colorClass}`} />;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/30">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No documents found</h3>
        {searchTerm ? (
          <p className="text-muted-foreground mt-2">
            No documents match your search term "{searchTerm}". Try a different search.
          </p>
        ) : (
          <p className="text-muted-foreground mt-2">
            Upload some documents to get started.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div key={document.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
          <div className="flex items-center">
            {getFileIcon(document)}
            <div className="ml-4">
              <h4 className="font-medium">{document.name}</h4>
              <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                <span>{formatFileSize(document.size)}</span>
                <span>Uploaded: {formatDate(document.createdAt)}</span>
                {document.category && <span>Category: {document.category}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex mt-4 sm:mt-0 gap-2">
            <SignatureActions 
              document={document} 
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document)}
              title="Download"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(document)}
              className="text-destructive hover:text-destructive"
              title="Delete"
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
