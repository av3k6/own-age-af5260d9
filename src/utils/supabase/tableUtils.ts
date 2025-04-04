
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Check if a table exists in the database
 */
export const checkTableExists = async (supabase: SupabaseClient, tableName: string) => {
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

/**
 * Helper to check and create property_photos table if needed
 */
export const ensurePropertyPhotosTable = async (supabase: SupabaseClient) => {
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
