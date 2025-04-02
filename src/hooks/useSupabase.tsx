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

  return { supabase, buckets };
};
