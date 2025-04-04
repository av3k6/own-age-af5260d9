
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { PhotoUploadResult } from "./types";
import { createLogger } from "@/utils/logger";
import { ensureStorageBucket } from "./utils/bucketUtils";
import { ensurePropertyPhotosTable } from "./utils/tableUtils";
import { uploadPhotoFile, savePhotoRecord } from "./utils/photoUploadUtils";
import { photoToasts } from "./utils/toastUtils";

const logger = createLogger("usePhotoUpload");

export const usePhotoUpload = (propertyId: string | undefined) => {
  const { supabase } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhotos = async (files: File[], currentPhotosLength: number): Promise<PhotoUploadResult> => {
    if (!files.length || !propertyId) {
      logger.info("No files or propertyId provided");
      return { success: false };
    }
    
    setIsUploading(true);
    let uploadSuccess = false;
    const uploadedFiles: File[] = [];
    
    try {
      logger.info("Starting upload for", files.length, "files for property:", propertyId);
      
      // First ensure the property_photos table exists
      const tableExists = await ensurePropertyPhotosTable(supabase);
      if (!tableExists) {
        logger.error("property_photos table could not be created or accessed");
        photoToasts.databaseError();
        return { success: false, error: "Database table error" };
      }
      
      // Then ensure the storage bucket exists
      const bucketExists = await ensureStorageBucket(supabase);
      if (!bucketExists) {
        logger.error("Storage bucket could not be created or accessed");
        photoToasts.storageError();
        return { success: false, error: "Storage bucket error" };
      }
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload the file to storage
        const uploadResult = await uploadPhotoFile(supabase, file, propertyId);
        
        if (!uploadResult.success) {
          photoToasts.uploadError(file.name, uploadResult.error);
          continue;
        }
        
        // If upload was successful, save to database
        const nextOrder = currentPhotosLength + i;
        const isPrimary = currentPhotosLength === 0 && i === 0; // First photo is primary by default
        
        const saveSuccess = await savePhotoRecord(
          supabase,
          propertyId,
          uploadResult.url!,
          nextOrder,
          isPrimary
        );
        
        if (!saveSuccess) {
          photoToasts.saveError(file.name);
          continue;
        }
        
        // Mark file as uploaded for counting
        uploadedFiles.push(file);
        logger.info(`Successfully processed photo ${i+1} with order ${nextOrder}`);
      }
      
      // If we've uploaded at least one file, consider it a success
      if (uploadedFiles.length > 0) {
        uploadSuccess = true;
        photoToasts.uploadSuccess(uploadedFiles.length);
      } else {
        photoToasts.noneUploaded();
      }
      
      return { 
        success: uploadSuccess,
        uploadedFiles,
        count: uploadedFiles.length
      };
    } catch (error) {
      logger.error('Error in photo upload process:', error);
      photoToasts.unexpectedError(error);
      return { success: false, error: String(error) };
    } finally {
      setIsUploading(false);
      logger.info("Upload process completed with success:", uploadSuccess);
    }
  };

  return { isUploading, uploadPhotos };
};
