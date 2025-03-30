
import { User } from "@supabase/supabase-js";
import { useProfileData } from "./profile/useProfileData";
import { useProfileLocations } from "./profile/useProfileLocations";
import { usePropertyPreferences } from "./profile/usePropertyPreferences";
import { useProfileSave } from "./profile/useProfileSave";
import { UserProfileData } from "@/types/profile";

export type { UserProfileData } from "@/types/profile";

export const useUserProfile = (user: User | null) => {
  const { 
    profileData, 
    setProfileData,
    isEditing,
    setIsEditing
  } = useProfileData(user);

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

  const {
    isLoading,
    handleSaveProfile
  } = useProfileSave(user, profileData, setIsEditing);

  return {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    isLoading,
    newLocation,
    setNewLocation,
    newPropertyType,
    setNewPropertyType,
    addPreferredLocation,
    removePreferredLocation,
    addPropertyTypePreference,
    removePropertyTypePreference,
    handleSaveProfile
  };
};
