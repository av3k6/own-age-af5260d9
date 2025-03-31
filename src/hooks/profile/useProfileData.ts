
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { UserProfileData } from "@/types/profile";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/components/ui/use-toast";

export const useProfileData = (user: User | null) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
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
    const loadUserProfile = async () => {
      if (!user?.id) {
        console.log("No user ID available, skipping profile load");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log("Loading user data for ID:", user.id);

      try {
        // First try to get the user's metadata from auth
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user data:", userError);
          toast({
            title: "Error",
            description: "Failed to load your profile data",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const userMetadata = userData?.user?.user_metadata;
        console.log("Fetched user metadata:", userMetadata);
        
        // Update profile with metadata if available
        setProfileData({
          fullName: userMetadata?.full_name || "",
          phone: userMetadata?.phone || "",
          bio: userMetadata?.bio || "",
          role: userMetadata?.role || "buyer",
          address: {
            street: userMetadata?.address?.street || "",
            city: userMetadata?.address?.city || "",
            province: userMetadata?.address?.province || "",
            postalCode: userMetadata?.address?.postalCode || "",
            country: userMetadata?.address?.country || "Canada",
          },
          preferredLocations: userMetadata?.preferredLocations || [],
          budgetMin: userMetadata?.budgetRange?.min || 0,
          budgetMax: userMetadata?.budgetRange?.max || 1000000,
          propertyTypePreferences: userMetadata?.propertyTypePreferences || [],
          serviceType: userMetadata?.serviceType || "",
          companyName: userMetadata?.companyName || "",
          licenseNumber: userMetadata?.licenseNumber || "",
        });
      } catch (error) {
        console.error("Error in loading user profile:", error);
        toast({
          title: "Error",
          description: "Something went wrong loading your profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [user, supabase, toast]);

  const [isEditing, setIsEditing] = useState(false);

  return {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    isLoading
  };
};
