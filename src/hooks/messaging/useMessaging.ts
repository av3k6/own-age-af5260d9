
import { useState, useEffect } from "react";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";
import { Conversation } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";

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
  
  const { toast } = useToast();

  // Combine loading states
  const loading = conversationsLoading || messagesLoading;

  // Initialize conversations list on component mount
  useEffect(() => {
    fetchConversations().catch(error => {
      console.error("Error initializing conversations:", error);
    });
  }, []);

  // Fetch messages when currentConversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessagesBase(currentConversation.id).catch(error => {
        console.error("Error fetching messages:", error);
      });
    }
  }, [currentConversation?.id]);

  // Handle conversation selection with messages fetching
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessagesBase(conversation.id).catch(error => {
      console.error("Error fetching messages for conversation:", error);
    });
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
