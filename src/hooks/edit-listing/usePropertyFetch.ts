
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { Room, PropertyRoomDetails } from "@/types";
import { DocumentMetadata } from "@/types/document";
import { UseFormReset } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";
import { createLogger } from "@/utils/logger";

const logger = createLogger("usePropertyFetch");

export function usePropertyFetch(
  propertyId: string | undefined,
  form: { reset: UseFormReset<EditListingFormValues> },
  setBedroomRooms: (rooms: Room[]) => void,
  setOtherRooms: (rooms: Room[]) => void,
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void,
  setPropertyDetails?: (details: PropertyRoomDetails) => void
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId || !user) return;

      try {
        logger.debug("Fetching property data for ID:", propertyId);
        
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (error) throw error;

        if (data.seller_id !== user.id) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to edit this listing.",
            variant: "destructive",
          });
          navigate(`/property/${propertyId}`);
          return;
        }

        if (data.room_details?.bedrooms) {
          setBedroomRooms(data.room_details.bedrooms);
        }
        
        if (data.room_details?.otherRooms) {
          setOtherRooms(data.room_details.otherRooms);
        }
        
        // Save room details for use elsewhere
        if (setPropertyDetails && data.room_details) {
          // Add listing number to room details if available
          const details = {
            ...data.room_details,
            listingNumber: data.listing_number || undefined
          };
          setPropertyDetails(details);
        }

        try {
          const { data: documentsData, error: documentsError } = await supabase
            .from("property_documents")
            .select("*")
            .eq("property_id", propertyId)
            .eq("document_type", "floor_plan");
          
          if (documentsError) {
            console.log("Property documents table may not exist:", documentsError);
            
            if (data.floor_plans && Array.isArray(data.floor_plans)) {
              setFloorPlans(data.floor_plans);
            }
          } else if (documentsData && documentsData.length > 0) {
            setFloorPlans(documentsData as unknown as DocumentMetadata[]);
          }
        } catch (docError) {
          console.error("Error fetching floor plans:", docError);
        }

        if (data && !hasInitialized) {
          logger.debug("Initializing form with data. Status:", data.status);
          
          form.reset({
            title: data.title,
            description: data.description,
            price: data.price,
            propertyType: data.property_type,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            squareFeet: data.square_feet,
            yearBuilt: data.year_built,
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zipCode: data.address?.zipCode || "",
            features: data.features?.join(", ") || "",
            status: data.status,
          });
          
          setHasInitialized(true);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        navigate("/property-not-found");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId, supabase, navigate, toast, user, form, setBedroomRooms, setOtherRooms, setFloorPlans, setPropertyDetails, hasInitialized]);

  return { isLoading };
}
