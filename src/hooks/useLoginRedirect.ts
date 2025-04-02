
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/types";

export function useLoginRedirect(
  user: User | null,
  isInitialized: boolean
) {
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleRedirect = useCallback(() => {
    if (user) {
      setRedirecting(true);
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("User authenticated, redirecting to:", from);
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 300);
    }
  }, [user, navigate, location.state]);
  
  useEffect(() => {
    if (isInitialized && user && !redirecting) {
      handleRedirect();
    }
  }, [user, isInitialized, handleRedirect, redirecting]);

  return { redirecting, setRedirecting };
}
