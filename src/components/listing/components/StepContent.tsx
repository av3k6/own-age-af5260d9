
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
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, onPublish }) => {
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
        <ReviewAndPublish onPublish={onPublish} />
      )}
    </>
  );
};

export default StepContent;
