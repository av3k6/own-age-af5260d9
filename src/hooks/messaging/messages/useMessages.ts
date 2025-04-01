
import { useState, useEffect, useCallback } from "react";
import { useFetchMessages } from "./useFetchMessages";
import { useMarkMessagesAsRead } from "./useMarkMessagesAsRead";
import { useSendMessage } from "./useSendMessage";
import { MessagesState, UseMessagesReturn } from "./types";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types/message";
import { useEncryptedMessaging } from "@/hooks/useEncryptedMessaging";
import { MessageDeliveryStatus } from "@/types/encryption";

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
  const { isEncryptionReady, decryptMessages } = useEncryptedMessaging();

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
        filter: `conversation_id=eq.${currentConversationId}`
      }, async (payload) => {
        console.log('New message received:', payload.new);
        
        // Add the new message to state if it's not from the current user
        const newMessage = payload.new as Message;
        
        if (newMessage.senderId !== user.id) {
          // If encryption is ready, try to decrypt the message
          const messagesToAdd = [newMessage];
          const processedMessages = isEncryptionReady 
            ? await decryptMessages(messagesToAdd)
            : messagesToAdd;
            
          setState(prev => ({
            ...prev,
            messages: [...prev.messages, ...processedMessages]
          }));
          
          // Auto-mark as read if this is the active conversation
          markMessagesAsRead(currentConversationId);
        }
      })
      // Also listen for message status updates
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${currentConversationId}`
      }, (payload) => {
        console.log('Message updated:', payload.new);
        
        // Update the message in state
        const updatedMessage = payload.new as Message;
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === updatedMessage.id 
              ? { ...msg, ...updatedMessage } 
              : msg
          )
        }));
      })
      .subscribe((status) => {
        console.log(`Messages subscription status: ${status}`);
      });
      
    // Cleanup subscription on unmount or when conversation changes
    return () => {
      console.log(`Removing subscription for conversation: ${currentConversationId}`);
      supabase.removeChannel(messagesChannel);
    };
  }, [currentConversationId, user, isEncryptionReady]);

  // Wrapper functions that pass the state setter
  const fetchMessages = useCallback(async (conversationId: string): Promise<void> => {
    setCurrentConversationId(conversationId);
    const messages = await fetchMessagesBase(conversationId, setState);
    
    if (messages && messages.length > 0) {
      // If encryption is ready, decrypt the messages
      if (isEncryptionReady) {
        const decryptedMessages = await decryptMessages(messages);
        setState(prev => ({ ...prev, messages: decryptedMessages }));
      }
      
      await markMessagesAsRead(conversationId);
    }
  }, [fetchMessagesBase, markMessagesAsReadBase, isEncryptionReady, decryptMessages]);

  const sendMessage = useCallback(async (conversationId: string, content: string, attachments?: File[]) => {
    try {
      // Update state to show the message as sending
      const tempId = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        senderId: user!.id,
        receiverId: "", // Will be set by the backend
        conversationId,
        content,
        read: false,
        createdAt: new Date().toISOString(),
        deliveryStatus: MessageDeliveryStatus.SENDING
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage]
      }));
      
      // Actually send the message
      await sendMessageBase(conversationId, content, attachments, setState);
      
      // Update the temp message to show as sent
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === tempId
            ? { ...msg, deliveryStatus: MessageDeliveryStatus.SENT }
            : msg
        )
      }));
    } catch (error) {
      console.error("Error in sendMessage:", error);
      
      // Update the temp message to show as failed
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === `temp-${Date.now()}`
            ? { ...msg, deliveryStatus: MessageDeliveryStatus.FAILED }
            : msg
        )
      }));
      
      throw error;
    }
  }, [sendMessageBase, user]);

  const markMessagesAsRead = useCallback(async (conversationId: string) => {
    await markMessagesAsReadBase(conversationId, setState);
  }, [markMessagesAsReadBase]);

  return {
    loading: state.loading,
    messages: state.messages,
    fetchMessages,
    sendMessage,
    markMessagesAsRead
  };
}
