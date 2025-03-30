
import { User } from "@supabase/supabase-js";
import { useProfileData } from "./profile/useProfileData";
import { useProfileSave } from "./profile/useProfileSave";
import { useBuyerProfile } from "./profile/roles/useBuyerProfile";
import { useSellerProfile } from "./profile/roles/useSellerProfile";
import { useProfessionalProfile } from "./profile/roles/useProfessionalProfile";
import { useAddressManagement } from "./profile/useAddressManagement";
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
    address,
    updateAddress
  } = useAddressManagement(profileData, setProfileData);

  // Use the appropriate role-specific hook based on user role
  const buyerProfileHooks = useBuyerProfile(profileData, setProfileData);
  const sellerProfileHooks = useSellerProfile(profileData, setProfileData);
  const professionalProfileHooks = useProfessionalProfile(profileData, setProfileData);

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
    address,
    updateAddress,
    handleSaveProfile,
    ...buyerProfileHooks,
    ...sellerProfileHooks,
    ...professionalProfileHooks
  };
};
