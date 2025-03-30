
import { useState } from "react";
import { UserProfileData } from "@/types/profile";

export const usePropertyPreferences = (
  profileData: UserProfileData,
  setProfileData: (data: UserProfileData) => void
) => {
  const [newPropertyType, setNewPropertyType] = useState("");

  const addPropertyTypePreference = () => {
    if (newPropertyType && !profileData.propertyTypePreferences.includes(newPropertyType)) {
      setProfileData({
        ...profileData,
        propertyTypePreferences: [...profileData.propertyTypePreferences, newPropertyType]
      });
      setNewPropertyType("");
    }
  };

  const removePropertyTypePreference = (type: string) => {
    setProfileData({
      ...profileData,
      propertyTypePreferences: profileData.propertyTypePreferences.filter(t => t !== type)
    });
  };

  return {
    newPropertyType,
    setNewPropertyType,
    addPropertyTypePreference,
    removePropertyTypePreference
  };
};
