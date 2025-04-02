
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, ImageIcon, Loader2 } from "lucide-react";

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  onUpload: (files: File[]) => Promise<boolean> | void;
  isUploading?: boolean;
  autoUpload?: boolean;
}

export function FileUploader({
  accept,
  multiple = false,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onUpload,
  isUploading = false,
  autoUpload = false,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (files: File[]) => {
    // Check number of files
    if (multiple && files.length > maxFiles) {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
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
      const selectedFiles = Array.from(e.target.files);
      if (validateFiles(selectedFiles)) {
        setSelectedFiles(selectedFiles);
        
        // Auto upload if enabled
        if (autoUpload) {
          handleUpload(selectedFiles);
        }
      }
    }
  };

  const handleUpload = async (files = selectedFiles) => {
    if (files.length === 0) {
      console.log("FileUploader: No files to upload");
      return;
    }
    
    console.log("FileUploader: Starting upload for", files.length, "files");
    try {
      // Ensure the upload function is properly awaited
      const result = await Promise.resolve(onUpload(files));
      console.log("FileUploader: Upload complete with result:", result);
      
      // Clear selected files on successful upload
      if (result === true) {
        setSelectedFiles([]);
        setError(null);
      }
    } catch (error) {
      console.error("FileUploader: Error during upload:", error);
      setError("Upload failed. Please try again.");
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        
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

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between bg-muted p-2 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm truncate max-w-[200px]">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          
          <Button
            type="button"
            onClick={() => handleUpload()}
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
      )}
    </div>
  );
}
