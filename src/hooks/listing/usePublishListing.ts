
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ListingFormData } from "@/components/listing/context/FormContext";
import { useListingNumber } from "@/hooks/useListingNumber";
import { useImageUpload } from "./useImageUpload";
import { useDocumentUpload } from "./useDocumentUpload";
import { useListingDatabase } from "./useListingDatabase";

export const usePublishListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { generateListingNumber } = useListingNumber();
  const { uploadImages } = useImageUpload();
  const { uploadDocuments } = useDocumentUpload();
  const { insertListing } = useListingDatabase();

  const publishListing = async (formData: ListingFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to publish a property",
        variant: "destructive",
      });
      return;
    }

    if (!formData.confirmationChecked) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that your listing information is accurate",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique listing number
      const listingNumber = await generateListingNumber();
      
      // Upload images
      const imageUrls = await uploadImages(formData.images, user.id);
      
      // Upload documents
      const documentData = await uploadDocuments(formData.documents, user.id);

      // Insert into database
      const { data, error } = await insertListing(
        formData,
        user.id,
        user.email,
        user.name,
        imageUrls,
        documentData,
        listingNumber
      );

      if (error) {
        let errorMessage = "Failed to publish your listing";
        
        if (error.message && error.message.includes("property_listings table doesn't exist")) {
          errorMessage = "The database is not set up correctly. The property_listings table needs to be created.";
          
          toast({
            title: "Database Setup Required",
            description: errorMessage,
            variant: "destructive",
          });
        } else if (error.code === "PGRST116") {
          errorMessage = "The property_listings table doesn't exist in your Supabase database. Please create it before publishing.";
          
          toast({
            title: "Database Setup Required",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || errorMessage,
            variant: "destructive",
          });
        }
        
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your property listing has been published",
      });

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error publishing listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, publishListing };
};
