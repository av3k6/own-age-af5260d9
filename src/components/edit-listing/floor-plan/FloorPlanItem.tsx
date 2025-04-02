
import React from "react";
import { Button } from "@/components/ui/button";
import { DocumentMetadata } from "@/types/document";
import { File, Download, X } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

interface FloorPlanItemProps {
  floorPlan: DocumentMetadata;
  onDelete: (floorPlan: DocumentMetadata) => void;
  onDownload: (floorPlan: DocumentMetadata) => void;
}

const FloorPlanItem = ({ floorPlan, onDelete, onDownload }: FloorPlanItemProps) => {
  // Get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'dwg':
      case 'dxf':
        return <File className="h-10 w-10 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="h-10 w-10 text-green-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-md group">
      <div className="flex items-center space-x-3">
        {getFileIcon(floorPlan.name)}
        <div>
          <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{floorPlan.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(floorPlan.size)}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onDownload(floorPlan)}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onDelete(floorPlan)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FloorPlanItem;
