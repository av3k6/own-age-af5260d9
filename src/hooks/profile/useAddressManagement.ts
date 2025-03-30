
import { UserAddress, UserProfileData } from "@/types/profile";

export const useAddressManagement = (
  profileData: UserProfileData,
  setProfileData: (data: UserProfileData) => void
) => {
  const updateAddress = (field: keyof UserAddress, value: string) => {
    setProfileData({
      ...profileData,
      address: {
        ...profileData.address,
        [field]: value
      }
    });
  };

  return {
    address: profileData.address,
    updateAddress
  };
};
