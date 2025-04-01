
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

export function useMessageInitialization(fetchConversations: () => Promise<void>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize conversations list on component mount
  useEffect(() => {
    const initializeMessages = async () => {
      if (!user) {
        console.log("User not available for message initialization");
        return;
      }
      
      try {
        console.log("Initializing messages system for user:", user.id);
        await fetchConversations();
        setIsInitialized(true);
        setError(null);
      } catch (error) {
        console.error("Error initializing conversations:", error);
        toast.error("Error loading messages", {
          description: "Please try refreshing the page"
        });
        // Still mark as initialized to prevent infinite loading state
        setIsInitialized(true);
        setError("Could not load your conversations. Please try again later.");
      }
    };
    
    if (user) {
      initializeMessages();
    }
  }, [user?.id, fetchConversations]);

  return { isInitialized, error, setError };
}
