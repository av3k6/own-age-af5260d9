
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FileItem } from "./FileItem";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onUpload: () => Promise<void>;
  isUploading: boolean;
}

export function FileList({ files, onRemove, onUpload, isUploading }: FileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium">Selected files:</p>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <FileItem
            key={`${file.name}-${index}`}
            file={file}
            index={index}
            onRemove={onRemove}
            isUploading={isUploading}
          />
        ))}
      </ul>
      
      <Button
        type="button"
        onClick={onUpload}
        disabled={isUploading}
        className="mt-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload Files"
        )}
      </Button>
    </div>
  );
}
