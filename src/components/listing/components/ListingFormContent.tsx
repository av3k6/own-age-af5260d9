
import React from "react";
import { useFormContext } from "../context/FormContext";
import FormProgress from "./FormProgress";
import { usePublishListing } from "../hooks/usePublishListing";
import StepContent from "./StepContent";
import { formSteps } from "../constants/formSteps";

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
      <FormProgress currentStep={currentStep} steps={formSteps} />
      
      <div className="p-6">
        <StepContent currentStep={currentStep} onPublish={handlePublish} />
      </div>
    </div>
  );
};

export default ListingFormContent;
