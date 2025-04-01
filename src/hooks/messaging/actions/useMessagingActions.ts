
import { Conversation } from "@/types/message";
import { ToastApi } from "@/components/ui/use-toast";

export function useMessagingActions({
  fetchMessagesBase,
  sendMessageBase,
  deleteConversation,
  createConversation,
  fetchConversations,
  markMessagesAsRead,
  setCurrentConversation,
  toast
}: {
  fetchMessagesBase: (conversationId: string) => Promise<void>;
  sendMessageBase: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<boolean>;
  createConversation: (receiverId: string, subject?: string, initialMessage?: string, propertyId?: string) => Promise<Conversation | null>;
  fetchConversations: () => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  toast: ToastApi;
}) {
  // Handle conversation selection with messages fetching
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessagesBase(conversation.id).catch(error => {
      console.error("Error fetching messages for conversation:", error);
      toast({
        title: "Error loading messages",
        description: "We couldn't load your messages. Please try again later.",
        variant: "destructive"
      });
    });
    
    // Mark messages as read when selecting a conversation
    if (conversation.unreadCount > 0) {
      markMessagesAsRead(conversation.id);
    }
  };

  // Wrapper for sending a message that also handles refreshing the conversation list
  const handleSendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    console.log(`Sending message to conversation ${conversationId}: ${content}`);
    try {
      await sendMessageBase(conversationId, content, attachments);
      
      // Refresh the messages for this conversation
      await fetchMessagesBase(conversationId);
      
      // Refresh the conversation list to show the updated last message
      await fetchConversations();
      
      return true;
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Wrapper for conversation deletion
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      // If the conversation being deleted is the current one, clear it
      if (setCurrentConversation) {
        setCurrentConversation(null);
      }

      await deleteConversation(conversationId);
      
      return true;
    } catch (error) {
      console.error("Error in handleDeleteConversation:", error);
      toast({
        title: "Error deleting conversation",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Wrapper for creating a conversation with an optional initial message
  const handleCreateConversation = async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ) => {
    console.log("Creating new conversation:", { receiverId, subject, initialMessage, propertyId });
    try {
      // First create the conversation
      const conversation = await createConversation(receiverId, subject, initialMessage, propertyId);
      
      if (!conversation) {
        console.error("Failed to create conversation");
        toast({
          title: "Error creating conversation",
          description: "Please try again later.",
          variant: "destructive"
        });
        return null;
      }
      
      console.log("Conversation created:", conversation);
      
      // If there's an initial message, send it
      if (conversation && initialMessage) {
        console.log("Sending initial message:", initialMessage);
        try {
          await sendMessageBase(conversation.id, initialMessage);
          
          // Refresh conversations after sending the message
          await fetchConversations();
        } catch (messageError) {
          console.error("Error sending initial message:", messageError);
          // Continue even if message fails - at least the conversation was created
        }
      }
      
      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error creating conversation",
        description: "Please try again later.",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    handleSelectConversation,
    handleSendMessage,
    handleDeleteConversation,
    handleCreateConversation
  };
}
