
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";
import { STORAGE_BUCKETS, safeUploadFile } from "@/utils/storage/bucketUtils";
import { validatePhotoFile } from "./photoValidationUtils";

const logger = createLogger("photoUploadUtils");

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads a single photo file to storage
 * @param supabase Supabase client instance
 * @param file File to upload
 * @param propertyId ID of the property
 * @returns Upload result with URL if successful
 */
export const uploadPhotoFile = async (
  supabase: SupabaseClient, 
  file: File, 
  propertyId: string
): Promise<UploadResult> => {
  try {
    // Validate the file first
    const validationResult = validatePhotoFile(file);
    if (!validationResult.valid) {
      return {
        success: false,
        error: validationResult.error
      };
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    logger.info(`Uploading file: ${fileName}`);
    
    // Try upload with automatic fallback between buckets
    const { data, error, actualBucket, actualPath } = await safeUploadFile(
      supabase,
      STORAGE_BUCKETS.PROPERTY_PHOTOS,
      fileName,
      file,
      {
        cacheControl: '3600',
        contentType: file.type,
      }
    );
    
    if (error) {
      logger.error("Error uploading photo:", error);
      return {
        success: false,
        error: `Upload failed: ${error.message || String(error)}`
      };
    }
    
    if (!actualPath || !actualBucket) {
      logger.error("Upload completed but path or bucket is missing");
      return {
        success: false,
        error: "Failed to get storage location for uploaded file"
      };
    }
    
    // Get public URL from the actual bucket used
    const { data: urlData } = supabase.storage
      .from(actualBucket)
      .getPublicUrl(actualPath);
    
    if (!urlData?.publicUrl) {
      logger.error("Failed to get public URL");
      return {
        success: false,
        error: "Failed to get public URL for uploaded file"
      };
    }
    
    logger.info("Successfully uploaded photo with public URL:", urlData.publicUrl);
    
    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error) {
    logger.error("Error uploading photo file:", error);
    return {
      success: false,
      error: `Unexpected error: ${String(error)}`
    };
  }
};

/**
 * Saves photo metadata to the database
 * @param supabase Supabase client instance
 * @param propertyId ID of the property
 * @param url Public URL of the uploaded photo
 * @param displayOrder Display order of the photo
 * @param isPrimary Whether this is the primary photo
 * @returns Boolean indicating success or failure
 */
export const savePhotoRecord = async (
  supabase: SupabaseClient,
  propertyId: string,
  url: string,
  displayOrder: number,
  isPrimary: boolean
): Promise<boolean> => {
  try {
    // Add retry logic for database operations
    let retries = 3;
    let success = false;
    let lastError = null;
    
    while (retries > 0 && !success) {
      try {
        const { error: dbError } = await supabase
          .from('property_photos')
          .insert({
            property_id: propertyId,
            url: url,
            display_order: displayOrder,
            is_primary: isPrimary
          });
        
        if (dbError) {
          lastError = dbError;
          throw dbError;
        }
        
        success = true;
        logger.info(`Successfully saved photo record with order ${displayOrder}`);
      } catch (dbError) {
        retries--;
        if (retries > 0) {
          logger.warn(`Database error, retrying (${retries} attempts left):`, dbError);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          logger.error('All database save attempts failed:', dbError);
          
          if (dbError.message && dbError.message.includes('row-level security')) {
            logger.warn('RLS policy violation. This may indicate that the current user does not own the property.');
          }
          
          return false;
        }
      }
    }
    
    return success;
  } catch (error) {
    logger.error("Error saving photo record:", error);
    return false;
  }
};
