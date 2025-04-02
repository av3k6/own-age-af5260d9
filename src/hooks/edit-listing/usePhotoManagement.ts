
import { useEffect } from "react";
import { useFetchPhotos } from "./photos/useFetchPhotos";
import { usePhotoUpload } from "./photos/usePhotoUpload";
import { usePhotoOrder } from "./photos/usePhotoOrder";
import { usePrimaryPhoto } from "./photos/usePrimaryPhoto";
import { useDeletePhoto } from "./photos/useDeletePhoto";
import { PropertyPhoto } from "./photos/types";

export const usePhotoManagement = (propertyId: string | undefined) => {
  // Combine all the hooks
  const { photos, setPhotos, isLoading, fetchPhotos } = useFetchPhotos(propertyId);
  const { isUploading, uploadPhotos } = usePhotoUpload(propertyId);
  const { updatePhotoOrder, movePhotoUp, movePhotoDown } = usePhotoOrder(propertyId);
  const { setPrimaryPhoto } = usePrimaryPhoto(propertyId);
  const { deletePhoto: deletePhotoBase } = useDeletePhoto(propertyId);
  
  // Custom deletePhoto function that combines all the needed hooks
  const deletePhoto = async (photoId: string) => {
    return deletePhotoBase(
      photoId, 
      photos, 
      updatePhotoOrder, 
      setPrimaryPhoto,
      fetchPhotos
    );
  };
  
  // Handle photo upload with current order context
  const handleUploadPhotos = async (files: File[]): Promise<boolean> => {
    const result = await uploadPhotos(files, photos.length);
    if (result.success) {
      await fetchPhotos();
      return true;
    }
    return false;
  };

  // Move photo up wrapper
  const handleMovePhotoUp = async (index: number) => {
    return movePhotoUp(photos, index, setPhotos);
  };

  // Move photo down wrapper
  const handleMovePhotoDown = async (index: number) => {
    return movePhotoDown(photos, index, setPhotos);
  };

  // Initialize
  useEffect(() => {
    if (propertyId) {
      fetchPhotos();
    }
  }, [propertyId]);

  return {
    photos,
    isLoading,
    isUploading,
    fetchPhotos,
    uploadPhotos: handleUploadPhotos,
    deletePhoto,
    movePhotoUp: handleMovePhotoUp,
    movePhotoDown: handleMovePhotoDown,
    setPrimaryPhoto
  };
};

export type { PropertyPhoto } from "./photos/types";
