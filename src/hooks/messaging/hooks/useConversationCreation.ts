
import { useCallback } from "react";
import { toast } from "sonner";
import { Conversation } from "@/types/message";

export function useConversationCreation(
  createConversation: (
    receiverId: string,
    subject?: string,
    initialMessage?: string,
    propertyId?: string,
    category?: string
  ) => Promise<Conversation | null>,
  fetchConversations: () => Promise<void>
) {
  // Wrapper for creating a conversation with improved error handling
  const createNewConversation = useCallback(async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string,
    category: string = 'general'
  ) => {
    console.log("Creating new conversation:", { receiverId, subject, initialMessage, propertyId, category });
    
    try {
      // Create conversation with category information
      const conversation = await createConversation(receiverId, subject, initialMessage, propertyId);
      
      if (!conversation) {
        console.error("Failed to create conversation");
        toast.error("Error creating conversation", {
          description: "Please try again later."
        });
        return null;
      }
      
      console.log("Conversation created:", conversation);
      
      // Refresh conversations after creating a new one
      await fetchConversations();
      
      toast.success("Conversation created", {
        description: "New conversation started successfully"
      });
      
      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Error creating conversation", {
        description: "Please try again later."
      });
      return null;
    }
  }, [createConversation, fetchConversations]);

  return { createNewConversation };
}
