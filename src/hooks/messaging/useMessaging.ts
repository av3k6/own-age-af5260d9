
import { useState, useEffect } from "react";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";
import { Conversation } from "@/types/message";

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
    fetchMessages,
    sendMessage,
    markMessagesAsRead
  } = useMessages();

  // Combine loading states
  const loading = conversationsLoading || messagesLoading;

  // Fetch messages when currentConversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    }
  }, [currentConversation?.id]);

  // Handle conversation selection with messages fetching
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation.id);
  };

  // Wrapper for sending a message that also handles initial message in new conversations
  const handleSendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    await sendMessage(conversationId, content, attachments);
    
    // If this was a newly created conversation and there was an initial message
    if (currentConversation && currentConversation.id === conversationId) {
      // Refresh the conversation list to show the updated last message
      fetchConversations();
    }
  };

  // Wrapper for creating a conversation with an optional initial message
  const handleCreateConversation = async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ) => {
    const conversation = await createConversation(receiverId, subject, initialMessage, propertyId);
    
    // If conversation was created and there's an initial message, send it
    if (conversation && initialMessage) {
      await sendMessage(conversation.id, initialMessage);
    }
    
    return conversation;
  };

  return {
    loading,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages: handleSelectConversation, // Renamed for better semantics
    sendMessage: handleSendMessage,
    createConversation: handleCreateConversation,
    setCurrentConversation,
  };
}
