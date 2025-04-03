
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { EditListingFormValues } from "@/types/edit-listing";
import { Room, ListingStatus } from "@/types";
import { DocumentMetadata } from "@/types/document";
import { useListingStatus } from "./useListingStatus";
import { useFloorPlanUpdate } from "./useFloorPlanUpdate";
import { usePropertyUpdate } from "./usePropertyUpdate";

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
  const { originalStatus, getOriginalStatus, isStatusChangeAllowed } = useListingStatus(propertyId);
  const { updateFloorPlans } = useFloorPlanUpdate();
  const { updatePropertyListing } = usePropertyUpdate();
  
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
      
      // Allow changing TO expired from any status
      // OR changing between other statuses if not currently expired
      const statusChangeAllowed = values.status === ListingStatus.EXPIRED ||
                                 isStatusChangeAllowed(originalStatusValue, values.status);
      
      if (!statusChangeAllowed) {
        toast({
          title: "Status Locked",
          description: "This listing has expired and its status can only be changed by admin staff.",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      console.log("Updating listing status to:", values.status);

      // Update the property listing
      const updateResult = await updatePropertyListing(
        propertyId, 
        user.id, 
        values, 
        bedroomRooms, 
        otherRooms
      );
      
      if (!updateResult.success) {
        throw updateResult.error;
      }

      // Handle floor plans in a separate table if they exist
      if (floorPlans.length > 0) {
        await updateFloorPlans(floorPlans, propertyId, user.id);
      }
          
      toast({
        title: "Listing Updated",
        description: `Your property listing has been updated successfully with status: ${values.status}.`,
      });
      
      navigate(`/property/${propertyId}`);
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
