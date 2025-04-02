
import { useToast } from "@/hooks/use-toast";
import { 
  getAdminSessionFromStorage, 
  saveAdminSessionToStorage 
} from "@/utils/adminSessionUtils";
import { AdminProfile } from "@/types/admin";

export const useAdminProfile = () => {
  const { toast } = useToast();

  const getAdminData = () => {
    try {
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return null;
      
      return {
        username: adminSession.username,
        email: adminSession.email || "admin@redmondgroup.ca",
      };
    } catch (error) {
      console.error("Error getting admin data:", error);
      return null;
    }
  };
  
  const updateAdminProfile = async (profile: AdminProfile) => {
    try {
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return false;
      
      adminSession.username = profile.username;
      adminSession.email = profile.email;
      
      saveAdminSessionToStorage(adminSession);
      return true;
    } catch (error) {
      console.error("Error updating admin profile:", error);
      return false;
    }
  };
  
  return {
    getAdminData,
    updateAdminProfile
  };
};
