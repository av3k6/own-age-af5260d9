
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useAdminAuth = () => {
  const { toast } = useToast();
  const { signIn } = useAuth();
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
      // Here we're simulating an admin login
      // In a real app, this would authenticate against a proper backend with admin credentials
      const adminEmail = "jredmond@example.com"; // Hardcoded for demo purposes
      
      // Call the regular signIn but with the admin email
      const { error } = await signIn(adminEmail, password);
      
      if (error) {
        toast({
          title: "Login Error",
          description: error.message || "Failed to log in as admin",
          variant: "destructive",
        });
        return false;
      }

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
