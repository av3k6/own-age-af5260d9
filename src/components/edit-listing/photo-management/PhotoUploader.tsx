
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// This component is now deprecated as the functionality has been integrated directly
// into the PhotoManagementTab. This file is kept for backward compatibility.
interface PhotoUploaderProps {
  onUploadPhotos: (files: File[]) => Promise<boolean>;
  isUploading: boolean;
}

export default function PhotoUploader({ onUploadPhotos, isUploading }: PhotoUploaderProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: File[]): Promise<boolean> => {
    try {
      setUploadError(null);
      
      if (files.length === 0) {
        return false;
      }
      
      const success = await onUploadPhotos(files);
      
      return success;
    } catch (error) {
      setUploadError("An error occurred during upload. Please try again later.");
      return false;
    }
  };

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
    </Card>
  );
}
