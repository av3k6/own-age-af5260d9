
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { Room } from "@/types";
import { DocumentMetadata } from "@/types/document";
import { createLogger } from "@/utils/logger";

const logger = createLogger("usePropertyFetch");

export const usePropertyFetch = (
  propertyId: string | undefined,
  form: { reset: (values: any) => void },
  setBedroomRooms: (rooms: Room[]) => void,
  setOtherRooms: (rooms: Room[]) => void,
  setFloorPlans: (plans: DocumentMetadata[]) => void,
  setPropertyDetails: (details: any) => void
) => {
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!propertyId) {
      logger.error("No property ID provided");
      setIsLoading(false);
      setFetchError(new Error("No property ID provided"));
      setFetchAttempted(true);
      return;
    }

    const fetchProperty = async () => {
      if (fetchAttempted) {
        // Prevent duplicate fetch attempts
        return;
      }
      
      setIsLoading(true);
      setFetchError(null); // Reset error state

      try {
        logger.info(`Fetching property with ID: ${propertyId}`);
        
        // Fetch property listing data
        const { data: propertyData, error: propertyError } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (propertyError) {
          logger.error("Error fetching property:", propertyError);
          throw propertyError;
        }

        if (!propertyData) {
          logger.error("Property not found with ID:", propertyId);
          throw new Error("Property not found");
        }
        
        logger.info("Successfully fetched property data:", propertyData.title);

        // Format and set form data
        form.reset({
          title: propertyData.title || "",
          description: propertyData.description || "",
          price: propertyData.price || 0,
          propertyType: propertyData.property_type || "HOUSE",
          bedrooms: propertyData.bedrooms || 0,
          bathrooms: propertyData.bathrooms || 0,
          squareFeet: propertyData.square_feet || 0,
          yearBuilt: propertyData.year_built || new Date().getFullYear(),
          street: propertyData.address?.street || "",
          city: propertyData.address?.city || "",
          state: propertyData.address?.state || "",
          zipCode: propertyData.address?.zipCode || "",
          features: propertyData.features?.join(", ") || "",
          status: propertyData.status || "ACTIVE",
        });

        // Set room details
        const roomDetails = propertyData.room_details || {};
        
        if (roomDetails.bedrooms) {
          setBedroomRooms(roomDetails.bedrooms);
        }

        if (roomDetails.otherRooms) {
          setOtherRooms(roomDetails.otherRooms);
        }

        setPropertyDetails({
          ...roomDetails,
          listingNumber: propertyData.listing_number || undefined,
        });

        // Fetch floor plans from property_documents
        logger.info("Fetching floor plans for property:", propertyId);
        const { data: documentData, error: documentError } = await supabase
          .from("property_documents")
          .select("*")
          .eq("property_id", propertyId)
          .eq("category", "floor_plans");
        
        if (documentError) {
          logger.error("Error fetching floor plans:", documentError);
          // Non-fatal, continue without floor plans
        } else if (documentData && documentData.length > 0) {
          // Transform DB documents to DocumentMetadata format
          const floorPlans: DocumentMetadata[] = documentData.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: doc.url,
            path: doc.path,
            uploadedBy: doc.uploaded_by,
            createdAt: doc.created_at,
            propertyId: doc.property_id,
            category: doc.category,
            description: doc.description
          }));
          
          logger.info(`Found ${floorPlans.length} floor plans`);
          setFloorPlans(floorPlans);
        } else {
          logger.info("No floor plans found for property");
          setFloorPlans([]);
        }
      } catch (error: any) {
        setFetchError(error);
        toast({
          title: "Error",
          description: "Could not load property data. Please try again later.",
          variant: "destructive",
        });
        console.error("Failed to fetch property details:", error);
      } finally {
        setIsLoading(false);
        setFetchAttempted(true);
      }
    };

    fetchProperty();
  }, [propertyId, form, setBedroomRooms, setOtherRooms, setFloorPlans, setPropertyDetails, supabase, toast, fetchAttempted]);

  return { isLoading, fetchError, fetchAttempted };
};
