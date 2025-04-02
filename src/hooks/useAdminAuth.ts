
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
        isAdmin: true,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
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

  return {
    loginAsAdmin,
    checkAdminAuth,
    logoutAdmin,
    isLoading
  };
};
