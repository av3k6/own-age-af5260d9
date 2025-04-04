
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { ListingFormData } from "@/components/listing/context/FormContext";
import { DocumentMetadata } from "./useDocumentUpload";
import { useListingNumber } from "@/hooks/useListingNumber";

export const useListingDatabase = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { generateListingNumber } = useListingNumber();

  const insertListing = async (
    formData: ListingFormData, 
    userId: string,
    userEmail: string | undefined,
    userName: string | undefined,
    imageUrls: string[],
    documentData: DocumentMetadata[],
    listingNumber?: string
  ) => {
    try {
      // Generate a listing number if not provided
      const finalListingNumber = listingNumber || await generateListingNumber();
      
      const { data, error } = await supabase
        .from('property_listings')
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          address: formData.address,
          property_type: formData.propertyType,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          square_feet: formData.squareFeet,
          year_built: formData.yearBuilt,
          features: formData.features,
          images: imageUrls,
          documents: documentData,
          seller_id: userId,
          // Removing seller_email and seller_name fields
          status: formData.status,
          listing_number: finalListingNumber, // Use the generated listing number
          // Optional fields
          property_condition: formData.propertyCondition,
          recent_upgrades: formData.recentUpgrades,
          utility_information: formData.utilityInformation,
          fees: formData.fees,
          energy_efficient: formData.energyEfficient,
          parking_details: formData.parkingDetails,
          special_amenities: formData.specialAmenities,
          created_at: new Date(),
          updated_at: new Date()
        })
        .select();

      if (error) {
        // Check if the error is related to missing table
        if (error.code === '42P01' || error.message.includes('relation')) {
          throw new Error("The property_listings table doesn't exist in the database. Please create it first.");
        }
        
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Database error details:', error);
      return { data: null, error };
    }
  };

  return { insertListing };
};
