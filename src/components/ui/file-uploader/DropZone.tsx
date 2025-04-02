
import React from "react";
import { Upload } from "lucide-react";

interface DropZoneProps {
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  openFileDialog: () => void;
  accept?: string;
}

export function DropZone({
  dragActive,
  handleDrag,
  handleDrop,
  openFileDialog,
  accept
}: DropZoneProps) {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag & drop files here, or{" "}
          <button
            type="button"
            onClick={openFileDialog}
            className="text-primary hover:underline focus:outline-none"
          >
            browse
          </button>
        </p>
        {accept && (
          <p className="text-xs text-muted-foreground">
            Accepted file types: {accept}
          </p>
        )}
      </div>
    </div>
  );
}
