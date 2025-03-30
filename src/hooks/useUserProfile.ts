
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

export interface UserProfileData {
  fullName: string;
  phone: string;
  bio: string;
  role: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  preferredLocations: string[];
  budgetMin: number;
  budgetMax: number;
  propertyTypePreferences: string[];
  serviceType: string;
  companyName: string;
  licenseNumber: string;
}

export const useUserProfile = (user: User | null) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    fullName: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    bio: user?.user_metadata?.bio || "",
    role: user?.user_metadata?.role || "buyer",
    address: {
      street: user?.user_metadata?.address?.street || "",
      city: user?.user_metadata?.address?.city || "",
      province: user?.user_metadata?.address?.province || "",
      postalCode: user?.user_metadata?.address?.postalCode || "",
      country: user?.user_metadata?.address?.country || "Canada",
    },
    preferredLocations: user?.user_metadata?.preferredLocations || [],
    budgetMin: user?.user_metadata?.budgetRange?.min || 0,
    budgetMax: user?.user_metadata?.budgetRange?.max || 1000000,
    propertyTypePreferences: user?.user_metadata?.propertyTypePreferences || [],
    serviceType: user?.user_metadata?.serviceType || "",
    companyName: user?.user_metadata?.companyName || "",
    licenseNumber: user?.user_metadata?.licenseNumber || "",
  });

  const [newLocation, setNewLocation] = useState("");
  const [newPropertyType, setNewPropertyType] = useState("");

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

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Saving profile data:", profileData);
    setIsLoading(true);
    
    try {
      // Create the metadata object from profileData
      const metadataUpdate = { 
        full_name: profileData.fullName,
        phone: profileData.phone,
        bio: profileData.bio,
        role: profileData.role,
        address: profileData.address,
        preferredLocations: profileData.preferredLocations,
        budgetRange: {
          min: profileData.budgetMin,
          max: profileData.budgetMax
        },
        propertyTypePreferences: profileData.propertyTypePreferences,
        serviceType: profileData.serviceType,
        companyName: profileData.companyName,
        licenseNumber: profileData.licenseNumber
      };
      
      console.log("Updating user with metadata:", metadataUpdate);
      
      const { error, data } = await supabase.auth.updateUser({
        data: metadataUpdate
      });

      if (error) {
        console.error("Error updating profile:", error.message);
        throw error;
      }

      console.log("Profile update response:", data);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
