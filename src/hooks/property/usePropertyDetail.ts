
import { useState, useEffect } from "react";
import { PropertyListing, ListingStatus } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createLogger } from "@/utils/logger";
import { isPropertyOwner } from "@/utils/propertyOwnershipUtils";
import { mockListings } from "@/data/mockData";
import { isValidUUID } from "@/utils/property/propertyIdValidation";
import { fetchPropertyFromDatabase } from "@/services/property/propertyService";

const logger = createLogger("usePropertyDetail");

export const usePropertyDetail = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'not-found' | 'invalid-id' | 'no-permission' | null>(null);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setErrorType('not-found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // First check mock data (for demo purposes)
        const mockProperty = mockListings.find((listing) => listing.id === propertyId);
        
        if (mockProperty) {
          // If listing is pending and user is not the owner, don't display it
          if (mockProperty.status === ListingStatus.PENDING && 
              mockProperty.sellerId !== user?.id && 
              !user?.isAdmin) {
            setProperty(null);
            setErrorType('no-permission');
            setIsLoading(false);
            return;
          }
          
          logger.info("Found property in mock data:", { id: propertyId, title: mockProperty.title });
          setProperty(mockProperty);
          setIsLoading(false);
          return;
        }
        
        // If not found in mock data, try to fetch from Supabase
        // Only validate UUID if we're fetching from Supabase database
        // This allows non-UUID format IDs for mock data
        if (!isValidUUID(propertyId)) {
          logger.info("Non-UUID format property ID:", propertyId);
          setProperty(null);
          setErrorType('not-found');
          setIsLoading(false);
          return;
        }
        
        logger.info("Fetching property from database:", propertyId);
        
        // Fetch property from database
        const { property: dbProperty, error } = await fetchPropertyFromDatabase(
          supabase,
          propertyId,
          user?.id,
          user?.email
        );
        
        if (error || !dbProperty) {
          logger.error("Error or no property returned:", error);
          setProperty(null);
          setErrorType('not-found');
          setIsLoading(false);
          return;
        }
        
        // Check if listing is pending and user is not the owner
        const isOwner = isPropertyOwner(dbProperty, user?.id, user?.email);
          
        if (dbProperty.status === ListingStatus.PENDING && 
            !isOwner && 
            !user?.isAdmin) {
          setProperty(null);
          setErrorType('no-permission');
          setIsLoading(false);
          return;
        }
        
        // Ensure roomDetails exists even if it doesn't in the database
        if (!dbProperty.roomDetails) {
          dbProperty.roomDetails = {};
        }
        
        // Ensure sellerName has a value if available
        if (!dbProperty.sellerName && dbProperty.seller_name) {
          dbProperty.sellerName = dbProperty.seller_name;
        }
        
        // If we still don't have a seller name, try to fetch it
        if (!dbProperty.sellerName && dbProperty.sellerId) {
          try {
            // Try to fetch the seller's user info if we don't have their name
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', dbProperty.sellerId)
              .single();
              
            if (!userError && userData && userData.full_name) {
              dbProperty.sellerName = userData.full_name;
            }
          } catch (userErr) {
            // Non-fatal, continue with the property data we have
            logger.error("Error fetching seller info:", userErr);
          }
        }
        
        setProperty(dbProperty);
      } catch (err) {
        logger.error("Failed to fetch property:", err);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        setProperty(null);
        setErrorType('not-found');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId, supabase, toast, user]);

  return {
    property,
    isLoading,
    errorType
  };
};
