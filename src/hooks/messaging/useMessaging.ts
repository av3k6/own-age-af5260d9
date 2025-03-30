
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

  // Initialize conversations list on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

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

  // Wrapper for sending a message that also handles refreshing the conversation list
  const handleSendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    console.log(`Sending message to conversation ${conversationId}: ${content}`);
    try {
      await sendMessage(conversationId, content, attachments);
      
      // Refresh the messages for this conversation
      await fetchMessages(conversationId);
      
      // Refresh the conversation list to show the updated last message
      await fetchConversations();
      
      return true;
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      throw error;
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
        return null;
      }
      
      console.log("Conversation created:", conversation);
      
      // If there's an initial message, send it
      if (conversation && initialMessage) {
        console.log("Sending initial message:", initialMessage);
        await sendMessage(conversation.id, initialMessage);
        
        // Refresh conversations after sending the message
        await fetchConversations();
      }
      
      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  };

  return {
    loading,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages: handleSelectConversation,
    sendMessage: handleSendMessage,
    createConversation: handleCreateConversation,
    setCurrentConversation,
  };
}
