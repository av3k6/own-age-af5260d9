
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mockListings } from "@/data/mockData";
import { PropertyListing, ListingStatus } from "@/types";
import PropertyNotFound from "@/components/property/PropertyNotFound";
import PropertyDetailView from "@/components/property/PropertyDetailView";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createLogger } from "@/utils/logger";
import { isPropertyOwner } from "@/utils/propertyOwnershipUtils";

const logger = createLogger("PropertyDetail");

const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'not-found' | 'invalid-id' | 'no-permission' | null>(null);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setErrorType('not-found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // First check mock data (for demo purposes)
      const mockProperty = mockListings.find((listing) => listing.id === id);
      
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
        
        logger.info("Found property in mock data:", { id, title: mockProperty.title });
        setProperty(mockProperty);
        setIsLoading(false);
        return;
      }
      
      // If not found in mock data, try to fetch from Supabase
      try {
        // Only validate UUID if we're fetching from Supabase database
        // This allows non-UUID format IDs for mock data
        if (!isValidUUID(id)) {
          logger.info("Non-UUID format property ID:", id);
          setProperty(null);
          setErrorType('not-found');
          setIsLoading(false);
          return;
        }
        
        logger.info("Fetching property from Supabase:", id);
        
        // First, try to fetch from property_listings table
        let propertyData = null;
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", id)
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
              .eq("id", id)
              .single();
              
            if (emailError || !emailData) {
              setProperty(null);
              setErrorType('not-found');
              setIsLoading(false);
              return;
            }
            
            // If we found a property by email, use that
            propertyData = emailData;
            logger.info("Found property using seller_email match:", id);
          } else {
            setProperty(null);
            setErrorType('not-found');
            setIsLoading(false);
            return;
          }
        } else {
          // Use the data from the first query
          propertyData = data;
        }
        
        if (propertyData) {
          logger.info("Found property in database:", { id, title: propertyData.title });
          
          // Check if listing is pending and user is not the owner
          // When checking ownership, check both seller_id and seller_email
          const isOwner = isPropertyOwner(propertyData, user?.id, user?.email);
            
          if (propertyData.status === ListingStatus.PENDING && 
              !isOwner && 
              !user?.isAdmin) {
            setProperty(null);
            setErrorType('no-permission');
            setIsLoading(false);
            return;
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
          
          setProperty(formattedProperty);
        } else {
          setProperty(null);
          setErrorType('not-found');
        }
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
  }, [id, supabase, toast, user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center">
          <p className="text-zen-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return <PropertyNotFound errorType={errorType} propertyId={id} />;
  }

  return <PropertyDetailView property={property} />;
};

export default PropertyDetail;
