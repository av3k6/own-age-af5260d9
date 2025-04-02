
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentMetadata } from "@/types/document";
import { useRoomManagement } from "./edit-listing/useRoomManagement";
import { usePropertyFetch } from "./edit-listing/usePropertyFetch";
import { usePropertySave } from "./edit-listing/usePropertySave";
import { editListingFormSchema, EditListingFormValues } from "@/types/edit-listing";

export const useEditListing = (propertyId: string | undefined) => {
  const [floorPlans, setFloorPlans] = useState<DocumentMetadata[]>([]);

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

  const { isLoading } = usePropertyFetch(
    propertyId,
    { reset: form.reset },
    setBedroomRooms,
    setOtherRooms,
    setFloorPlans
  );

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
    saveProperty
  };
};

export type { EditListingFormValues };
