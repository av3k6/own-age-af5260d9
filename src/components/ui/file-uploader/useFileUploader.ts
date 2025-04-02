
import { useState } from "react";

interface UseFileUploaderProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  autoUpload?: boolean;
  onUpload: (files: File[]) => Promise<boolean> | void;
}

export function useFileUploader({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  accept,
  autoUpload = false,
  onUpload
}: UseFileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = (files: File[]) => {
    // Check number of files
    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`);
      return false;
    }

    // Check file size
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds the maximum size of ${maxSize / (1024 * 1024)}MB.`);
        return false;
      }
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map(type => type.trim());
      for (const file of files) {
        const fileType = file.type;
        const fileExtension = `.${file.name.split(".").pop()}`;
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith(".")) {
            // Extension check
            return fileExtension.toLowerCase() === type.toLowerCase();
          } else if (type.includes("*")) {
            // Wildcard check (e.g., "image/*")
            return fileType.startsWith(type.split("*")[0]);
          } else {
            // Exact match
            return fileType === type;
          }
        });

        if (!isAccepted) {
          setError(`File "${file.name}" is not an accepted file type.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      // Additional check to handle potential maxFiles issue when adding to existing files
      if (selectedFiles.length + droppedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files in total.`);
        return;
      }
      
      if (validateFiles(droppedFiles)) {
        setSelectedFiles(droppedFiles);
        
        // Auto upload if enabled
        if (autoUpload) {
          handleUpload(droppedFiles);
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Additional check to handle potential maxFiles issue when adding to existing files
      if (selectedFiles.length + newFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files in total.`);
        return;
      }
      
      if (validateFiles(newFiles)) {
        setSelectedFiles(newFiles);
        
        // Auto upload if enabled
        if (autoUpload) {
          handleUpload(newFiles);
        }
      }
    }
  };

  const handleUpload = async (files = selectedFiles) => {
    if (files.length === 0) {
      console.log("useFileUploader: No files to upload");
      return;
    }
    
    setIsUploading(true);
    console.log("useFileUploader: Starting upload for", files.length, "files");
    
    try {
      // Ensure the upload function is properly awaited
      const result = await Promise.resolve(onUpload(files));
      console.log("useFileUploader: Upload complete with result:", result);
      
      // Clear selected files on successful upload
      if (result === true) {
        setSelectedFiles([]);
        setError(null);
      }
    } catch (error) {
      console.error("useFileUploader: Error during upload:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  return {
    dragActive,
    selectedFiles,
    error,
    isUploading,
    handleDrag,
    handleDrop,
    handleChange,
    handleUpload,
    removeFile,
    setSelectedFiles
  };
}
