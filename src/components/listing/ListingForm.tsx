
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { FormProvider, useFormContext, FormSteps } from "./context/FormContext";
import FormProgress from "./components/FormProgress";
import BasicDetails from "./steps/BasicDetails";
import PropertyFeatures from "./steps/PropertyFeatures";
import MediaUpload from "./steps/MediaUpload";
import DocumentUpload from "./steps/DocumentUpload";
import ReviewAndPublish from "./steps/ReviewAndPublish";

const steps = [
  { id: "basic", title: "Basic Details", position: 1 },
  { id: "features", title: "Property Features", position: 2 },
  { id: "media", title: "Upload Photos", position: 3 },
  { id: "documents", title: "Upload Documents", position: 4 },
  { id: "review", title: "Review & Publish", position: 5 },
];

const ListingFormContent = () => {
  const { currentStep, formData, updateFormData, goToNextStep, goToPreviousStep, isSubmitting, setIsSubmitting } = useFormContext();
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

    setIsSubmitting(true);

    try {
      // 1. Upload images to storage - use public folder as fallback if no dedicated bucket
      const imageUrls = [];
      
      for (let i = 0; i < formData.images.length; i++) {
        const image = formData.images[i];
        const fileName = `${user.id}-${Date.now()}-${i}`;
        
        // Try to use property-images bucket if it exists, otherwise use public bucket
        const bucketName = buckets.includes('property-images') ? 'property-images' : 'storage';
        const folderPath = buckets.includes('property-images') ? 'public' : `${user.id}/property-images`;
        
        try {
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(`${folderPath}/${fileName}`, image);

          if (error) throw error;
          
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`${folderPath}/${fileName}`);
          
          imageUrls.push(urlData.publicUrl);
        } catch (uploadError: any) {
          console.error('Image upload error:', uploadError);
          toast({
            title: "Upload Warning",
            description: `Failed to upload image ${i+1}. Continuing with other images.`,
            variant: "destructive",
          });
        }
      }

      if (imageUrls.length === 0 && formData.images.length > 0) {
        throw new Error("Failed to upload any images. Please try again.");
      }

      // 2. Upload documents to storage (if any)
      const documentData = [];
      
      for (let i = 0; i < formData.documents.length; i++) {
        const doc = formData.documents[i];
        const fileName = `${user.id}-${Date.now()}-${i}-${doc.name}`;
        
        // Try to use property-documents bucket if it exists, otherwise use regular storage
        const bucketName = buckets.includes('property-documents') ? 'property-documents' : 'storage';
        const folderPath = `${user.id}/documents`;
        
        try {
          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(`${folderPath}/${fileName}`, doc);

          if (error) throw error;
          
          documentData.push({
            name: doc.name,
            type: doc.type,
            size: doc.size,
            url: `${folderPath}/${fileName}`,
            bucket: bucketName
          });
        } catch (uploadError: any) {
          console.error('Document upload error:', uploadError);
          // Continue with other documents
        }
      }

      // 3. Insert the listing in the database
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
          <BasicDetails />
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
