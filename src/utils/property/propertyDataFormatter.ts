
import { PropertyListing, ListingStatus } from "@/types";

/**
 * Format raw database property data to match PropertyListing type
 */
export const formatPropertyData = (
  propertyData: any, 
  userId?: string | null
): PropertyListing => {
  return {
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
    sellerId: propertyData.seller_id || userId || "",
    status: propertyData.status,
    createdAt: new Date(propertyData.created_at),
    updatedAt: new Date(propertyData.updated_at),
    roomDetails: {
      ...propertyData.room_details,
      listingNumber: propertyData.listing_number
    }
  };
};
