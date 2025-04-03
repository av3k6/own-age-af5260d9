
import { createLogger } from "@/utils/logger";

const logger = createLogger("propertyOwnershipUtils");

/**
 * Determines if the current user is the owner of a property
 * by checking both seller_id and seller_email fields
 */
export const isPropertyOwner = (
  propertyData: any, 
  userId: string | undefined, 
  userEmail: string | undefined
): boolean => {
  if (!propertyData) return false;
  if (!userId && !userEmail) return false;
  
  // Check if seller_id matches user ID
  const matchesId = propertyData.seller_id === userId;
  
  // Check if seller_email matches user email
  const matchesEmail = propertyData.seller_email === userEmail;
  
  if (matchesId) {
    logger.info(`User ${userId} is the owner of property ${propertyData.id} by ID match`);
  } else if (matchesEmail) {
    logger.info(`User ${userEmail} is the owner of property ${propertyData.id} by email match`);
  }
  
  return matchesId || matchesEmail;
};

/**
 * Filters a list of properties to find those owned by the current user
 * using both ID and email matching
 */
export const filterUserProperties = (
  properties: any[], 
  userId: string | undefined, 
  userEmail: string | undefined
): any[] => {
  if (!properties || properties.length === 0) return [];
  if (!userId && !userEmail) return [];
  
  return properties.filter(property => 
    isPropertyOwner(property, userId, userEmail)
  );
};
