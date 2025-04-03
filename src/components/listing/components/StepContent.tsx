
import React from "react";
import { useFormContext } from "../context/FormContext";
import BasicDetails from "../steps/BasicDetails";
import PropertyFeatures from "../steps/PropertyFeatures";
import MediaUpload from "../steps/MediaUpload";
import DocumentUpload from "../steps/DocumentUpload";
import ReviewAndPublish from "../steps/ReviewAndPublish";
import OptionalPropertyDetails from "./OptionalPropertyDetails";

interface StepContentProps {
  currentStep: string;
  onPublish: () => Promise<void>;
  isSubmitting: boolean;
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, onPublish, isSubmitting }) => {
  return (
    <>
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
        <ReviewAndPublish onPublish={onPublish} isSubmitting={isSubmitting} />
      )}
    </>
  );
};

export default StepContent;
