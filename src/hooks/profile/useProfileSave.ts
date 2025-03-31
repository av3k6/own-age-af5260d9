
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { UserProfileData } from "@/types/profile";

export const useProfileSave = (
  user: User | null, 
  profileData: UserProfileData,
  setIsEditing: (value: boolean) => void
) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Starting profile save...");
    console.log("Current user:", user);
    setIsLoading(true);
    
    try {
      // Create the metadata object from profileData
      const metadataUpdate = { 
        data: { 
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
        }
      };
      
      console.log("Updating user with metadata:", metadataUpdate);
      
      const { error, data } = await supabase.auth.updateUser(metadataUpdate);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }

      console.log("Profile update response:", data);
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // We only change editing state after the update is fully complete
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
      console.log("Profile save completed, loading state set to false");
    }
  };

  return {
    isLoading,
    handleSaveProfile
  };
};
