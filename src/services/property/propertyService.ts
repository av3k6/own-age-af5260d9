
import { SupabaseClient } from "@supabase/supabase-js";
import { createLogger } from "@/utils/logger";
import { fetchPropertyPhotos } from "@/utils/property/propertyPhotoUtils";
import { PropertyListing } from "@/types";
import { formatPropertyData } from "@/utils/property/propertyDataFormatter";

const logger = createLogger("propertyService");

/**
 * Fetch a property by ID from the database
 */
export const fetchPropertyFromDatabase = async (
  supabase: SupabaseClient,
  propertyId: string,
  userId?: string | null,
  userEmail?: string | null
): Promise<{ property: PropertyListing | null; error: Error | null }> => {
  try {
    logger.info("Fetching property from Supabase:", propertyId);
    
    // Try the primary query with property ID
    const { data, error } = await supabase
      .from("property_listings")
      .select("*")
      .eq("id", propertyId)
      .single();
      
    // If error and user exists, try alternative query with user email
    let propertyData = null;
    if (error && userEmail) {
      logger.info("Attempting to find property with user email:", userEmail);
      
      const { data: emailData, error: emailError } = await supabase
        .from("property_listings")
        .select("*")
        .eq("seller_email", userEmail)
        .eq("id", propertyId)
        .single();
        
      if (emailError || !emailData) {
        logger.error("Error in alternative query or no data:", emailError);
        return { property: null, error: emailError || new Error("Property not found") };
      }
      
      propertyData = emailData;
      logger.info("Found property using seller_email match:", propertyId);
    } else if (error) {
      logger.error("Error fetching property:", error);
      return { property: null, error };
    } else {
      propertyData = data;
    }
    
    if (!propertyData) {
      return { property: null, error: new Error("Property not found") };
    }
    
    // Fetch photos from property_photos table
    const { photoUrls } = await fetchPropertyPhotos(supabase, propertyId);
    
    // If photos found, override the images array from property_listings
    if (photoUrls && photoUrls.length > 0) {
      propertyData.images = photoUrls;
    }
    
    logger.info("Found property in database:", { id: propertyId, title: propertyData.title });
    
    // Format the raw data to match PropertyListing type
    const formattedProperty = formatPropertyData(propertyData, userId);
    
    return { property: formattedProperty, error: null };
  } catch (error: any) {
    logger.error("Failed to fetch property:", error);
    return { 
      property: null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    };
  }
};
