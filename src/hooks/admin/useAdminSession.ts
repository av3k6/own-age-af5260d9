
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  isAdminSessionValid,
  removeAdminSessionFromStorage
} from "@/utils/adminSessionUtils";

export const useAdminSession = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAdminAuth = () => {
    return isAdminSessionValid();
  };

  const logoutAdmin = () => {
    removeAdminSessionFromStorage();
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel",
    });
    navigate("/admin/login");
  };

  return {
    checkAdminAuth,
    logoutAdmin
  };
};
