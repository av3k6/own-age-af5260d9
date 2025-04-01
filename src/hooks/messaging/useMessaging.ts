
import { useConversations } from "./conversations/useConversations";
import { useMessages } from "./messages/useMessages";
import { useMessageInitialization } from "./hooks/useMessageInitialization";
import { useMessageSubscriptions } from "./hooks/useMessageSubscriptions";
import { useMessageOperations } from "./hooks/useMessageOperations";
import { useConversationCreation } from "./hooks/useConversationCreation";
import { useAuth } from "@/contexts/AuthContext";

export function useMessaging() {
  const {
    loading: conversationsLoading,
    conversations,
    fetchConversations,
    currentConversation,
    setCurrentConversation,
    createConversation
  } = useConversations();

  const {
    loading: messagesLoading,
    messages,
    fetchMessages: fetchMessagesBase,
    sendMessage: sendMessageBase,
    markMessagesAsRead
  } = useMessages();
  
  const { user } = useAuth();

  // Use the new initialization hook
  const { isInitialized, error } = useMessageInitialization(fetchConversations);

  // Use the new subscriptions hook
  useMessageSubscriptions(fetchConversations);

  // Use the new message operations hook
  const { fetchMessages, sendMessage } = useMessageOperations(
    fetchMessagesBase,
    fetchMessagesBase,
    markMessagesAsRead,
    sendMessageBase,
    fetchConversations,
    setCurrentConversation
  );

  // Use the new conversation creation hook
  const { createNewConversation } = useConversationCreation(
    createConversation,
    fetchConversations
  );

  // Combine loading states
  const loading = conversationsLoading || messagesLoading || !isInitialized;

  return {
    loading,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation: createNewConversation,
    setCurrentConversation,
    error
  };
}
