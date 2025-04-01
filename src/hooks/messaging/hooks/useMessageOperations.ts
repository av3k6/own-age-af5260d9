
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Conversation } from "@/types/message";

export function useMessageOperations(
  fetchMessages: (conversationId: string) => Promise<void>,
  fetchMessagesBase: (conversationId: string) => Promise<void>,
  markMessagesAsRead: (conversationId: string) => Promise<void>,
  sendMessageBase: (conversationId: string, content: string, attachments?: File[]) => Promise<void>,
  fetchConversations: () => Promise<void>,
  setCurrentConversation: (conversation: Conversation | null) => void
) {
  // Wrapper for fetching messages with retry mechanism
  const handleFetchMessages = useCallback(async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    
    const attemptFetch = async (retries = 2) => {
      try {
        console.log(`Fetching messages for conversation: ${conversation.id}`);
        await fetchMessagesBase(conversation.id);
        
        // Mark messages as read when selecting a conversation
        if (conversation.unreadCount > 0) {
          await markMessagesAsRead(conversation.id);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        
        if (retries > 0) {
          console.log(`Retrying fetch (${retries} attempts left)...`);
          setTimeout(() => attemptFetch(retries - 1), 1000);
        } else {
          toast.error("Error loading messages", {
            description: "We couldn't load your messages. Please try again later."
          });
        }
      }
    };
    
    await attemptFetch();
  }, [fetchMessagesBase, markMessagesAsRead, setCurrentConversation]);

  // Wrapper for sending a message with improved error handling and retries
  const handleSendMessage = useCallback(async (conversationId: string, content: string, attachments?: File[]) => {
    console.log(`Sending message to conversation ${conversationId}: ${content.substring(0, 20)}...`);
    
    const attemptSend = async (retries = 2) => {
      try {
        await sendMessageBase(conversationId, content, attachments);
        
        // Refresh the messages for this conversation
        await fetchMessagesBase(conversationId);
        
        // Refresh the conversation list to show the updated last message
        await fetchConversations();
        
        toast.success("Message sent", {
          description: "Your message has been sent successfully"
        });
        
        return true;
      } catch (error) {
        console.error("Error sending message:", error);
        
        if (retries > 0) {
          console.log(`Retrying send (${retries} attempts left)...`);
          // Wait a second before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return attemptSend(retries - 1);
        } else {
          toast.error("Error sending message", {
            description: "Please try again later."
          });
          throw error;
        }
      }
    };
    
    return attemptSend();
  }, [fetchConversations, fetchMessagesBase, sendMessageBase]);

  return {
    fetchMessages: handleFetchMessages,
    sendMessage: handleSendMessage
  };
}
