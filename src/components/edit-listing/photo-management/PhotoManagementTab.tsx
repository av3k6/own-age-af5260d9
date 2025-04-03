
import { usePhotoManagement } from "@/hooks/edit-listing/usePhotoManagement";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PhotoList from "./PhotoList";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PhotoManagementTab");

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

  const handleFileUpload = async (files: File[]): Promise<boolean> => {
    logger.info("Handling file upload for", files.length, "files");
    
    if (!propertyId) {
      logger.error("No propertyId provided");
      toast({
        title: "Error",
        description: "Property ID is missing. Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    if (files.length === 0) {
      logger.info("No files to upload");
      return false;
    }
    
    try {
      const success = await uploadPhotos(files);
      logger.info("Upload result:", success);
      return success;
    } catch (error) {
      logger.error("Error handling upload:", error);
      toast({
        title: "Upload Error",
        description: "Failed to process photos. Please try again.",
        variant: "destructive",
      });
      return false;
    }
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
      </div>

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
