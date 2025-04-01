
import { useState, useEffect, useCallback } from "react";
import { useConversations } from "./conversations/useConversations";
import { useMessages } from "./messages/useMessages";
import { Conversation } from "@/types/message";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
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
  
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Combine loading states
  const loading = conversationsLoading || messagesLoading || !isInitialized;

  // Initialize conversations list on component mount - with improved error handling
  useEffect(() => {
    const initializeMessages = async () => {
      if (!user) {
        console.log("User not available for message initialization");
        return;
      }
      
      try {
        console.log("Initializing messages system for user:", user.id);
        await fetchConversations();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing conversations:", error);
        toast({
          title: "Error loading messages",
          description: "Please try refreshing the page",
          variant: "destructive"
        });
        // Still mark as initialized to prevent infinite loading state
        setIsInitialized(true);
      }
    };
    
    if (user) {
      initializeMessages();
    }
  }, [user?.id]); // Depend on user.id instead of user object to prevent unnecessary reruns

  // Set up real-time subscriptions with improved cleanup
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up conversation subscription for user:", user.id);
    
    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel(`user-conversations-${user.id}`) // Use a unique channel name
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{${user.id}}`
      }, (payload) => {
        console.log("Conversation change detected:", payload.eventType);
        // Refresh conversations list when there are changes
        fetchConversations().catch(error => {
          console.error("Error refreshing conversations after update:", error);
        });
      })
      .subscribe((status) => {
        console.log(`Conversation subscription status: ${status}`);
      });
      
    return () => {
      console.log("Cleaning up conversation subscription");
      supabase.removeChannel(conversationsChannel);
    };
  }, [user?.id, supabase]); // Include supabase in dependencies

  // Fetch messages when currentConversation changes - now with retry mechanism
  const fetchMessages = useCallback(async (conversation: Conversation) => {
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
          toast({
            title: "Error loading messages",
            description: "We couldn't load your messages. Please try again later.",
            variant: "destructive"
          });
        }
      }
    };
    
    await attemptFetch();
  }, [fetchMessagesBase, markMessagesAsRead, setCurrentConversation]);

  // Wrapper for sending a message with improved error handling and retries
  const sendMessage = useCallback(async (conversationId: string, content: string, attachments?: File[]) => {
    console.log(`Sending message to conversation ${conversationId}: ${content.substring(0, 20)}...`);
    
    const attemptSend = async (retries = 2) => {
      try {
        await sendMessageBase(conversationId, content, attachments);
        
        // Refresh the messages for this conversation
        await fetchMessagesBase(conversationId);
        
        // Refresh the conversation list to show the updated last message
        await fetchConversations();
        
        toast({
          title: "Message sent",
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
          toast({
            title: "Error sending message",
            description: "Please try again later.",
            variant: "destructive"
          });
          throw error;
        }
      }
    };
    
    return attemptSend();
  }, [fetchConversations, fetchMessagesBase, sendMessageBase]);

  // Wrapper for creating a conversation with improved error handling
  const createNewConversation = useCallback(async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string,
    category: string = 'general'  // Default category
  ) => {
    console.log("Creating new conversation:", { receiverId, subject, initialMessage, propertyId, category });
    
    try {
      // Create conversation with category information
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
      
      // Refresh conversations after creating a new one
      await fetchConversations();
      
      toast({
        title: "Conversation created",
        description: "New conversation started successfully"
      });
      
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
  }, [createConversation, fetchConversations]);

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
  };
}
