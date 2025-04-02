
import React, { useRef } from "react";
import { FileUploaderProps } from "./types";
import { useFileUploader } from "./useFileUploader";
import { DropZone } from "./DropZone";
import { FileList } from "./FileList";

export function FileUploader({
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  isUploading = false,
  autoUpload = false,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    dragActive,
    selectedFiles,
    error,
    handleDrag,
    handleDrop,
    handleChange,
    handleUpload,
    removeFile,
  } = useFileUploader({
    maxFiles,
    maxSize,
    accept,
    autoUpload,
    onUpload
  });

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <DropZone
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        openFileDialog={openFileDialog}
        accept={accept}
      />
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      <FileList
        files={selectedFiles}
        onRemove={removeFile}
        onUpload={async () => await handleUpload()}
        isUploading={isUploading}
      />
    </div>
  );
}
