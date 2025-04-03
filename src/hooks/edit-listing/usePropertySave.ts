
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { EditListingFormValues } from "@/types/edit-listing";
import { Room, ListingStatus } from "@/types";
import { DocumentMetadata } from "@/types/document";

export function usePropertySave(
  propertyId: string | undefined,
  bedroomRooms: Room[],
  otherRooms: Room[],
  floorPlans: DocumentMetadata[]
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  
  // Fetch the original status when the hook is first initialized
  const getOriginalStatus = async () => {
    if (!propertyId || originalStatus) return originalStatus;
    
    try {
      const { data, error } = await supabase
        .from("property_listings")
        .select("status")
        .eq("id", propertyId)
        .single();
        
      if (error) throw error;
      
      setOriginalStatus(data.status);
      return data.status;
    } catch (error) {
      console.error("Error fetching original status:", error);
      return null;
    }
  };
  
  const saveProperty = async (values: EditListingFormValues) => {
    if (!propertyId || !user) {
      toast({
        title: "Error",
        description: "Missing property or user information",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Get the original status
      const originalStatusValue = await getOriginalStatus();
      
      // Check if the status is locked (was previously expired)
      const isStatusLocked = originalStatusValue === ListingStatus.EXPIRED;
      
      // If status is locked and the user is trying to change it, prevent the save
      if (isStatusLocked && values.status !== ListingStatus.EXPIRED) {
        toast({
          title: "Status Locked",
          description: "This listing has expired and its status can only be changed by admin staff.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const featuresArray = values.features
        ? values.features.split(',').map(item => item.trim())
        : [];

      console.log("Updating listing status to:", values.status);

      // Create base update data without floor_plans to avoid errors
      const updateData = {
        title: values.title,
        description: values.description,
        price: values.price,
        property_type: values.propertyType,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        square_feet: values.squareFeet,
        year_built: values.yearBuilt,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        features: featuresArray,
        status: values.status,
        room_details: {
          bedrooms: bedroomRooms,
          otherRooms: otherRooms
        },
        updated_at: new Date().toISOString(),
      };
      
      try {
        // Update property listing without including floor_plans field
        const { error } = await supabase
          .from("property_listings")
          .update(updateData)
          .eq("id", propertyId)
          .eq("seller_id", user.id);
          
        if (error) throw error;

        // Handle floor plans in a separate table if they exist
        try {
          if (floorPlans.length > 0) {
            for (const floorPlan of floorPlans) {
              if (!floorPlan.id || !floorPlan.id.includes('/')) continue;
              
              const documentData = {
                id: floorPlan.id.replace(/\//g, '_'),
                name: floorPlan.name,
                url: floorPlan.url,
                type: floorPlan.type,
                size: floorPlan.size,
                property_id: propertyId,
                uploaded_by: user.id,
                document_type: "floor_plan",
                path: floorPlan.path,
                created_at: floorPlan.createdAt
              };

              const { data: existingDoc, error: checkError } = await supabase
                .from("property_documents")
                .select("id")
                .eq("property_id", propertyId)
                .eq("path", floorPlan.path)
                .maybeSingle();

              if (!checkError) {
                if (existingDoc) {
                  await supabase
                    .from("property_documents")
                    .update(documentData)
                    .eq("id", existingDoc.id);
                } else {
                  await supabase
                    .from("property_documents")
                    .insert(documentData);
                }
              }
            }
          }
        } catch (documentError) {
          console.warn("Could not save to property_documents table:", documentError);
          // Don't throw error here, just log warning - allow update to succeed even if documents fail
        }
          
        toast({
          title: "Listing Updated",
          description: `Your property listing has been updated successfully with status: ${values.status}.`,
        });
        
        navigate(`/property/${propertyId}`);
      } catch (initialError: any) {
        if (initialError.message && initialError.message.includes("room_details")) {
          const { room_details, ...dataWithoutRoomDetails } = updateData;
          
          console.log("Retrying update without room_details field");
          const { error } = await supabase
            .from("property_listings")
            .update(dataWithoutRoomDetails)
            .eq("id", propertyId)
            .eq("seller_id", user.id);
            
          if (error) throw error;
          
          toast({
            title: "Listing Updated",
            description: `Your property listing has been updated successfully with status: ${values.status}.`,
          });
          
          navigate(`/property/${propertyId}`);
        } else {
          throw initialError;
        }
      }
    } catch (error: any) {
      console.error("Failed to update listing:", error);
      toast({
        title: "Failed to Update Listing",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveProperty };
}
