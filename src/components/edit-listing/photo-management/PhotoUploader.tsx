
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PhotoUploaderProps {
  onUploadPhotos: (files: File[]) => Promise<boolean>;
  isUploading: boolean;
}

export default function PhotoUploader({ onUploadPhotos, isUploading }: PhotoUploaderProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: File[]): Promise<boolean> => {
    try {
      console.log("PhotoUploader: Starting file upload for", files.length, "files");
      setUploadError(null);
      
      if (files.length === 0) {
        console.log("PhotoUploader: No files to upload");
        return false;
      }
      
      const success = await onUploadPhotos(files);
      console.log("PhotoUploader: Upload completed with success:", success);
      
      if (success) {
        setShowUploader(false);
        // Toast notification now handled in the parent component to avoid duplication
        return true;
      } else {
        setUploadError("Upload failed. This may be due to missing database tables.");
        return false;
      }
    } catch (error) {
      console.error("PhotoUploader: Error during file upload:", error);
      setUploadError("An error occurred during upload. Please try again later.");
      return false;
    }
  };

  if (!showUploader) {
    return (
      <button
        onClick={() => setShowUploader(true)}
        className="text-primary underline-offset-4 hover:underline text-sm"
      >
        + Add more photos
      </button>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">Upload New Photos</h3>
      
      {uploadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      
      <FileUploader
        accept="image/*"
        multiple
        maxFiles={10}
        maxSize={5 * 1024 * 1024} // 5MB
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Supported formats: JPG, PNG, WebP. Max size: 5MB per image.
      </p>
      <button
        onClick={() => {
          setShowUploader(false);
          setUploadError(null);
        }}
        className="mt-2 text-sm text-muted-foreground"
        disabled={isUploading}
      >
        Cancel
      </button>
    </Card>
  );
}
