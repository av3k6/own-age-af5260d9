
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";

const logger = createLogger("tableUtils");

/**
 * Ensures that the property_photos table exists in the database
 * @param supabase Supabase client instance
 * @returns Boolean indicating success or failure
 */
export const ensurePropertyPhotosTable = async (supabase: SupabaseClient): Promise<boolean> => {
  try {
    logger.info("Ensuring property_photos table exists");
    
    // Try a simple query to see if the table exists and is accessible
    const { error } = await supabase
      .from('property_photos')
      .select('count')
      .limit(1);
    
    // If the table doesn't exist, try to create it
    if (error && (error.code === '42P01' || error.message.includes('relation "property_photos" does not exist'))) {
      logger.warn("property_photos table doesn't exist, creating it...");
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS property_photos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          property_id UUID NOT NULL,
          url TEXT NOT NULL,
          display_order INTEGER NOT NULL DEFAULT 0,
          is_primary BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_property_photos_property_id 
        ON property_photos(property_id);
        
        CREATE INDEX IF NOT EXISTS idx_property_photos_display_order 
        ON property_photos(display_order);
      `;
      
      // Try to create the table using RPC
      try {
        const { error: createError } = await supabase.rpc('create_table_if_not_exists', { 
          table_sql: createTableSQL 
        });
        
        if (createError) {
          logger.error("Failed to create property_photos table:", createError);
          return false;
        }
        
        logger.info("Successfully created property_photos table");
        return true;
      } catch (rpcError) {
        logger.error("RPC error creating table:", rpcError);
        return false;
      }
    } else if (error) {
      logger.error("Error checking property_photos table:", error);
      return false;
    }
    
    // If we get here, the table exists
    logger.info("property_photos table exists");
    return true;
  } catch (error) {
    logger.error("Error in ensurePropertyPhotosTable:", error);
    return false;
  }
};
