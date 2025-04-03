
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/hooks/useSupabase";
import { ListingStatus, PropertyType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from "@/utils/logger";

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
  images: string[];
  roomDetails?: any;
  documents?: any[];
}

export const usePublishListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

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
      
      // Prepare data for insertion
      const listingData = {
        id: listingId,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        property_type: formData.propertyType,
        address: formData.address,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        square_feet: formData.squareFeet,
        year_built: formData.yearBuilt,
        features: formData.features,
        status: formData.status,
        images: formData.images || [],
        room_details: formData.roomDetails || {},
        seller_id: user.id,            // Store the seller's ID
        seller_email: user.email,      // Also store seller's email as backup
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      logger.info("Prepared listing data:", {
        id: listingId, 
        seller_id: user.id, 
        seller_email: user.email
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
