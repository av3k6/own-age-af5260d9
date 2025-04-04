
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
    sellerName: propertyData.seller_name || "Property Owner", // Add default seller name
    sellerEmail: propertyData.seller_email || "", // Add seller email
    status: propertyData.status || ListingStatus.ACTIVE,
    createdAt: new Date(propertyData.created_at),
    updatedAt: new Date(propertyData.updated_at),
    roomDetails: propertyData.room_details || {}
  };
};
