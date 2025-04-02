
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { User } from "lucide-react";
import { AdminProfile } from "@/types/admin";
import ProfileForm from "./ProfileForm";

const AdminAccountSettings = () => {
  const { toast } = useToast();
  const { updateAdminProfile, getAdminData } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get admin data
  const adminData = getAdminData();

  const handleSubmit = async (data: { username: string; email: string }) => {
    setIsLoading(true);
    try {
      // Ensure we pass complete AdminProfile object with required fields
      const profileData: AdminProfile = {
        username: data.username,
        email: data.email,
      };
      
      const success = await updateAdminProfile(profileData);
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your admin profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "There was a problem updating your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Admin Account Settings
        </CardTitle>
        <CardDescription>
          Update your admin profile information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm 
          initialData={adminData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default AdminAccountSettings;
