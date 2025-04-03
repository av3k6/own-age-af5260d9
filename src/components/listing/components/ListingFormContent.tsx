
import React from 'react';
import { useFormContext } from '../context/FormContext';
import BasicDetails from '../steps/BasicDetails';
import PropertyFeatures from '../steps/PropertyFeatures';
import MediaUpload from '../steps/MediaUpload';
import DocumentUpload from '../steps/DocumentUpload';
import ReviewAndPublish from '../steps/review/ReviewAndPublish';
import { usePublishListing } from '@/hooks/listing/usePublishListing';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '@/utils/logger';

const logger = createLogger('ListingFormContent');

export const ListingFormContent = () => {
  const { currentStep, formData } = useFormContext();
  const { publishListing, isSubmitting } = usePublishListing();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!formData) return;
    
    // Generate a property ID ahead of time to ensure consistency
    const propertyId = uuidv4();
    logger.info(`Generated new property ID for listing: ${propertyId}`);

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
      features: Array.isArray(formData.features) 
        ? formData.features 
        : typeof formData.features === 'string' && (formData.features as string).trim() !== ''
          ? (formData.features as string).split(',').map(f => f.trim())
          : []
    };
    
    const listingId = await publishListing(publishData);
    
    if (listingId) {
      logger.info(`Successfully published listing with ID: ${listingId}`);
      toast({
        title: "Success",
        description: "Your property has been published successfully!",
      });
      // Navigate to the actual property page using the returned listing ID
      navigate(`/property/${listingId}`);
    } else {
      logger.error("Failed to publish listing");
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
