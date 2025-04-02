
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { saveAdminSessionToStorage } from "@/utils/adminSessionUtils";
import { AdminSession } from "@/types/admin";

export const useAdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 hours from now
      
      const adminSession: AdminSession = {
        authenticated: true,
        username: username,
        email: "admin@redmondgroup.ca", // Default email
        isAdmin: true,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        twoFactorEnabled: false,
        twoFactorSecret: null
      };
      
      saveAdminSessionToStorage(adminSession);
      
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

  return {
    loginAsAdmin,
    isLoading
  };
};
