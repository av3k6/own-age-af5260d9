
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export const useSupabase = () => {
  const [buckets, setBuckets] = useState<string[]>([]);
  
  // Get available buckets on component mount
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error fetching buckets:', error);
          return;
        }
        
        if (data) {
          setBuckets(data.map(bucket => bucket.name));
        }
      } catch (err) {
        console.error('Failed to fetch buckets:', err);
      }
    };
    
    fetchBuckets();
  }, []);

  return { supabase, buckets };
};
