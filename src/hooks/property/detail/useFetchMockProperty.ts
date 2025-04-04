
import { ListingStatus, PropertyListing } from "@/types";
import { mockListings } from "@/data/mockData";
import { createLogger } from "@/utils/logger";
import { User } from "@/types";

const logger = createLogger("useFetchMockProperty");

export const useFetchMockProperty = (user: User | null) => {
  const fetchMockProperty = async (propertyId: string) => {
    // Check mock data (for demo purposes)
    const mockProperty = mockListings.find((listing) => listing.id === propertyId);
    
    if (mockProperty) {
      // If listing is pending and user is not the owner, don't display it
      if (mockProperty.status === ListingStatus.PENDING && 
          mockProperty.sellerId !== user?.id && 
          !user?.isAdmin) {
        return { mockProperty: null, mockErrorType: 'no-permission' as const };
      }
      
      logger.info("Found property in mock data:", { id: propertyId, title: mockProperty.title });
      return { mockProperty, mockErrorType: null };
    }
    
    return { mockProperty: null, mockErrorType: null };
  };

  return { fetchMockProperty };
};
