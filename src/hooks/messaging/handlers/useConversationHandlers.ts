
import { useEffect } from "react";
import { Conversation } from "@/types/message";
import { ToastApi } from "@/components/ui/use-toast";

export function useConversationHandlers({
  user,
  currentConversation,
  fetchConversations,
  fetchMessagesBase,
  toast
}: {
  user: any;
  currentConversation: Conversation | null;
  fetchConversations: () => Promise<void>;
  fetchMessagesBase: (conversationId: string) => Promise<void>;
  toast: ToastApi;
}) {
  // Initialize conversations list on component mount
  useEffect(() => {
    const initializeMessages = async () => {
      try {
        // Just fetch conversations - don't try to create tables
        await fetchConversations();
      } catch (error) {
        console.error("Error initializing conversations:", error);
        toast({
          title: "Error loading messages",
          description: "Please try again later",
          variant: "destructive"
        });
      }
    };
    
    if (user) {
      initializeMessages();
    }
  }, [user]);

  // Fetch messages when currentConversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessagesBase(currentConversation.id).catch(error => {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "We couldn't load your messages. Please try again later.",
          variant: "destructive"
        });
      });
    }
  }, [currentConversation?.id]);
}
