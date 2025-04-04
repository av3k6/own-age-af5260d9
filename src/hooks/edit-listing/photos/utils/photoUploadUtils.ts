
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";
import { BUCKET_NAME } from "./bucketUtils";
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
    // Use let instead of const since we need to reassign it during retries
    let fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    logger.info(`Uploading file: ${fileName}`);
    
    // Try with storage bucket first (this exists in all Supabase projects)
    try {
      logger.info("Attempting upload to default 'storage' bucket");
      const { data: storageData, error: storageError } = await supabase.storage
        .from('storage')
        .upload(`property-photos/${fileName}`, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true
        });
        
      if (!storageError) {
        logger.info("Upload to default 'storage' bucket successful");
        
        // Get public URL from storage bucket
        const { data: urlData } = supabase.storage
          .from('storage')
          .getPublicUrl(`property-photos/${fileName}`);
          
        if (!urlData?.publicUrl) {
          logger.error("Failed to get public URL from 'storage' bucket");
          return {
            success: false,
            error: "Failed to get public URL for uploaded file"
          };
        }
        
        logger.info("Public URL obtained from 'storage' bucket:", urlData.publicUrl);
        
        return {
          success: true,
          url: urlData.publicUrl
        };
      }
      
      logger.warn("Failed to upload to 'storage' bucket:", storageError);
    } catch (storageError) {
      logger.warn("Error uploading to 'storage' bucket:", storageError);
    }
    
    // If storage bucket failed, try the property-photos bucket
    try {
      logger.info(`Attempting upload to '${BUCKET_NAME}' bucket`);
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: true
        });
        
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
        
      if (!urlData?.publicUrl) {
        logger.error(`Failed to get public URL from '${BUCKET_NAME}' bucket`);
        return {
          success: false,
          error: "Failed to get public URL for uploaded file"
        };
      }
      
      logger.info(`Public URL obtained from '${BUCKET_NAME}' bucket:`, urlData.publicUrl);
      
      return {
        success: true,
        url: urlData.publicUrl
      };
    } catch (customBucketError) {
      logger.error(`Failed to upload to '${BUCKET_NAME}' bucket:`, customBucketError);
      return {
        success: false,
        error: `Upload failed: ${String(customBucketError)}`
      };
    }
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
    const { error: dbError } = await supabase
      .from('property_photos')
      .insert({
        property_id: propertyId,
        url: url,
        display_order: displayOrder,
        is_primary: isPrimary
      });
    
    if (dbError) {
      logger.error('Database error adding photo record:', dbError);
      
      if (dbError.message && dbError.message.includes('row-level security')) {
        logger.warn('RLS policy violation. This may indicate that the current user does not own the property.');
      }
      
      return false;
    }
    
    logger.info(`Successfully saved photo record with order ${displayOrder}`);
    return true;
  } catch (error) {
    logger.error("Error saving photo record:", error);
    return false;
  }
};
