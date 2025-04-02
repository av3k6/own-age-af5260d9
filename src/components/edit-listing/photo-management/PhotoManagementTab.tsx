
import { usePhotoManagement } from "@/hooks/edit-listing/usePhotoManagement";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import PhotoList from "./PhotoList";
import { useState } from "react";
import PhotoUploader from "./PhotoUploader";

interface PhotoManagementTabProps {
  propertyId: string | undefined;
}

export default function PhotoManagementTab({ propertyId }: PhotoManagementTabProps) {
  const {
    photos,
    isLoading,
    isUploading,
    uploadPhotos,
    deletePhoto,
    movePhotoUp,
    movePhotoDown,
    setPrimaryPhoto
  } = usePhotoManagement(propertyId);
  
  const [showUploader, setShowUploader] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    const success = await uploadPhotos(files);
    if (success) {
      setShowUploader(false);
    }
    return success;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Property Photos</h2>
          <p className="text-muted-foreground">
            Add, remove, or reorder photos of your property
          </p>
        </div>
        <Button onClick={() => setShowUploader(!showUploader)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Photos
        </Button>
      </div>

      {showUploader && (
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
        </Card>
      )}

      <PhotoList
        photos={photos}
        onSetPrimary={setPrimaryPhoto}
        onMoveUp={movePhotoUp}
        onMoveDown={movePhotoDown}
        onDelete={deletePhoto}
      />
    </div>
  );
}
