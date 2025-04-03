
import { useSupabase } from "@/hooks/useSupabase";
import { EditListingFormValues } from "@/types/edit-listing";
import { Room } from "@/types";

export function usePropertyUpdate() {
  const { supabase } = useSupabase();

  const updatePropertyListing = async (
    propertyId: string,
    userId: string,
    values: EditListingFormValues,
    bedroomRooms: Room[],
    otherRooms: Room[]
  ) => {
    // Create base update data without floor_plans to avoid errors
    const featuresArray = values.features
      ? values.features.split(',').map(item => item.trim())
      : [];

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
        .eq("seller_id", userId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (initialError: any) {
      if (initialError.message && initialError.message.includes("room_details")) {
        const { room_details, ...dataWithoutRoomDetails } = updateData;
        
        try {
          const { error } = await supabase
            .from("property_listings")
            .update(dataWithoutRoomDetails)
            .eq("id", propertyId)
            .eq("seller_id", userId);
            
          if (error) throw error;
          
          return { success: true };
        } catch (fallbackError) {
          return { success: false, error: fallbackError };
        }
      } else {
        return { success: false, error: initialError };
      }
    }
  };

  return { updatePropertyListing };
}
