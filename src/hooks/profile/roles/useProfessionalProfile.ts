
import { UserProfileData } from "@/types/profile";

export const useProfessionalProfile = (
  profileData: UserProfileData,
  setProfileData: (data: UserProfileData) => void
) => {
  const updateServiceType = (value: string) => {
    setProfileData({
      ...profileData,
      serviceType: value
    });
  };

  const updateCompanyName = (value: string) => {
    setProfileData({
      ...profileData,
      companyName: value
    });
  };

  const updateLicenseNumber = (value: string) => {
    setProfileData({
      ...profileData,
      licenseNumber: value
    });
  };

  return {
    serviceType: profileData.serviceType,
    companyName: profileData.companyName,
    licenseNumber: profileData.licenseNumber,
    updateServiceType,
    updateCompanyName,
    updateLicenseNumber
  };
};
