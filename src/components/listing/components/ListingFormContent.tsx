
import React, { useContext } from 'react';
import { FormContext } from '../context/FormContext';
import { BasicDetails } from '../steps/BasicDetails';
import { PropertyFeatures } from '../steps/property-features';
import { MediaUpload } from '../steps/MediaUpload';
import { DocumentUpload } from '../steps/DocumentUpload';
import { ReviewAndPublish } from '../steps/review/ReviewAndPublish';
import { usePublishListing } from '@/hooks/listing/usePublishListing';
import { useNavigate } from 'react-router-dom';
import { ListingFormData } from '@/types/edit-listing';
import { toast } from '@/hooks/use-toast';

export const ListingFormContent = () => {
  const { currentStep, formData } = useContext(FormContext);
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
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : []
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
      case 0:
        return <BasicDetails />;
      case 1:
        return <PropertyFeatures />;
      case 2:
        return <MediaUpload />;
      case 3:
        return <DocumentUpload />;
      case 4:
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
