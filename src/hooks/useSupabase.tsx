
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export const useSupabase = () => {
  const [buckets, setBuckets] = useState<string[]>(['storage']); // Default to 'storage' bucket
  
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
          if (!bucketNames.includes('storage')) {
            bucketNames.push('storage');
          }
          setBuckets(bucketNames);
        }
      } catch (err) {
        console.error('Failed to fetch buckets:', err);
        // Keep default "storage" bucket as fallback
      }
    };
    
    fetchBuckets();
  }, []);

  // Create a safe upload function that will always use the 'storage' bucket
  const safeUpload = async (filePath: string, file: File, options?: any) => {
    try {
      // Always use the 'storage' bucket which exists by default in Supabase
      const { data, error } = await supabase.storage
        .from('storage')
        .upload(filePath, file, options);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Safe upload error:', error);
      return { data: null, error };
    }
  };

  // Create a safe getPublicUrl function
  const safeGetPublicUrl = (filePath: string) => {
    return supabase.storage
      .from('storage')
      .getPublicUrl(filePath);
  };

  return { 
    supabase, 
    buckets, 
    safeUpload, 
    safeGetPublicUrl 
  };
};
