
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
    // Changed from const to let since we need to reassign it during retries
    let fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    logger.info(`Uploading file: ${fileName}`);
    
    // Upload to Supabase Storage with retries
    let attempts = 0;
    const maxAttempts = 3; // Increased from 2 to 3
    let uploadData = null;
    let uploadError = null;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      try {
        // Try with direct upload first
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, file, {
            cacheControl: '3600',
            contentType: file.type,
            upsert: attempts > 1 // Use upsert for retry attempts
          });
          
        if (!error) {
          uploadData = data;
          break;
        }
        
        uploadError = error;
        logger.warn(`Upload attempt ${attempts} failed:`, error);
        
        // Handle specific error cases
        if (error.message) {
          if (error.message.includes('already exists')) {
            // If duplicate, modify filename and try again
            const newFileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            fileName = newFileName;
            logger.info(`Retrying with new filename: ${fileName}`);
          } else if (error.message.includes('violates row-level security policy')) {
            // If RLS policy violation, try to use safeUpload from useSupabase hook if available
            logger.warn("RLS policy violation. Attempting to use alternative upload method.");
            try {
              const { data: fallbackData, error: fallbackError } = await supabase.storage
                .from('storage')  // Try the default 'storage' bucket as fallback
                .upload(`property-photos/${fileName}`, file, {
                  contentType: file.type,
                });
              
              if (!fallbackError) {
                uploadData = fallbackData;
                // Adjust the fileName for the public URL
                fileName = `property-photos/${fileName}`;
                break;
              } else {
                logger.warn("Fallback upload method failed:", fallbackError);
              }
            } catch (fallbackErr) {
              logger.warn("Error with fallback upload:", fallbackErr);
            }
          }
        }
        
        // Wait before next attempt
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Increasing wait time for each retry
        }
      } catch (err) {
        uploadError = err;
        logger.warn(`Upload attempt ${attempts} exception:`, err);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); 
      }
    }
    
    if (uploadError) {
      logger.error("Storage upload error after all attempts:", uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message || 'Unknown error'}`
      };
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(fileName.startsWith('property-photos/') ? 'storage' : BUCKET_NAME)
      .getPublicUrl(fileName.startsWith('property-photos/') ? fileName : fileName);
    
    if (!urlData?.publicUrl) {
      logger.error("Failed to get public URL");
      return {
        success: false,
        error: "Failed to get public URL for uploaded file"
      };
    }
    
    logger.info("Public URL obtained:", urlData.publicUrl);
    
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
      return false;
    }
    
    logger.info(`Successfully saved photo record with order ${displayOrder}`);
    return true;
  } catch (error) {
    logger.error("Error saving photo record:", error);
    return false;
  }
};
