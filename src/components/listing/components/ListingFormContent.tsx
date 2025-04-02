
import React from "react";
import { useFormContext } from "../context/FormContext";
import FormProgress from "./FormProgress";
import StepContent from "./StepContent";
import { usePublishListing } from "@/hooks/listing/usePublishListing";
import { formSteps } from "../constants/formSteps";

const ListingFormContent = () => {
  const { currentStep, setIsSubmitting, formData } = useFormContext();
  const { isSubmitting, publishListing } = usePublishListing();

  // Update the form context with the submission state from our hook
  React.useEffect(() => {
    setIsSubmitting(isSubmitting);
  }, [isSubmitting, setIsSubmitting]);

  const handlePublish = async () => {
    // Instead of calling useFormContext inside the function,
    // we use the formData that we've already accessed at the component level
    await publishListing(formData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <FormProgress currentStep={currentStep} steps={formSteps} />
      
      <div className="p-6">
        <StepContent currentStep={currentStep} onPublish={handlePublish} />
      </div>
    </div>
  );
};

export default ListingFormContent;
