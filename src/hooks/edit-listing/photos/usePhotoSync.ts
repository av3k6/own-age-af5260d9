
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";

const logger = createLogger("usePhotoSync");

export const usePhotoSync = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  /**
   * Synchronizes photos from property_photos table to property_listings.images array
   * @returns boolean indicating success or failure
   */
  const syncPhotosWithListing = async (propertyId: string): Promise<boolean> => {
    if (!propertyId) {
      logger.error("No property ID provided for photo synchronization");
      return false;
    }

    try {
      logger.info("Syncing photos for property:", propertyId);
      
      // 1. Fetch all photos from property_photos table in display order
      const { data: photos, error } = await supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
        
      if (error) {
        logger.error("Error fetching photos to sync:", error);
        throw error;
      }
      
      // 2. Extract URLs in the correct order
      const imageUrls = photos?.map(photo => photo.url) || [];
      
      logger.info(`Found ${imageUrls.length} photos to sync to property_listings`);
      
      // 3. Update the images array in property_listings
      const { error: updateError } = await supabase
        .from('property_listings')
        .update({ images: imageUrls })
        .eq('id', propertyId);
        
      if (updateError) {
        logger.error("Error updating property_listings with synced photos:", updateError);
        throw updateError;
      }
      
      logger.info("Successfully synced photos with property listing");
      return true;
    } catch (error) {
      logger.error('Error in syncPhotosWithListing:', error);
      return false;
    }
  };

  return { syncPhotosWithListing };
};
