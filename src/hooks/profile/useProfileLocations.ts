
import { useState } from "react";
import { UserProfileData } from "@/types/profile";

export const useProfileLocations = (
  profileData: UserProfileData,
  setProfileData: (data: UserProfileData) => void
) => {
  const [newLocation, setNewLocation] = useState("");

  const addPreferredLocation = () => {
    if (newLocation && !profileData.preferredLocations.includes(newLocation)) {
      setProfileData({
        ...profileData,
        preferredLocations: [...profileData.preferredLocations, newLocation]
      });
      setNewLocation("");
    }
  };

  const removePreferredLocation = (location: string) => {
    setProfileData({
      ...profileData,
      preferredLocations: profileData.preferredLocations.filter(loc => loc !== location)
    });
  };

  return {
    newLocation,
    setNewLocation,
    addPreferredLocation,
    removePreferredLocation
  };
};
