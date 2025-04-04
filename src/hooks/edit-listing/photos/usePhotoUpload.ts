
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploadResult } from "./types";
import { createLogger } from "@/utils/logger";
import { ensureStorageBucket } from "./utils/bucketUtils";
import { ensurePropertyPhotosTable } from "./utils/tableUtils";
import { uploadPhotoFile, savePhotoRecord } from "./utils/photoUploadUtils";

const logger = createLogger("usePhotoUpload");

export const usePhotoUpload = (propertyId: string | undefined) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
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
        toast({
          title: "Database Error",
          description: "Could not prepare the database for photo uploads. Your permissions may be limited.",
          variant: "destructive",
        });
        return { success: false, error: "Database table error" };
      }
      
      // Then ensure the storage bucket exists
      const bucketExists = await ensureStorageBucket(supabase);
      if (!bucketExists) {
        logger.error("Storage bucket could not be created or accessed");
        toast({
          title: "Storage Error",
          description: "Could not prepare the storage for photo uploads. Please try again later.",
          variant: "destructive",
        });
        return { success: false, error: "Storage bucket error" };
      }
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload the file to storage
        const uploadResult = await uploadPhotoFile(supabase, file, propertyId);
        
        if (!uploadResult.success) {
          toast({
            title: "Upload Error",
            description: uploadResult.error || `Failed to upload ${file.name}`,
            variant: "destructive",
          });
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
          toast({
            title: "Database Error",
            description: `Failed to save photo record for ${file.name}`,
            variant: "destructive",
          });
          continue;
        }
        
        // Mark file as uploaded for counting
        uploadedFiles.push(file);
        logger.info(`Successfully processed photo ${i+1} with order ${nextOrder}`);
      }
      
      // If we've uploaded at least one file, consider it a success
      if (uploadedFiles.length > 0) {
        uploadSuccess = true;
        
        toast({
          title: "Success",
          description: `${uploadedFiles.length} photo${uploadedFiles.length === 1 ? '' : 's'} uploaded successfully`,
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "None of the photos could be uploaded. Please try again.",
          variant: "destructive",
        });
      }
      
      return { 
        success: uploadSuccess,
        uploadedFiles,
        count: uploadedFiles.length
      };
    } catch (error) {
      logger.error('Error in photo upload process:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: String(error) };
    } finally {
      setIsUploading(false);
      logger.info("Upload process completed with success:", uploadSuccess);
    }
  };

  return { isUploading, uploadPhotos };
};
