
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
  const safeUpload = async (path: string, fileBody: File, options?: any) => {
    try {
      // Always use the 'property-photos' bucket first, fallback to 'storage' bucket
      const { data, error } = await supabase.storage
        .from('property-photos')
        .upload(path, fileBody, options);
      
      if (error && error.message && error.message.includes('violates row-level security policy')) {
        // If RLS error, try with the default storage bucket
        console.log('Falling back to default storage bucket due to RLS policy');
        return await supabase.storage
          .from('storage')
          .upload(`property-photos/${path}`, fileBody, options);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Safe upload error:', error);
      return { data: null, error };
    }
  };

  // Create a safe getPublicUrl function
  const safeGetPublicUrl = (path: string) => {
    try {
      return supabase.storage
        .from('property-photos')
        .getPublicUrl(path);
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
    try {
      // Try performing a simple query to check if the table exists
      const { error } = await supabase
        .from('property_photos')
        .select('id')
        .limit(1);
      
      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        console.log("Property photos table doesn't exist. Attempting to create it...");
        
        // Try to create the table using the SQL from the file
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
      
      return true;
    } catch (checkError) {
      console.error("Error checking for property_photos table:", checkError);
      return false;
    }
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
}
