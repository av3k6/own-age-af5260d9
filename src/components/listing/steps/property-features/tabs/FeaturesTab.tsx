
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useFormContext } from "../../../context/FormContext";
import { commonPropertyFeatures } from "../utils/propertyFeatures";
import { FeatureCheckbox } from "../components/FeatureCheckbox";
import { CustomFeatureInput } from "../components/CustomFeatureInput";
import { FeatureTags } from "../components/FeatureTags";
import { AdditionalPropertyInfo } from "../components/AdditionalPropertyInfo";

const FeaturesTab = () => {
  const { formData, updateFormData } = useFormContext();

  const toggleFeature = (feature: string) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    updateFormData({ features: updatedFeatures });
  };

  const addCustomFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      updateFormData({ features: [...formData.features, feature] });
    }
  };

  const updateRoomDetails = (details: any) => {
    updateFormData({ 
      roomDetails: { 
        ...formData.roomDetails, 
        ...details 
      } 
    });
  };

  return (
    <>
      <div className="space-y-4">
        <Label>Property Features</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {commonPropertyFeatures.map((feature) => (
            <FeatureCheckbox
              key={feature.id}
              id={feature.id}
              label={feature.label}
              checked={formData.features.includes(feature.label)}
              onToggle={() => toggleFeature(feature.label)}
            />
          ))}
        </div>
      </div>

      <CustomFeatureInput onAddFeature={addCustomFeature} />

      {formData.features.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Features</Label>
          <FeatureTags 
            features={formData.features} 
            onRemove={toggleFeature} 
          />
        </div>
      )}
      
      <AdditionalPropertyInfo 
        roomDetails={formData.roomDetails}
        updateRoomDetails={updateRoomDetails}
      />
    </>
  );
};

export default FeaturesTab;
