
import { useToast } from "@/hooks/use-toast";
import { 
  getAdminSessionFromStorage, 
  saveAdminSessionToStorage 
} from "@/utils/adminSessionUtils";

export const useAdminSecurity = () => {
  const { toast } = useToast();

  const resetAdminPassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (currentPassword !== "redron357") {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error resetting admin password:", error);
      return false;
    }
  };
  
  const is2FAEnabled = () => {
    try {
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return false;
      
      return adminSession.twoFactorEnabled || false;
    } catch (error) {
      console.error("Error checking 2FA status:", error);
      return false;
    }
  };
  
  const getTwoFactorSecret = () => {
    try {
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return null;
      
      return adminSession.twoFactorSecret;
    } catch (error) {
      console.error("Error getting 2FA secret:", error);
      return null;
    }
  };
  
  const setup2FA = async () => {
    try {
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return null;
      
      const mockSecret = "JBSWY3DPEHPK3PXP";
      
      adminSession.twoFactorSecret = mockSecret;
      
      saveAdminSessionToStorage(adminSession);
      return mockSecret;
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      return null;
    }
  };
  
  const verify2FA = async (code: string) => {
    try {
      if (code.length !== 6 || !/^\d+$/.test(code)) {
        return false;
      }
      
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return false;
      
      adminSession.twoFactorEnabled = true;
      
      saveAdminSessionToStorage(adminSession);
      return true;
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      return false;
    }
  };
  
  const disable2FA = async () => {
    try {
      const adminSession = getAdminSessionFromStorage();
      if (!adminSession) return false;
      
      adminSession.twoFactorEnabled = false;
      adminSession.twoFactorSecret = null;
      
      saveAdminSessionToStorage(adminSession);
      return true;
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      return false;
    }
  };

  return {
    resetAdminPassword,
    is2FAEnabled,
    getTwoFactorSecret,
    setup2FA,
    verify2FA,
    disable2FA
  };
};
