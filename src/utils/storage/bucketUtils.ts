import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";

const logger = createLogger("bucketUtils");

interface BucketCheckResult {
  exists: boolean;
  useFallback: boolean;
  error?: Error;
}

/**
 * Storage buckets available in the system
 */
export const STORAGE_BUCKETS = {
  DEFAULT: 'storage',
  PROPERTY_PHOTOS: 'property-photos',
};

/**
 * Verifies if a bucket exists and is accessible
 */
export const verifyBucketAccess = async (
  supabase: SupabaseClient, 
  bucketName: string
): Promise<BucketCheckResult> => {
  try {
    logger.info(`Verifying access to bucket: ${bucketName}`);
    
    // Try to list files in bucket (lightweight operation to check access)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });
    
    if (error) {
      // If permission error, the bucket might exist but we can't access it
      if (error.message?.includes('permission denied')) {
        logger.warn(`Permission denied on bucket: ${bucketName}, will use fallback`);
        return { exists: true, useFallback: true };
      }
      
      // Bucket does not exist
      if (error.message?.includes('does not exist')) {
        logger.warn(`Bucket does not exist: ${bucketName}`);
        return { exists: false, useFallback: true };
      }

      // Other unknown error
      logger.error(`Error verifying bucket ${bucketName}:`, error);
      return { exists: false, useFallback: true, error: new Error(error.message) };
    }
    
    // Bucket exists and is accessible
    logger.info(`Successfully verified access to bucket: ${bucketName}`);
    return { exists: true, useFallback: false };
  } catch (error) {
    logger.error(`Unexpected error verifying bucket ${bucketName}:`, error);
    return { 
      exists: false, 
      useFallback: true, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
};

/**
 * Safely uploads a file to storage with fallback mechanism
 * @returns Object with upload result and path where file was stored
 */
export const safeUploadFile = async (
  supabase: SupabaseClient,
  primaryBucket: string,
  filePath: string,
  file: File,
  options?: any
): Promise<{ data: any; error: any; actualBucket: string; actualPath: string }> => {
  const defaultOptions = {
    cacheControl: '3600',
    upsert: true,
    ...options
  };
  
  try {
    // First try primary bucket
    logger.info(`Attempting upload to primary bucket '${primaryBucket}' at path: ${filePath}`);
    
    const { data, error } = await supabase.storage
      .from(primaryBucket)
      .upload(filePath, file, defaultOptions);
      
    // If upload succeeded
    if (!error) {
      logger.info(`Successfully uploaded to '${primaryBucket}' at: ${filePath}`);
      return { 
        data, 
        error: null,
        actualBucket: primaryBucket,
        actualPath: filePath 
      };
    }
    
    // If failed, log error and try fallback bucket
    logger.warn(`Failed to upload to '${primaryBucket}', error: ${error.message}. Trying fallback bucket.`);
    
    // Try with the default bucket
    const fallbackPath = `${primaryBucket}/${filePath}`;
    logger.info(`Attempting upload to fallback bucket '${STORAGE_BUCKETS.DEFAULT}' at path: ${fallbackPath}`);
    
    const fallbackResult = await supabase.storage
      .from(STORAGE_BUCKETS.DEFAULT)
      .upload(fallbackPath, file, defaultOptions);
      
    if (fallbackResult.error) {
      logger.error(`Failed upload to fallback bucket:`, fallbackResult.error);
    } else {
      logger.info(`Successfully uploaded to fallback bucket at: ${fallbackPath}`);
    }
    
    return { 
      ...fallbackResult,
      actualBucket: fallbackResult.error ? '' : STORAGE_BUCKETS.DEFAULT,
      actualPath: fallbackResult.error ? '' : fallbackPath
    };
  } catch (error) {
    logger.error(`Unexpected error in safeUploadFile:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)),
      actualBucket: '',
      actualPath: ''
    };
  }
};

/**
 * Gets a public URL for a file with fallback mechanism
 */
export const getPublicFileUrl = (
  supabase: SupabaseClient,
  bucket: string,
  filePath: string
): { publicUrl: string } => {
  try {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return { publicUrl: data.publicUrl };
  } catch (error) {
    logger.error(`Error getting public URL for ${bucket}/${filePath}:`, error);
    return { publicUrl: '' };
  }
};
