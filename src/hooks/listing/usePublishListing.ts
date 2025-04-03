
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { ListingStatus, PropertyType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from "@/utils/logger";
import { useListingNumber } from "@/hooks/useListingNumber";

const logger = createLogger("usePublishListing");

interface FormData {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  features: string[];
  status: ListingStatus;
  images: string[]; // This is now a string[] to match the expected type
  roomDetails?: any;
  documents?: any[];
}

export const usePublishListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { generateListingNumber } = useListingNumber();

  const publishListing = async (formData: FormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to publish a listing",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      logger.info("Publishing listing:", formData.title);
      logger.info("Current user:", { id: user.id, email: user.email });

      // Generate a new UUID for the listing
      const listingId = uuidv4();
      
      // Generate a listing number 
      const listingNumber = await generateListingNumber();
      logger.info("Generated listing number:", listingNumber);
      
      // Prepare data for insertion
      // Remove roomDetails from the data we send to Supabase since the column doesn't exist
      const { roomDetails, ...formDataWithoutRoomDetails } = formData;
      
      const listingData = {
        id: listingId,
        title: formDataWithoutRoomDetails.title,
        description: formDataWithoutRoomDetails.description,
        price: formDataWithoutRoomDetails.price,
        property_type: formDataWithoutRoomDetails.propertyType,
        address: formDataWithoutRoomDetails.address,
        bedrooms: formDataWithoutRoomDetails.bedrooms,
        bathrooms: formDataWithoutRoomDetails.bathrooms,
        square_feet: formDataWithoutRoomDetails.squareFeet,
        year_built: formDataWithoutRoomDetails.yearBuilt,
        features: formDataWithoutRoomDetails.features,
        status: formDataWithoutRoomDetails.status,
        images: formDataWithoutRoomDetails.images || [],
        seller_id: user.id,            // Store the seller's ID
        // Removing seller_email because it doesn't exist in the database table
        listing_number: listingNumber, // Add the generated listing number
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      logger.info("Prepared listing data:", {
        id: listingId, 
        seller_id: user.id,
        listing_number: listingNumber
      });

      // Insert the listing into Supabase
      const { error } = await supabase
        .from("property_listings")
        .insert(listingData);

      if (error) {
        logger.error("Error publishing listing:", error);
        toast({
          title: "Error",
          description: `Failed to publish listing: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }

      logger.info("Listing published successfully:", listingId);
      toast({
        title: "Success",
        description: "Your property listing has been published",
      });

      // Return listing ID for redirection
      return listingId;
    } catch (err) {
      logger.error("Unexpected error publishing listing:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while publishing your listing",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { publishListing, isSubmitting };
};
