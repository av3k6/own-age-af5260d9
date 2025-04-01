
import { useState, useEffect } from "react";
import { useConversations } from "../conversations/useConversations";
import { useMessages } from "../messages/useMessages";
import { Conversation } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteConversation } from "../conversations/useDeleteConversation";

export function useMessagingCore() {
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
    markMessagesAsRead,
  } = useMessages();
  
  const { deleteConversation, deleting: conversationDeleting } = useDeleteConversation();
  
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();

  // Combine loading states
  const loading = conversationsLoading || messagesLoading;
  const deleting = conversationDeleting;

  return {
    loading,
    deleting,
    conversations,
    messages,
    currentConversation,
    conversationsLoading,
    messagesLoading,
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
  };
}
