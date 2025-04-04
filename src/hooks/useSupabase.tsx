import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { STORAGE_BUCKETS, safeUploadFile, getPublicFileUrl, verifyBucketAccess } from '@/utils/storage/bucketUtils';

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

  // Get the current authenticated user
  const getCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error };
    }
  };

  // Check if a table exists in the database
  const checkTableExists = async (tableName: string) => {
    try {
      // First try a simple query to check if the table exists
      const { error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);
        
      if (!error) {
        return { exists: true, error: null };
      }
      
      // If there was an error, check if it's because the table doesn't exist
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { exists: false, error: null };
      }
      
      // For permission errors, assume table exists but we can't access it
      if (error.message && error.message.includes('permission denied')) {
        return { exists: true, error: null };
      }
      
      // Query the information_schema as a fallback
      const { data, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', tableName)
        .eq('table_schema', 'public')
        .single();
      
      if (schemaError) {
        // If error is permission denied, we'll assume the table exists
        if (schemaError.code === 'PGRST116') {
          return { exists: true, error: null };
        }
        
        console.error(`Error checking if table ${tableName} exists:`, schemaError);
        return { exists: false, error: schemaError };
      }
      
      return { exists: !!data, error: null };
    } catch (error) {
      console.error(`Error in checkTableExists for ${tableName}:`, error);
      return { exists: false, error };
    }
  };

  // Helper to check and create property_photos table if needed
  const ensurePropertyPhotosTable = async () => {
    try {
      // Try performing a simple query to check if the table exists
      const { error } = await supabase
        .from('property_photos')
        .select('id')
        .limit(1);
      
      // If no error, table exists and we have access
      if (!error) {
        console.log("property_photos table exists and is accessible");
        return true;
      }
      
      // If the table doesn't exist, try to create it
      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        console.log("Property photos table doesn't exist. Attempting to create it...");
        
        // Try to create the table using SQL
        try {
          const { error: sqlError } = await supabase.rpc('execute_sql', {
            sql_script: `
              CREATE TABLE IF NOT EXISTS public.property_photos (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                property_id UUID NOT NULL,
                url TEXT NOT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                is_primary BOOLEAN NOT NULL DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              );
              
              CREATE INDEX IF NOT EXISTS idx_property_photos_property_id ON public.property_photos(property_id);
              CREATE INDEX IF NOT EXISTS idx_property_photos_display_order ON public.property_photos(display_order);
            `
          });
          
          if (sqlError) {
            console.error("Error creating property_photos table:", sqlError);
            return false;
          }
          
          return true;
        } catch (createError) {
          console.error("Error executing SQL:", createError);
          return false;
        }
      }
      
      // For other errors (like permission issues), assume the table exists
      console.log("Assuming property_photos table exists despite access issues");
      return true;
    } catch (checkError) {
      console.error("Error checking for property_photos table:", checkError);
      return false;
    }
  };

  return { 
    supabase,
    availableBuckets, 
    safeUpload, 
    safeGetPublicUrl,
    getCurrentUser,
    checkTableExists,
    ensurePropertyPhotosTable
  };
}
