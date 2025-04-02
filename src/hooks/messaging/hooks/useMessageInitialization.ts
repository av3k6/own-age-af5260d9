
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MessageInitializationState {
  isInitialized: boolean;
  error: Error | null;
}

export function useMessageInitialization(
  fetchConversations: () => Promise<void>
) {
  const [state, setState] = useState<MessageInitializationState>({
    isInitialized: false,
    error: null,
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("Initializing messages...");
        await fetchConversations();
        setState({ isInitialized: true, error: null });
      } catch (error) {
        console.error("Error initializing messages:", error);
        setState({ isInitialized: true, error: error as Error });
        
        // Show toast with error message
        toast.error("Unable to load messages", {
          description: "Please check your connection and try again later",
          duration: 5000,
        });
      }
    };

    initialize();
  }, [fetchConversations]);

  return state;
}
