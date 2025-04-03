
import React from 'react';
import { useFormContext } from '../context/FormContext';
import BasicDetails from '../steps/BasicDetails';
import PropertyFeatures from '../steps/property-features';
import MediaUpload from '../steps/MediaUpload';
import DocumentUpload from '../steps/DocumentUpload';
import ReviewAndPublish from '../steps/review/ReviewAndPublish';
import { usePublishListing } from '@/hooks/listing/usePublishListing';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const ListingFormContent = () => {
  const { currentStep, formData } = useFormContext();
  const { publishListing, isSubmitting } = usePublishListing();
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!formData) return;

    // Convert File[] to string[] for backend storage
    // This ensures compatibility with the PublishListing function's expected type
    const imageUrls: string[] = formData.images 
      ? Array.isArray(formData.images) 
        ? formData.images.map(img => typeof img === 'string' ? img : URL.createObjectURL(img))
        : []
      : [];

    // Create a copy of the form data with converted image URLs
    const publishData = {
      ...formData,
      images: imageUrls,
      // Fix the TypeScript error by properly handling the features property
      features: Array.isArray(formData.features) 
        ? formData.features 
        : (typeof formData.features === 'string')
          ? formData.features.split(',').map((f: string) => f.trim())
          : []
    };
    
    const listingId = await publishListing(publishData);
    
    if (listingId) {
      toast({
        title: "Success",
        description: "Your property has been published successfully!",
      });
      navigate(`/property/${listingId}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "basic":
        return <BasicDetails />;
      case "features":
        return <PropertyFeatures />;
      case "media":
        return <MediaUpload />;
      case "documents":
        return <DocumentUpload />;
      case "review":
        return <ReviewAndPublish onPublish={handlePublish} isSubmitting={isSubmitting} />;
      default:
        return <BasicDetails />;
    }
  };

  return (
    <div className="w-full">
      {renderStepContent()}
    </div>
  );
};
