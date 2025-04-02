
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";

interface PhotoUploaderProps {
  onUploadPhotos: (files: File[]) => Promise<boolean>;
  isUploading: boolean;
}

export default function PhotoUploader({ onUploadPhotos, isUploading }: PhotoUploaderProps) {
  const [showUploader, setShowUploader] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    const success = await onUploadPhotos(files);
    if (success) {
      setShowUploader(false);
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
        onClick={() => setShowUploader(false)}
        className="mt-2 text-sm text-muted-foreground"
      >
        Cancel
      </button>
    </Card>
  );
}
