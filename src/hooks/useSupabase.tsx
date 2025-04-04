import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_BUCKETS } from '@/utils/storage/bucketUtils';
import { 
  verifyBucketAccess, 
  safeUploadFile, 
  getPublicFileUrl 
} from '@/utils/supabase/bucketUtils';
import { 
  checkTableExists, 
  ensurePropertyPhotosTable 
} from '@/utils/supabase/tableUtils';
import { getCurrentUser } from '@/utils/supabase/userUtils';

export const useSupabase = () => {
  const [availableBuckets, setAvailableBuckets] = useState<string[]>([STORAGE_BUCKETS.DEFAULT]);
  const { toast } = useToast();
  
  // Get available buckets on component mount
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error fetching buckets:', error);
          // Keep default "storage" bucket which is available in all Supabase projects
          return;
        }
        
        if (data && data.length > 0) {
          const bucketNames = data.map(bucket => bucket.name);
          // Make sure we always include the "storage" bucket as a fallback
          if (!bucketNames.includes(STORAGE_BUCKETS.DEFAULT)) {
            bucketNames.push(STORAGE_BUCKETS.DEFAULT);
          }
          setAvailableBuckets(bucketNames);
        }
      } catch (err) {
        console.error('Failed to fetch buckets:', err);
        // Keep default "storage" bucket as fallback
      }
    };
    
    fetchBuckets();
  }, []);

  /**
   * Enhanced file upload with bucket fallback and retry logic
   */
  const safeUpload = async (path: string, fileBody: File, options?: any) => {
    // First verify primary bucket
    const primaryBucket = STORAGE_BUCKETS.PROPERTY_PHOTOS;
    const { exists: bucketExists } = await verifyBucketAccess(supabase, primaryBucket);
    
    try {
      // Upload with automatic fallback if needed
      const { data, error, actualBucket, actualPath } = await safeUploadFile(
        supabase,
        bucketExists ? primaryBucket : STORAGE_BUCKETS.DEFAULT,
        path,
        fileBody,
        options
      );
      
      // If both uploads failed
      if (error) {
        console.error('All upload attempts failed:', error);
        return { data: null, error };
      }
      
      return { 
        data: { ...data, path: actualPath }, 
        error: null 
      };
    } catch (error) {
      console.error('Unexpected error in safeUpload:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  };

  /**
   * Enhanced public URL getter with bucket fallback
   */
  const safeGetPublicUrl = (path: string, bucket?: string) => {
    // First try with the specified bucket or property-photos
    const primaryBucket = bucket || STORAGE_BUCKETS.PROPERTY_PHOTOS;
    
    try {
      // Try the primary bucket
      const primaryResult = getPublicFileUrl(supabase, primaryBucket, path);
      
      // If we got a URL, return it
      if (primaryResult.publicUrl) {
        return { data: { publicUrl: primaryResult.publicUrl } };
      }
      
      // If primary fails, try fallback with default bucket and adjusted path
      if (primaryBucket !== STORAGE_BUCKETS.DEFAULT) {
        const fallbackPath = path.includes('/') ? path : `${primaryBucket}/${path}`;
        const fallbackResult = getPublicFileUrl(supabase, STORAGE_BUCKETS.DEFAULT, fallbackPath);
        
        if (fallbackResult.publicUrl) {
          return { data: { publicUrl: fallbackResult.publicUrl } };
        }
      }
      
      // If all attempts fail
      console.warn('Failed to get public URL for path:', path);
      return { data: { publicUrl: null } };
    } catch (error) {
      console.error('Safe getPublicUrl error:', error);
      return { data: { publicUrl: null } };
    }
  };

  return { 
    supabase,
    availableBuckets, 
    safeUpload, 
    safeGetPublicUrl,
    getCurrentUser: () => getCurrentUser(supabase),
    checkTableExists: (tableName: string) => checkTableExists(supabase, tableName),
    ensurePropertyPhotosTable: () => ensurePropertyPhotosTable(supabase)
  };
}
