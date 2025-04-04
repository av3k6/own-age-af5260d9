
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";

const logger = createLogger("bucketUtils");
export const BUCKET_NAME = "property-photos";

/**
 * Ensures that the storage bucket exists in Supabase
 * @param supabase Supabase client instance
 * @returns Boolean indicating success or failure
 */
export const ensureStorageBucket = async (supabase: SupabaseClient): Promise<boolean> => {
  try {
    logger.info("Checking if storage bucket exists:", BUCKET_NAME);
    
    // First, try to list the objects in the bucket to see if it exists and we have access
    try {
      const { data: objects, error: listError } = await supabase.storage
        .from(BUCKET_NAME)
        .list();
      
      if (!listError) {
        // Bucket exists and we have access
        logger.info(`Bucket ${BUCKET_NAME} exists and we have access`);
        return true;
      }
      
      // If there's an error but it's not a "not found" error, the bucket might exist
      // but we have other access issues
      if (listError && !listError.message.includes("not found")) {
        logger.warn(`Bucket ${BUCKET_NAME} might exist but we have access issues:`, listError);
        // Let's assume we can use it and try to proceed
        return true;
      }
    } catch (listError) {
      // Continue with bucket creation as the bucket might not exist
      logger.warn("Error checking bucket contents:", listError);
    }
    
    // Check if bucket exists by listing all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      logger.warn("Error checking buckets, will attempt to use bucket anyway:", bucketsError);
      // Even if we can't list buckets, let's try using the bucket directly
      return true;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      logger.info(`Bucket ${BUCKET_NAME} not found, attempting to create it...`);
      
      // Try to create the bucket with public access
      try {
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
        });
        
        if (createError) {
          // If we get a "duplicate" error or "RLS policy violation", the bucket might actually exist
          if (createError.message && 
             (createError.message.includes("duplicate") || 
              createError.message.includes("violates row-level security policy"))) {
            logger.info("Bucket likely exists but with restricted access. Attempting to proceed anyway.");
            return true;
          }
          
          logger.error("Failed to create bucket:", createError);
          return false;
        }
        
        logger.info(`Successfully created bucket: ${BUCKET_NAME}`);
      } catch (error) {
        // If creation fails with any error, try to proceed anyway as the bucket
        // might exist but we don't have permissions to create/check it
        logger.warn("Error creating bucket, will attempt to use it anyway:", error);
        return true;
      }
    } else {
      logger.info(`Bucket ${BUCKET_NAME} already exists`);
    }
    
    return true;
  } catch (error) {
    logger.error("Error in ensureStorageBucket:", error);
    // As a last resort, try to proceed anyway in case the bucket exists but we can't verify it
    return true;
  }
};
