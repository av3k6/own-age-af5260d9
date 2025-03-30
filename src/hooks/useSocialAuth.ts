
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/useSupabase";

export type SocialProvider = "google" | "facebook";

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSocialSignIn = async (provider: SocialProvider) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || `Failed to sign in with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSocialSignIn,
  };
};
