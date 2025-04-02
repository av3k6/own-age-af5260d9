
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { ListingFormData } from "../context/FormContext";
import { useListingNumber } from "@/hooks/useListingNumber";

export const usePublishListing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { generateListingNumber } = useListingNumber();

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
      
      // 1. Upload images to storage
      const imageUrls = [];
      
      // Try to use the default storage bucket as most Supabase projects will have this
      const defaultBucket = 'storage';
      
      // Only try to upload images if there are any
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const image = formData.images[i];
          const fileName = `${user.id}-${Date.now()}-${i}`;
          const folderPath = `${user.id}/property-images`;
          
          try {
            // Upload the image to the default bucket
            const { data, error } = await supabase.storage
              .from(defaultBucket)
              .upload(`${folderPath}/${fileName}`, image);

            if (error) throw error;
            
            // Get the public URL
            const { data: urlData } = supabase.storage
              .from(defaultBucket)
              .getPublicUrl(`${folderPath}/${fileName}`);
            
            imageUrls.push(urlData.publicUrl);
            
            console.log(`Successfully uploaded image ${i+1}:`, urlData.publicUrl);
          } catch (uploadError: any) {
            console.error('Image upload error:', uploadError);
            toast({
              title: "Upload Warning",
              description: `Failed to upload image ${i+1}. Continuing with other images.`,
              variant: "destructive",
            });
          }
        }
      }

      // 2. Upload documents to storage (if any)
      const documentData = [];
      
      for (let i = 0; i < formData.documents.length; i++) {
        const doc = formData.documents[i];
        const fileName = `${user.id}-${Date.now()}-${i}-${doc.name}`;
        const folderPath = `${user.id}/documents`;
        
        try {
          const { data, error } = await supabase.storage
            .from(defaultBucket)
            .upload(`${folderPath}/${fileName}`, doc);

          if (error) throw error;
          
          // Get the public URL
          const { data: urlData } = supabase.storage
            .from(defaultBucket)
            .getPublicUrl(`${folderPath}/${fileName}`);
          
          documentData.push({
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: urlData.publicUrl
          });
        } catch (uploadError: any) {
          console.error('Document upload error:', uploadError);
          // Continue with other documents
        }
      }

      // 3. Insert the listing in the database with optional fields included
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
          seller_id: user.id,
          seller_email: user.email, // Add user email for more robust querying
          seller_name: user.name,   // Add user name for display purposes
          status: formData.status,
          listing_number: listingNumber, // Add the unique listing number
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
        console.error('Database error details:', error);
        
        // Check if the error is related to missing table
        if (error.code === '42P01' || error.message.includes('relation')) {
          throw new Error("The property_listings table doesn't exist in the database. Please create it first.");
        }
        
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your property listing has been published",
      });

      // Redirect to the new listing or dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error publishing listing:', error);
      
      // Provide more specific error messages based on error type
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, publishListing };
};
