
import React from "react";
import { useBusinessProfileForm } from "@/hooks/useBusinessProfileForm";
import BusinessProfileLoading from "./BusinessProfileLoading";
import NoBusinessAssigned from "./NoBusinessAssigned";
import BusinessProfileForm from "./BusinessProfileForm";

const EditBusinessProfile: React.FC = () => {
  const { 
    formData,
    isLoading,
    isSaving,
    assignedBusiness,
    handleInputChange,
    handleSaveChanges
  } = useBusinessProfileForm();

  if (isLoading) {
    return <BusinessProfileLoading />;
  }

  if (!assignedBusiness) {
    return <NoBusinessAssigned />;
  }

  return (
    <div className="container py-10">
      <BusinessProfileForm
        formData={formData}
        isSaving={isSaving}
        assignedBusiness={assignedBusiness}
        onInputChange={handleInputChange}
        onSaveChanges={handleSaveChanges}
      />
    </div>
  );
};

export default EditBusinessProfile;
