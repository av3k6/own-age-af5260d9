
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";

const logger = createLogger("propertyPhotoUtils");

/**
 * Fetch photos for a property from the property_photos table
 */
export const fetchPropertyPhotos = async (
  supabase: SupabaseClient,
  propertyId: string
): Promise<{ photoUrls: string[] | null; error: Error | null }> => {
  try {
    logger.info("Fetching photos from property_photos table for property:", propertyId);
    
    const { data: photoData, error: photoError } = await supabase
      .from('property_photos')
      .select('*')
      .eq('property_id', propertyId)
      .order('display_order', { ascending: true });
      
    if (photoError) {
      logger.error("Error fetching from property_photos:", photoError);
      return { photoUrls: null, error: photoError };
    }
    
    if (photoData && photoData.length > 0) {
      logger.info(`Found ${photoData.length} photos in property_photos table`);
      // Extract URLs from photo data
      const photoUrls = photoData.map(photo => photo.url);
      return { photoUrls, error: null };
    }
    
    logger.info("No photos found in property_photos table");
    return { photoUrls: null, error: null };
  } catch (error: any) {
    logger.error("Unexpected error in fetchPropertyPhotos:", error);
    return { 
      photoUrls: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
};
