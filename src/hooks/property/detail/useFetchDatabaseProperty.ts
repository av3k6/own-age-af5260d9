
import { PropertyListing, ListingStatus } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import { createLogger } from "@/utils/logger";
import { User } from "@/types";
import { isPropertyOwner } from "@/utils/propertyOwnershipUtils";
import { isValidUUID } from "../utils/propertyUtils";

const logger = createLogger("useFetchDatabaseProperty");

export const useFetchDatabaseProperty = (user: User | null) => {
  const { supabase } = useSupabase();
  
  const fetchDatabaseProperty = async (propertyId: string) => {
    // Only validate UUID if we're fetching from Supabase database
    // This allows non-UUID format IDs for mock data
    if (!isValidUUID(propertyId)) {
      logger.info("Non-UUID format property ID:", propertyId);
      return { dbProperty: null, dbErrorType: 'not-found' as const };
    }
    
    logger.info("Fetching property from Supabase:", propertyId);
    
    // First, try to fetch from property_listings table
    let propertyData = null;
    const { data, error } = await supabase
      .from("property_listings")
      .select("*")
      .eq("id", propertyId)
      .single();
      
    if (error) {
      logger.error("Error fetching property:", error);
      
      // Try an alternative query using seller_email instead of seller_id
      if (user) {
        logger.info("Attempting to find property with user email:", user.email);
        const { data: emailData, error: emailError } = await supabase
          .from("property_listings")
          .select("*")
          .eq("seller_email", user.email)
          .eq("id", propertyId)
          .single();
          
        if (emailError || !emailData) {
          return { dbProperty: null, dbErrorType: 'not-found' as const };
        }
        
        // If we found a property by email, use that
        propertyData = emailData;
        logger.info("Found property using seller_email match:", propertyId);
      } else {
        return { dbProperty: null, dbErrorType: 'not-found' as const };
      }
    } else {
      // Use the data from the first query
      propertyData = data;
    }
    
    // If we found a property, check if we need to fetch photos from property_photos table
    if (propertyData) {
      propertyData = await enhancePropertyWithPhotos(propertyData, propertyId, supabase);
      
      logger.info("Found property in database:", { id: propertyId, title: propertyData.title });
      
      // Check if listing is pending and user is not the owner
      // When checking ownership, check both seller_id and seller_email
      const isOwner = isPropertyOwner(propertyData, user?.id, user?.email);
        
      if (propertyData.status === ListingStatus.PENDING && 
          !isOwner && 
          !user?.isAdmin) {
        return { dbProperty: null, dbErrorType: 'no-permission' as const };
      }
      
      // Transform the raw data to match PropertyListing type
      const formattedProperty: PropertyListing = {
        id: propertyData.id,
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        address: propertyData.address,
        propertyType: propertyData.property_type,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        squareFeet: propertyData.square_feet,
        yearBuilt: propertyData.year_built,
        features: propertyData.features || [],
        images: propertyData.images || [],
        sellerId: propertyData.seller_id || user?.id || "",  // Fallback to current user ID if missing
        status: propertyData.status,
        createdAt: new Date(propertyData.created_at),
        updatedAt: new Date(propertyData.updated_at),
        roomDetails: {
          ...propertyData.room_details,
          listingNumber: propertyData.listing_number
        }
      };
      
      return { dbProperty: formattedProperty, dbErrorType: null };
    }
    
    return { dbProperty: null, dbErrorType: 'not-found' as const };
  };
  
  // Helper function to enhance property with photos from property_photos table
  const enhancePropertyWithPhotos = async (propertyData: any, propertyId: string, supabase: any) => {
    try {
      logger.info("Fetching photos from property_photos table");
      const { data: photoData, error: photoError } = await supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
        
      if (!photoError && photoData && photoData.length > 0) {
        logger.info(`Found ${photoData.length} photos in property_photos table`);
        // Override the images array from property_listings with photos from property_photos
        const photoUrls = photoData.map(photo => photo.url);
        propertyData.images = photoUrls;
      } else {
        logger.info("No photos found in property_photos or error occurred:", photoError);
      }
    } catch (photoFetchError) {
      logger.error("Error fetching from property_photos:", photoFetchError);
      // Continue with existing images if any
    }
    
    return propertyData;
  };

  return { fetchDatabaseProperty };
};
