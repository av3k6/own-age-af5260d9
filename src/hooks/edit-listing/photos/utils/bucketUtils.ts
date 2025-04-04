
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";

const logger = createLogger("bucketUtils");
const BUCKET_NAME = "property-photos";

/**
 * Ensures that the storage bucket exists in Supabase
 * @param supabase Supabase client instance
 * @returns Boolean indicating success or failure
 */
export const ensureStorageBucket = async (supabase: SupabaseClient): Promise<boolean> => {
  try {
    logger.info("Checking if storage bucket exists:", BUCKET_NAME);
    
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      logger.error("Error checking buckets:", bucketsError);
      return false;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      logger.info(`Bucket ${BUCKET_NAME} not found, creating it...`);
      
      // Create the bucket with public access
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
      });
      
      if (createError) {
        logger.error("Failed to create bucket:", createError);
        return false;
      }
      
      logger.info(`Successfully created bucket: ${BUCKET_NAME}`);
    } else {
      logger.info(`Bucket ${BUCKET_NAME} already exists`);
    }
    
    return true;
  } catch (error) {
    logger.error("Error in ensureStorageBucket:", error);
    return false;
  }
};

export { BUCKET_NAME };
