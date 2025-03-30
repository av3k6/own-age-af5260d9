
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Conversation } from "@/types/message";
import { MessagingState, UseConversationsReturn } from "./types";

export function useConversations(): UseConversationsReturn {
  const [state, setState] = useState<Pick<MessagingState, 'loading' | 'conversations' | 'currentConversation'>>({
    loading: false,
    conversations: [],
    currentConversation: null
  });
  
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-fetch conversations when the component mounts and user is available
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user?.id]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log("Fetching conversations for user:", user.id);
      
      // Make sure conversations table exists
      try {
        // Check if the conversations table exists
        const { error: checkError } = await supabase
          .from('conversations')
          .select('id')
          .limit(1);
          
        if (checkError && checkError.message.includes('does not exist')) {
          console.log("Conversations table doesn't exist yet. Creating sample data for development.");
          // In development, we could initialize tables here
          toast({
            title: "No messages found",
            description: "Your message inbox is empty",
          });
          setState(prev => ({ ...prev, loading: false, conversations: [] }));
          return;
        }
      } catch (e) {
        console.error("Error checking conversations table:", e);
      }
      
      // Fetch conversations
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('lastMessageAt', { ascending: false });
        
      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }
      
      console.log("Conversations fetched:", data?.length || 0);
      setState(prev => ({ 
        ...prev, 
        conversations: data || [],
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Could not load conversations",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false, conversations: [] }));
    }
  };

  const createConversation = async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ): Promise<Conversation | null> => {
    if (!user) return null;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log("Creating conversation with receiver:", receiverId);
      
      // Check if conversation already exists
      const { data: existingConversations, error: existingError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id, receiverId]);
        
      if (existingError) {
        console.error("Error checking existing conversations:", existingError);
      }
        
      if (existingConversations && existingConversations.length > 0) {
        // Conversation exists, return it
        const conversation = existingConversations[0];
        console.log("Found existing conversation:", conversation.id);
        setState(prev => ({ 
          ...prev, 
          currentConversation: conversation,
          loading: false 
        }));
        
        return conversation;
      }
      
      // Create new conversation
      const newConversation = {
        participants: [user.id, receiverId],
        lastMessageAt: new Date().toISOString(),
        subject,
        propertyId,
        unreadCount: 0,
      };
      
      const { data, error } = await supabase
        .from('conversations')
        .insert([newConversation])
        .select();
        
      if (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
      
      console.log("Created new conversation:", data[0].id);
      const conversation = data[0];
      
      // Update local state
      setState(prev => ({
        ...prev,
        conversations: [conversation, ...prev.conversations],
        currentConversation: conversation,
        loading: false
      }));
      
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error creating conversation",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
      return null;
    }
  };

  const setCurrentConversation = (conversation: Conversation | null) => {
    setState(prev => ({ ...prev, currentConversation: conversation }));
  };

  return {
    loading: state.loading,
    conversations: state.conversations,
    fetchConversations,
    currentConversation: state.currentConversation,
    setCurrentConversation,
    createConversation
  };
}
