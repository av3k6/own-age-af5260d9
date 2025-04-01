
import { useMessagingCore } from "./core/useMessagingCore";
import { useConversationSubscriptions } from "./subscriptions/useConversationSubscriptions";
import { useConversationHandlers } from "./handlers/useConversationHandlers";
import { useMessagingActions } from "./actions/useMessagingActions";
import { Conversation } from "@/types/message";

export function useMessaging() {
  const {
    loading,
    deleting,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessagesBase,
    sendMessageBase,
    markMessagesAsRead,
    deleteConversation,
    setCurrentConversation,
    createConversation,
    toast,
    supabase,
    user
  } = useMessagingCore();

  // Set up real-time subscriptions
  useConversationSubscriptions(user, supabase, fetchConversations);

  // Set up conversation handlers
  useConversationHandlers({
    user,
    currentConversation,
    fetchConversations,
    fetchMessagesBase,
    toast
  });

  // Set up messaging actions
  const {
    handleSelectConversation,
    handleSendMessage,
    handleDeleteConversation,
    handleCreateConversation
  } = useMessagingActions({
    fetchMessagesBase,
    sendMessageBase,
    deleteConversation,
    createConversation,
    fetchConversations,
    markMessagesAsRead,
    setCurrentConversation,
    toast
  });

  return {
    loading,
    deleting,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages: handleSelectConversation,
    sendMessage: handleSendMessage,
    deleteConversation: handleDeleteConversation,
    createConversation: handleCreateConversation,
    setCurrentConversation,
  };
}
