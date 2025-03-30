
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { UserProfileData } from "@/types/profile";

export const useProfileData = (user: User | null) => {
  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: "",
    phone: "",
    bio: "",
    role: "buyer",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
      country: "Canada",
    },
    preferredLocations: [],
    budgetMin: 0,
    budgetMax: 1000000,
    propertyTypePreferences: [],
    serviceType: "",
    companyName: "",
    licenseNumber: "",
  });

  // Load user data when the component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("Loading user data from metadata:", user.user_metadata);
      
      setProfileData({
        fullName: user.user_metadata?.full_name || "",
        phone: user.user_metadata?.phone || "",
        bio: user.user_metadata?.bio || "",
        role: user.user_metadata?.role || "buyer",
        address: {
          street: user.user_metadata?.address?.street || "",
          city: user.user_metadata?.address?.city || "",
          province: user.user_metadata?.address?.province || "",
          postalCode: user.user_metadata?.address?.postalCode || "",
          country: user.user_metadata?.address?.country || "Canada",
        },
        preferredLocations: user.user_metadata?.preferredLocations || [],
        budgetMin: user.user_metadata?.budgetRange?.min || 0,
        budgetMax: user.user_metadata?.budgetRange?.max || 1000000,
        propertyTypePreferences: user.user_metadata?.propertyTypePreferences || [],
        serviceType: user.user_metadata?.serviceType || "",
        companyName: user.user_metadata?.companyName || "",
        licenseNumber: user.user_metadata?.licenseNumber || "",
      });
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);

  return {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing
  };
};
