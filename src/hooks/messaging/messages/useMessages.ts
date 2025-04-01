
import { useState, useEffect } from "react";
import { useFetchMessages } from "./useFetchMessages";
import { useMarkMessagesAsRead } from "./useMarkMessagesAsRead";
import { useSendMessage } from "./useSendMessage";
import { MessagesState, UseMessagesReturn } from "./types";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types/message";

export function useMessages(): UseMessagesReturn {
  const [state, setState] = useState<MessagesState>({
    loading: false,
    messages: []
  });
  
  const { fetchMessages: fetchMessagesBase } = useFetchMessages();
  const { markMessagesAsRead: markMessagesAsReadBase } = useMarkMessagesAsRead();
  const { sendMessage: sendMessageBase } = useSendMessage();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Set up real-time subscription for the current conversation
  useEffect(() => {
    if (!currentConversationId || !user) return;
    
    console.log(`Setting up real-time subscription for conversation: ${currentConversationId}`);
    
    // Subscribe to new messages in this conversation
    const messagesChannel = supabase
      .channel(`messages:${currentConversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversationId=eq.${currentConversationId}`
      }, (payload) => {
        console.log('New message received:', payload.new);
        
        // Add the new message to state if it's not from the current user
        const newMessage = payload.new as Message;
        if (newMessage.senderId !== user.id) {
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage]
          }));
          
          // Auto-mark as read if this is the active conversation
          markMessagesAsRead(currentConversationId);
        }
      })
      .subscribe();
      
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      console.log(`Removing subscription for conversation: ${currentConversationId}`);
      supabase.removeChannel(messagesChannel);
    };
  }, [currentConversationId, user]);

  // Wrapper functions that pass the state setter
  const fetchMessages = async (conversationId: string): Promise<void> => {
    setCurrentConversationId(conversationId);
    const messages = await fetchMessagesBase(conversationId, setState);
    if (messages && messages.length > 0) {
      await markMessagesAsRead(conversationId);
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    await sendMessageBase(conversationId, content, attachments, setState);
  };

  const markMessagesAsRead = async (conversationId: string) => {
    await markMessagesAsReadBase(conversationId, setState);
  };

  return {
    loading: state.loading,
    messages: state.messages,
    fetchMessages,
    sendMessage,
    markMessagesAsRead
  };
}
