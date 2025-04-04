
import { SupabaseClient } from '@supabase/supabase-js';
import { STORAGE_BUCKETS } from '@/utils/storage/bucketUtils';

/**
 * Verify if a storage bucket exists and is accessible
 */
export const verifyBucketAccess = async (supabase: SupabaseClient, bucketName: string) => {
  try {
    // Try to get bucket metadata
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      console.error(`Error accessing bucket ${bucketName}:`, error);
      return { exists: false, error };
    }
    
    return { exists: true, error: null };
  } catch (err) {
    console.error(`Unexpected error verifying bucket ${bucketName}:`, err);
    return { exists: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
};

/**
 * Enhanced file upload with bucket fallback
 */
export const safeUploadFile = async (
  supabase: SupabaseClient,
  bucketName: string,
  path: string,
  fileBody: File,
  options?: any
) => {
  try {
    // First attempt upload with the specified bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, fileBody, options);
    
    // If upload succeeded, return data
    if (!error) {
      return { 
        data, 
        error: null, 
        actualBucket: bucketName,
        actualPath: path
      };
    }
    
    console.warn(`Upload to ${bucketName}/${path} failed:`, error);
    
    // If bucket doesn't exist and it's not the default, try with default bucket
    if (bucketName !== STORAGE_BUCKETS.DEFAULT) {
      console.info(`Falling back to default bucket: ${STORAGE_BUCKETS.DEFAULT}`);
      
      // Adjust path to include original bucket name for organization
      const fallbackPath = path.includes('/') ? path : `${bucketName}/${path}`;
      
      const { data: fallbackData, error: fallbackError } = await supabase.storage
        .from(STORAGE_BUCKETS.DEFAULT)
        .upload(fallbackPath, fileBody, options);
      
      if (!fallbackError) {
        return { 
          data: fallbackData, 
          error: null,
          actualBucket: STORAGE_BUCKETS.DEFAULT,
          actualPath: fallbackPath
        };
      }
      
      console.error(`Fallback upload to ${STORAGE_BUCKETS.DEFAULT}/${fallbackPath} failed:`, fallbackError);
    }
    
    // Both attempts failed
    return { data: null, error, actualBucket: null, actualPath: null };
  } catch (err) {
    console.error(`Unexpected error in safeUploadFile:`, err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error(String(err)),
      actualBucket: null,
      actualPath: null
    };
  }
};

/**
 * Get public URL for a file with appropriate handling
 */
export const getPublicFileUrl = (
  supabase: SupabaseClient,
  bucketName: string,
  path: string
) => {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);
    
    return { publicUrl: data.publicUrl, error: null };
  } catch (err) {
    console.error(`Error getting public URL for ${bucketName}/${path}:`, err);
    return { publicUrl: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
};
