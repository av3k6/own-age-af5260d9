
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { FormProvider, useFormContext } from "./context/FormContext";
import FormProgress from "./components/FormProgress";
import BasicDetails from "./steps/BasicDetails";
import PropertyFeatures from "./steps/PropertyFeatures";
import MediaUpload from "./steps/MediaUpload";
import DocumentUpload from "./steps/DocumentUpload";
import ReviewAndPublish from "./steps/ReviewAndPublish";
import OptionalPropertyDetails from "./components/OptionalPropertyDetails";

const steps = [
  { id: "basic", title: "Basic Details", position: 1 },
  { id: "features", title: "Property Features", position: 2 },
  { id: "media", title: "Upload Photos", position: 3 },
  { id: "documents", title: "Upload Documents", position: 4 },
  { id: "review", title: "Review & Publish", position: 5 },
];

const ListingFormContent = () => {
  const { currentStep, formData, goToNextStep, goToPreviousStep, isSubmitting, setIsSubmitting } = useFormContext();
  const { user } = useAuth();
  const { supabase, buckets } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePublish = async () => {
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

      // Remove the validation that fails when no images are uploaded successfully
      // (this was the previous blocker for listings without images)

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
          status: formData.status,
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

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your property listing has been published",
      });

      // Redirect to the new listing or dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error publishing listing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish your listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <FormProgress currentStep={currentStep} steps={steps} />
      
      <div className="p-6">
        {currentStep === "basic" && (
          <>
            <BasicDetails />
            <OptionalPropertyDetails />
          </>
        )}
        
        {currentStep === "features" && (
          <PropertyFeatures />
        )}
        
        {currentStep === "media" && (
          <MediaUpload />
        )}
        
        {currentStep === "documents" && (
          <DocumentUpload />
        )}
        
        {currentStep === "review" && (
          <ReviewAndPublish onPublish={handlePublish} />
        )}
      </div>
    </div>
  );
};

const ListingForm = () => {
  return (
    <FormProvider>
      <ListingFormContent />
    </FormProvider>
  );
};

export default ListingForm;
