
import { useState } from "react";
import { UserProfileData } from "@/types/profile";
import { useProfileLocations } from "../useProfileLocations";
import { usePropertyPreferences } from "../usePropertyPreferences";

export const useBuyerProfile = (
  profileData: UserProfileData,
  setProfileData: (data: UserProfileData) => void
) => {
  const {
    newLocation,
    setNewLocation,
    addPreferredLocation,
    removePreferredLocation
  } = useProfileLocations(profileData, setProfileData);

  const {
    newPropertyType,
    setNewPropertyType,
    addPropertyTypePreference,
    removePropertyTypePreference
  } = usePropertyPreferences(profileData, setProfileData);

  const updateBudget = (field: 'budgetMin' | 'budgetMax', value: number) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  return {
    newLocation,
    setNewLocation,
    newPropertyType,
    setNewPropertyType,
    addPreferredLocation,
    removePreferredLocation,
    addPropertyTypePreference,
    removePropertyTypePreference,
    updateBudget
  };
};
