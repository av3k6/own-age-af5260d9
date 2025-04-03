
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSupabase = () => {
  const [buckets, setBuckets] = useState<string[]>(['storage']); // Default to 'storage' bucket
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
      // Query the information_schema to check if table exists
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', tableName)
        .eq('table_schema', 'public')
        .single();
      
      if (error) {
        // If error is permission denied, we'll assume the table exists
        // as this is likely due to RLS policies
        if (error.code === 'PGRST116') {
          return { exists: true, error: null };
        }
        
        console.error(`Error checking if table ${tableName} exists:`, error);
        return { exists: false, error };
      }
      
      return { exists: !!data, error: null };
    } catch (error) {
      console.error(`Error in checkTableExists for ${tableName}:`, error);
      return { exists: false, error };
    }
  };

  // Helper to check and create property_photos table if needed
  const ensurePropertyPhotosTable = async () => {
    const { exists, error } = await checkTableExists('property_photos');
    
    if (error) {
      toast({
        title: "Database Error",
        description: "Could not verify database schema. Some features may not work correctly.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!exists) {
      toast({
        title: "Database Setup",
        description: "The property_photos table needs to be created. Please run the database setup script.",
        variant: "destructive",
      });
      console.error('The property_photos table does not exist in the database.');
      return false;
    }
    
    return true;
  };

  return { 
    supabase, 
    buckets, 
    safeUpload, 
    safeGetPublicUrl,
    getCurrentUser,
    checkTableExists,
    ensurePropertyPhotosTable
  };
};

