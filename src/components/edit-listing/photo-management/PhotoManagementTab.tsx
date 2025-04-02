
import { usePhotoManagement } from "@/hooks/edit-listing/usePhotoManagement";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import PhotoList from "./PhotoList";
import { useState } from "react";
import PhotoUploader from "./PhotoUploader";
import { toast } from "@/hooks/use-toast";

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

  const handleFileUpload = async (files: File[]): Promise<boolean> => {
    console.log("PhotoManagementTab: Handling file upload for", files.length, "files");
    
    if (!propertyId) {
      console.error("PhotoManagementTab: No propertyId provided");
      toast({
        title: "Error",
        description: "Property ID is missing. Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    if (files.length === 0) {
      console.log("PhotoManagementTab: No files to upload");
      return false;
    }
    
    try {
      const success = await uploadPhotos(files);
      console.log("PhotoManagementTab: Upload result:", success);
      
      if (success) {
        setShowUploader(false);
      }
      
      return success;
    } catch (error) {
      console.error("PhotoManagementTab: Error handling upload:", error);
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
        <Button onClick={() => setShowUploader(!showUploader)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Photos
        </Button>
      </div>

      {showUploader && (
        <PhotoUploader
          onUploadPhotos={handleFileUpload}
          isUploading={isUploading}
        />
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
