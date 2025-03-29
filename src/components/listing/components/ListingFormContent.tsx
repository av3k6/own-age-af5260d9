
import React from "react";
import { useFormContext } from "../context/FormContext";
import FormProgress from "./FormProgress";
import BasicDetails from "../steps/BasicDetails";
import PropertyFeatures from "../steps/PropertyFeatures";
import MediaUpload from "../steps/MediaUpload";
import DocumentUpload from "../steps/DocumentUpload";
import ReviewAndPublish from "../steps/ReviewAndPublish";
import OptionalPropertyDetails from "./OptionalPropertyDetails";
import { usePublishListing } from "../hooks/usePublishListing";

const steps = [
  { id: "basic", title: "Basic Details", position: 1 },
  { id: "features", title: "Property Features", position: 2 },
  { id: "media", title: "Upload Photos", position: 3 },
  { id: "documents", title: "Upload Documents", position: 4 },
  { id: "review", title: "Review & Publish", position: 5 },
];

const ListingFormContent = () => {
  const { currentStep, setIsSubmitting } = useFormContext();
  const { isSubmitting, publishListing } = usePublishListing();

  // Update the form context with the submission state from our hook
  React.useEffect(() => {
    setIsSubmitting(isSubmitting);
  }, [isSubmitting, setIsSubmitting]);

  const handlePublish = async () => {
    const { formData } = useFormContext();
    await publishListing(formData);
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

export default ListingFormContent;
