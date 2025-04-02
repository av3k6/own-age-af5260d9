
import React from "react";
import { X, FileIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileItemProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  isUploading: boolean;
}

export function FileItem({ file, index, onRemove, isUploading }: FileItemProps) {
  const isImage = file.type.startsWith("image/");

  return (
    <li className="flex items-center justify-between bg-muted p-2 rounded-md">
      <div className="flex items-center space-x-2">
        {isImage ? (
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <FileIcon className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-muted-foreground hover:text-destructive"
        disabled={isUploading}
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  );
}
