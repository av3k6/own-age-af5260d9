
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentMetadata } from "@/types/document";
import { useRoomManagement } from "./edit-listing/useRoomManagement";
import { usePropertyFetch } from "./edit-listing/usePropertyFetch";
import { usePropertySave } from "./edit-listing/usePropertySave";
import { editListingFormSchema, EditListingFormValues } from "@/types/edit-listing";
import { PropertyRoomDetails } from "@/types";

export const useEditListing = (propertyId: string | undefined) => {
  const [floorPlans, setFloorPlans] = useState<DocumentMetadata[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyRoomDetails | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  const form = useForm<EditListingFormValues>({
    resolver: zodResolver(editListingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      propertyType: "HOUSE" as any,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      yearBuilt: new Date().getFullYear(),
      street: "",
      city: "",
      state: "",
      zipCode: "",
      features: "",
      status: "ACTIVE" as any,
    },
  });

  const { bedroomRooms, setBedroomRooms, otherRooms, setOtherRooms } = useRoomManagement(
    form.watch("bedrooms"),
    form.watch
  );

  const { isLoading, fetchError } = usePropertyFetch(
    propertyId,
    { reset: form.reset },
    setBedroomRooms,
    setOtherRooms,
    setFloorPlans,
    setPropertyDetails
  );
  
  // Track any errors from property fetching
  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching property:", fetchError);
      setError(fetchError);
    }
  }, [fetchError]);

  const { isSaving, saveProperty } = usePropertySave(
    propertyId,
    bedroomRooms,
    otherRooms,
    floorPlans
  );

  return {
    form,
    isLoading,
    isSaving,
    bedroomRooms,
    setBedroomRooms,
    otherRooms,
    setOtherRooms,
    floorPlans,
    setFloorPlans,
    saveProperty,
    propertyDetails,
    error
  };
};

export type { EditListingFormValues };
