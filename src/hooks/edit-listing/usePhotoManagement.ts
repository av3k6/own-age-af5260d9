
import { useEffect } from "react";
import { useFetchPhotos } from "./photos/useFetchPhotos";
import { usePhotoUpload } from "./photos/usePhotoUpload";
import { usePhotoOrder } from "./photos/usePhotoOrder";
import { usePrimaryPhoto } from "./photos/usePrimaryPhoto";
import { useDeletePhoto } from "./photos/useDeletePhoto";
import { PropertyPhoto } from "./photos/types";
import { usePhotoSync } from "./photos/usePhotoSync";
import { createLogger } from "@/utils/logger";

const logger = createLogger("usePhotoManagement");

export const usePhotoManagement = (propertyId: string | undefined) => {
  // Combine all the hooks
  const { photos, setPhotos, isLoading, fetchPhotos } = useFetchPhotos(propertyId);
  const { isUploading, uploadPhotos } = usePhotoUpload(propertyId);
  const { updatePhotoOrder, movePhotoUp, movePhotoDown } = usePhotoOrder(propertyId);
  const { setPrimaryPhoto } = usePrimaryPhoto(propertyId);
  const { deletePhoto: deletePhotoBase } = useDeletePhoto(propertyId);
  const { syncPhotosWithListing } = usePhotoSync();
  
  // Custom deletePhoto function that combines all the needed hooks
  const deletePhoto = async (photoId: string) => {
    const result = await deletePhotoBase(
      photoId, 
      photos, 
      updatePhotoOrder, 
      setPrimaryPhoto,
      fetchPhotos
    );
    
    // After deletion, synchronize with property_listings
    if (result && propertyId) {
      logger.info("Photo deleted, syncing with property_listings");
      await syncPhotosWithListing(propertyId);
    }
    
    return result;
  };
  
  // Handle photo upload with current order context
  const handleUploadPhotos = async (files: File[]): Promise<boolean> => {
    const result = await uploadPhotos(files, photos.length);
    if (result.success) {
      await fetchPhotos();
      
      // After upload, synchronize with property_listings
      if (propertyId) {
        logger.info("Photos uploaded, syncing with property_listings");
        await syncPhotosWithListing(propertyId);
      }
      
      return true;
    }
    return false;
  };

  // Move photo up wrapper
  const handleMovePhotoUp = async (index: number) => {
    const result = await movePhotoUp(photos, index, setPhotos);
    
    // After reordering, synchronize with property_listings
    if (propertyId) {
      logger.info("Photos reordered, syncing with property_listings");
      await syncPhotosWithListing(propertyId);
    }
    
    return result;
  };

  // Move photo down wrapper
  const handleMovePhotoDown = async (index: number) => {
    const result = await movePhotoDown(photos, index, setPhotos);
    
    // After reordering, synchronize with property_listings
    if (propertyId) {
      logger.info("Photos reordered, syncing with property_listings");
      await syncPhotosWithListing(propertyId);
    }
    
    return result;
  };
  
  // Support drag and drop reordering
  const reorderPhotos = async (startIndex: number, endIndex: number) => {
    const reorderedPhotos = Array.from(photos);
    const [removed] = reorderedPhotos.splice(startIndex, 1);
    reorderedPhotos.splice(endIndex, 0, removed);
    
    // Update display_order values
    const updatedPhotos = reorderedPhotos.map((photo, index) => ({
      ...photo,
      display_order: index
    }));
    
    // Update UI immediately
    setPhotos(updatedPhotos);
    
    // Save to database
    await updatePhotoOrder(updatedPhotos);
    
    // After reordering, synchronize with property_listings
    if (propertyId) {
      logger.info("Photos reordered via drag-drop, syncing with property_listings");
      await syncPhotosWithListing(propertyId);
    }
    
    return true;
  };

  // Handle setting primary photo with synchronization
  const handleSetPrimaryPhoto = async (photoId: string) => {
    const result = await setPrimaryPhoto(photoId);
    
    // After setting primary photo, synchronize with property_listings
    if (result && propertyId) {
      logger.info("Primary photo updated, syncing with property_listings");
      await syncPhotosWithListing(propertyId);
    }
    
    return result;
  };

  // Initialize
  useEffect(() => {
    if (propertyId) {
      fetchPhotos();
    }
  }, [propertyId]);

  // Perform initial sync when photos are first loaded
  useEffect(() => {
    if (propertyId && photos.length > 0) {
      logger.info("Initial photo sync for property:", propertyId);
      syncPhotosWithListing(propertyId);
    }
  }, [propertyId, photos.length === 0]); // Only run on initial load when photos change from 0

  return {
    photos,
    isLoading,
    isUploading,
    fetchPhotos,
    uploadPhotos: handleUploadPhotos,
    deletePhoto,
    movePhotoUp: handleMovePhotoUp,
    movePhotoDown: handleMovePhotoDown,
    setPrimaryPhoto: handleSetPrimaryPhoto,
    reorderPhotos,
    syncPhotosWithListing
  };
};

export type { PropertyPhoto } from "./photos/types";
