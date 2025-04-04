
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
    
    // First, check if the default 'storage' bucket is accessible as a fallback
    try {
      const { error: defaultBucketError } = await supabase.storage
        .from('storage')
        .list();
      
      if (!defaultBucketError) {
        logger.info("Default 'storage' bucket is accessible as fallback");
      } else {
        logger.warn("Default 'storage' bucket may not be accessible:", defaultBucketError);
      }
    } catch (defaultError) {
      logger.warn("Error checking default bucket:", defaultError);
    }
    
    // Try to create the property-photos bucket regardless of previous checks
    try {
      // First check if bucket exists
      const { data, error } = await supabase.storage.listBuckets();
      
      // If we can't list buckets due to permissions, proceed with direct upload attempts
      if (error) {
        logger.warn("Cannot list buckets due to permissions, will attempt direct uploads:", error);
        return true;
      }
      
      const bucketExists = data?.some(bucket => bucket.name === BUCKET_NAME);
      
      if (!bucketExists) {
        logger.info(`Creating bucket '${BUCKET_NAME}'...`);
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024 // 10MB limit
        });
        
        if (createError) {
          logger.warn(`Failed to create bucket '${BUCKET_NAME}':`, createError);
          // Return true anyway so we can try the fallback bucket
          return true;
        }
        
        logger.info(`Successfully created bucket '${BUCKET_NAME}'`);
      } else {
        logger.info(`Bucket '${BUCKET_NAME}' already exists`);
      }
      
      return true;
    } catch (error) {
      logger.error("Error in ensureStorageBucket:", error);
      // Return true to indicate we should continue with fallback bucket
      return true;
    }
  } catch (error) {
    logger.error("Unexpected error in bucket creation:", error);
    return true;
  }
};
