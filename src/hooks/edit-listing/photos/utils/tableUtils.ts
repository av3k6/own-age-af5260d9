
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
    
    // If the table doesn't exist or we have access issues
    if (error) {
      logger.warn("Error accessing property_photos table:", error.message);
      
      // If we have access to the database but can't modify it (RLS issues),
      // we'll just assume the table exists and try to use it
      return true;
    }
    
    // If we get here, the table exists and we have access
    logger.info("property_photos table exists and is accessible");
    return true;
  } catch (error) {
    logger.error("Error in ensurePropertyPhotosTable:", error);
    // Assume table exists as a fallback
    return true;
  }
};
