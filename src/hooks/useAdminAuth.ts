
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AdminProfile {
  username: string;
  email: string;
}

export const useAdminAuth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Special admin login
  const loginAsAdmin = async (username: string, password: string) => {
    if (username !== "jredmond" || password !== "redron357") {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);

    try {
      // Set admin session in localStorage with proper expiration
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours from now
      
      const adminSession = {
        authenticated: true,
        username: username,
        email: "admin@redmondgroup.ca", // Default email
        isAdmin: true,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        twoFactorEnabled: false,
        twoFactorSecret: null
      };
      
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome back, admin!",
      });

      navigate("/admin/dashboard");
      return true;
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if admin is authenticated
  const checkAdminAuth = () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession = JSON.parse(adminSessionStr);
      const now = new Date();
      const expiresAt = new Date(adminSession.expiresAt);
      
      // Check if session has expired
      if (now > expiresAt) {
        localStorage.removeItem("admin_session");
        return false;
      }
      
      return adminSession.authenticated && adminSession.isAdmin;
    } catch (error) {
      return false;
    }
  };

  // Logout admin
  const logoutAdmin = () => {
    localStorage.removeItem("admin_session");
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel",
    });
    navigate("/admin/login");
  };
  
  // Get admin data from localStorage
  const getAdminData = () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return null;
      
      const adminSession = JSON.parse(adminSessionStr);
      return {
        username: adminSession.username,
        email: adminSession.email || "admin@redmondgroup.ca",
      };
    } catch (error) {
      return null;
    }
  };
  
  // Update admin profile
  const updateAdminProfile = async (profile: AdminProfile) => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession = JSON.parse(adminSessionStr);
      
      // Update profile data
      adminSession.username = profile.username;
      adminSession.email = profile.email;
      
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
      return true;
    } catch (error) {
      console.error("Error updating admin profile:", error);
      return false;
    }
  };
  
  // Reset admin password
  const resetAdminPassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Verify current password is correct
      if (currentPassword !== "redron357") {
        return false;
      }
      
      // In a real app, we would update the password in the backend
      // Here we're just simulating a successful password change
      return true;
    } catch (error) {
      console.error("Error resetting admin password:", error);
      return false;
    }
  };
  
  // Check if 2FA is enabled
  const is2FAEnabled = () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession = JSON.parse(adminSessionStr);
      return adminSession.twoFactorEnabled || false;
    } catch (error) {
      return false;
    }
  };
  
  // Get 2FA secret
  const getTwoFactorSecret = () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return null;
      
      const adminSession = JSON.parse(adminSessionStr);
      return adminSession.twoFactorSecret;
    } catch (error) {
      return null;
    }
  };
  
  // Set up 2FA
  const setup2FA = async () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return null;
      
      const adminSession = JSON.parse(adminSessionStr);
      
      // Generate a mock secret key
      // In a real app, this would be a proper TOTP secret
      const mockSecret = "JBSWY3DPEHPK3PXP";
      
      // Store the secret temporarily (not enabled yet until verified)
      adminSession.twoFactorSecret = mockSecret;
      
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
      return mockSecret;
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      return null;
    }
  };
  
  // Verify 2FA code and enable 2FA if valid
  const verify2FA = async (code: string) => {
    try {
      // In a real app, this would validate the TOTP code against the secret
      // For this demo, we'll accept any 6-digit code
      if (code.length !== 6 || !/^\d+$/.test(code)) {
        return false;
      }
      
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession = JSON.parse(adminSessionStr);
      
      // Enable 2FA
      adminSession.twoFactorEnabled = true;
      
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
      return true;
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      return false;
    }
  };
  
  // Disable 2FA
  const disable2FA = async () => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession = JSON.parse(adminSessionStr);
      
      // Disable 2FA
      adminSession.twoFactorEnabled = false;
      adminSession.twoFactorSecret = null;
      
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
      return true;
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      return false;
    }
  };

  return {
    loginAsAdmin,
    checkAdminAuth,
    logoutAdmin,
    getAdminData,
    updateAdminProfile,
    resetAdminPassword,
    is2FAEnabled,
    getTwoFactorSecret,
    setup2FA,
    verify2FA,
    disable2FA,
    isLoading
  };
};
